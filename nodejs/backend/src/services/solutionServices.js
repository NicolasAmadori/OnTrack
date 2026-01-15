import Solution from '#src/models/solutionModel.js';
import Train from '#src/models/trainModel.js';

/**
 * Normalizza una data stringa all'inizio della giornata in formato ISO.
 */
const getNormalizedDateISO = (dateString) => {
    if (!dateString) return null;
    return `${dateString.split('T')[0]}T00:00:00.000Z`;
};

/**
 * Genera una chiave univoca per identificare un treno.
 */
const generateTrainKey = (node) => {
    const trainCode = node.train.acronym + node.train.name;
    const trainDate = getNormalizedDateISO(node.departureTime);
    return {
        key: `${trainCode}|${trainDate}`,
        code: trainCode,
        date: trainDate
    };
};

/**
 * Crea una mappa di lookup (Key -> ID) per i treni esistenti.
 */
const fetchTrainLookupMap = async (uniqueTrainKeys) => {
    const queryConditions = Array.from(uniqueTrainKeys).map(key => {
        const [code, date] = key.split('|');
        return { code, date };
    });

    if (queryConditions.length === 0) return {};

    const foundTrains = await Train.find({ $or: queryConditions }).select('code date _id').lean();

    return foundTrains.reduce((acc, t) => {
        const dString = t.date instanceof Date ? t.date.toISOString() : t.date;
        acc[`${t.code}|${dString}`] = t._id;
        return acc;
    }, {});
};

export const addSolutionsToDB = async function(solutions) {
    const uniqueTrainKeys = new Set();

    solutions.forEach(sol => {
        sol.solution.nodes?.forEach(node => {
            const { key } = generateTrainKey(node);
            uniqueTrainKeys.add(key);
        });
    });

    const trainMap = await fetchTrainLookupMap(uniqueTrainKeys);

    const operations = solutions.map(sol => {
        const { id, origin, destination, departureTime, arrivalTime, duration, status, price, nodes } = sol.solution;

        const mappedNodes = nodes?.map(node => {
            const { key } = generateTrainKey(node);

            return {
                origin: node.origin,
                destination: node.destination,
                departure_time: node.departureTime ? new Date(node.departureTime) : null,
                arrival_time: node.arrivalTime ? new Date(node.arrivalTime) : null,
                train: trainMap[key] || null
            };
        });

        return {
            updateOne: {
                filter: { solution_id: id },
                update: {
                    $setOnInsert: {
                        solution_id: id,
                        origin,
                        destination,
                        departure_time: new Date(departureTime),
                        arrival_time: new Date(arrivalTime),
                        duration,
                        status,
                        price_currency: price?.currency || null,
                        price_amount: price?.amount || null,
                        nodes: mappedNodes
                    }
                },
                upsert: true
            }
        };
    });

    if (operations.length > 0) {
        await Solution.bulkWrite(operations);
    }
};

export const getSolutionByID = async function(id) {
    return Solution.findOne({solution_id: id})
        .populate('nodes.train')
        .exec();
}