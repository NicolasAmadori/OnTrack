import getRedisClient from '#src/util/redisClient.js';
import { io } from "../../app.js";

export const getSelectedSeats = async function (trainCode) {
    const redis = await getRedisClient();
    const keys = await redis.keys(`lock_${trainCode}_*`);

    return keys.map(key => {
        const [_, trainCode, departureTime, arrivalTime, seat] = key.split("_");

        return {
            trainCode: trainCode,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            seat: seat,
            status: "locked"
        };
    });
}

export const handleSeatLock = async function (userId, bookingGroups) {
    const EXPIRATION_TIME = 3_000;

    if (!bookingGroups || !Array.isArray(bookingGroups)) {
        throw new Error("Invalid format: bookingGroups must be an array");
    }

    const redis = await getRedisClient();

    const luaScript = `
        local currentOwner = redis.call("get", KEYS[1])

        if not currentOwner then
            redis.call("set", KEYS[1], ARGV[1], "PX", ARGV[2])
            return "LOCKED"
        elseif currentOwner == ARGV[1] then
            redis.call("pexpire", KEYS[1], ARGV[2])
            return "RENEWED"
        else
            return "BUSY"
        end
    `;

    const operations = bookingGroups.flatMap((group) => {
        if (!group.seats || !Array.isArray(group.seats)) return [];

        return group.seats.map(async (seatNum) => {
            const lockKey = `lock_${group.trainCode}_${group.departureTime}_${group.arrivalTime}_${seatNum}`;

            try {
                const result = await redis.eval(luaScript, {
                    keys: [lockKey],
                    arguments: [userId, String(EXPIRATION_TIME)]
                });

                if (result === 'LOCKED') {
                    io.to(`train_${group.trainCode}`).emit('seat_selected', {
                        trainCode: group.trainCode,
                        departureTime: group.departureTime,
                        arrivalTime: group.arrivalTime,
                        seat: seatNum,
                        status: "locked"
                    });
                    return { seat: seatNum, success: true, status: 'locked' };

                } else if (result === 'RENEWED') {
                    return { seat: seatNum, success: true, status: 'renewed' };

                } else {
                    return { seat: seatNum, success: false, error: "Seat is already locked by another user" };
                }

            } catch (err) {
                console.error(`Redis error for seat ${seatNum}:`, err);
                return { seat: seatNum, success: false, error: err.message };
            }
        });
    });

    const results = await Promise.all(operations);
    const failedSeats = results.filter(r => !r.success);

    return {
        success: failedSeats.length === 0,
        results: results,
        failedSeats: failedSeats.length > 0 ? failedSeats : undefined
    };
};