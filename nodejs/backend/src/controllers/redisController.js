import getRedisClient from '#src/util/redisClient.js';

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
    const EXPIRATION_TIME = 1000;
    const solutionId = req.params.solutionId;
    const { nodeId, seat } = req.body;
    const userId = req.user && req.user.id;

    const lockKey = `lock:${solutionId}:${nodeId}:${seat}`;
    try {
        const redis = await getRedisClient();

        const result = await redis.set(lockKey, userId, {
            NX: true,
            PX: EXPIRATION_TIME
        });

        if (result === 'OK') {
            return res.status(200).json({ success: true });
        }

        // Caso in cui il lock esiste già, controllo chi è il proprietario
        const currentValue = await redis.get(lockKey);
        if (currentValue === userId) {
            const success = await redis.pExpire(lockKey, EXPIRATION_TIME);
            if (success === 1) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(404).json({ success: false, errors: [{ message: "Lock not found during renewal" }]});
            }
        } else {
            return res.status(423).json({ success: false, errors: [{ message: "Seat is already locked by another user" }]});
        }
    } catch (err) {
        return res.status(500).json({ success: false, errors: [{ message: err.message }]});
    }
};

export const deleteLock = async function(req, res) {
    const { solutionId, nodeId, seat } = req.params;
    const userId = req.user && req.user.id;

    const lockKey = `lock:${solutionId}:${nodeId}:${seat}`;

    try {
        const redis = await getRedisClient();

        const currentValue = await redis.get(lockKey);
        if (!currentValue) {
            return res.status(404).json({ success: false, errors: [{ message: "Lock not found" }]});
        }

        if (currentValue !== userId) {
            return res.status(403).json({ success: false, errors: [{ message: "You do not own this lock" }]});
        }

        await redis.del(lockKey);
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, errors: [{ message: err.message }]});
    }
};