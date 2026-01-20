import getRedisClient from "./redisClient.js";

export async function listenToExpirations(io) {
    const mainClient = await getRedisClient();

    await mainClient.configSet("notify-keyspace-events", "Ex");

    const subscriber = mainClient.duplicate();
    await subscriber.connect();

    const channel = "__keyevent@0__:expired";

    await subscriber.subscribe(channel, (message) => {
        const [_, trainCode, departureTime, arrivalTime, seat] = message.split("_");
        io.to(`train_${trainCode}`).emit('seat_selected', {
            trainCode: trainCode,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            seat: seat,
            status: "unlocked"
        });
    });
}