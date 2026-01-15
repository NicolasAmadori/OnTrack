import Train from '#src/models/trainModel.js';

export const addTrainsToDB = async function(solutions) {
    const uniqueTrains = new Map();

    solutions
        .filter(s => s.solution.nodes)
        .forEach(s => {
        s.solution.nodes.forEach(n => {
            const trainCode = n.train.acronym + n.train.name;
            const trainDate = `${n.departureTime.split('T')[0]}T00:00:00.000Z`;
            const uniqueKey = `${trainCode}_${trainDate}`;

            if (!uniqueTrains.has(uniqueKey)) {
                uniqueTrains.set(uniqueKey, {
                    code: trainCode,
                    date: trainDate,
                    logo_id: n.train.logoId,
                    name: n.train.name,
                    acronym: n.train.acronym,
                    denomination: n.train.denomination,
                });
            }
        });
    });

    const operations = Array.from(uniqueTrains.values()).map(train => {
        return {
            updateOne: {
                filter: { code: train.code, date: train.date },
                update: {
                    $setOnInsert: {
                        code: train.code,
                        date: train.date,
                        logo_id: train.logo_id,
                        name: train.name,
                        acronym: train.acronym,
                        denomination: train.denomination,
                        bathrooms: [{ isOccupied: false }, { isOccupied: false }],
                    }
                },
                upsert: true
            }
        };
    });

    if (operations.length > 0) {
        await Train.bulkWrite(operations);
    }
};