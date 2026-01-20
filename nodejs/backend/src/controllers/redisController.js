import getRedisClient from '#src/util/redisClient.js';
import {io} from "../../app.js";

export const getSelectedSeats = async function(req, res) {
    const solutionId = req.params.solutionId;
    try {
        const redis = await getRedisClient();
        const keys = await redis.keys(`lock:${solutionId}:*`);

        const seatMap = {};

        keys.forEach(key => {
            const suffix = key.replace(`lock:${solutionId}:`, "");
            const [nodeId, seatNumber] = suffix.split(":");

            if (!seatMap[nodeId]) {
                seatMap[nodeId] = [];
            }
            seatMap[nodeId].push(seatNumber);
        });

        res.status(200).json({ success: true, locked_seats: seatMap});
    } catch (err) {
        return res.status(500).json({ success: false, errors: [{ message: err.message }] });
    }
};

export const createOrRenewLock = async function(req, res) {
    const EXPIRATION_TIME = 5_000;
    const userId = req.user && req.user.id;
    const { bookingGroups } = req.body;

    if (!bookingGroups || !Array.isArray(bookingGroups)) {
        return res.status(400).json({ success: false, message: "Invalid format" });
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
            const lockKey = `lock:${group.trainCode}:${group.departureTime}:${group.arrivalTime}:${seatNum}`;

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
                    console.log("NEW LOCK: " + lockKey);
                    return { seat: seatNum, success: true, status: 'locked' };

                } else if (result === 'RENEWED') {
                    console.log("RENEWED: " + lockKey);
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

    if (failedSeats.length > 0) {
        return res.status(423).json({
            success: false,
            message: "Some seats could not be locked",
            failedSeats: failedSeats
        });
    }

    return res.status(200).json({
        success: true,
        results: results
    });
};