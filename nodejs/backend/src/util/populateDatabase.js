import User from '#src/models/userModel.js';
import Reservation from '#src/models/reservationModel.js';
import Solution from '#src/models/solutionModel.js';
import Train from '#src/models/trainModel.js';

const users = [
    {
        email: "admin@mail.com",
        first_name: "Mario",
        last_name: "Rossi",
        password: "$argon2id$v=19$m=19456,t=2,p=1$G1h2S+hVFyt5heDwWDlV8w$KRVRV+AcdylDYVP64xJo9HsTsn5P4+TfbpHNkCImKgc",
        is_admin: true,
        registration_date: new Date("2025-12-25T10:00:00Z")
    },
    {
        email: "riccardo.mazzi@mail.com",
        first_name: "Riccardo",
        last_name: "Mazzi",
        password: "$argon2id$v=19$m=19456,t=2,p=1$G1h2S+hVFyt5heDwWDlV8w$KRVRV+AcdylDYVP64xJo9HsTsn5P4+TfbpHNkCImKgc",
        is_admin: false,
        registration_date: new Date("2025-12-25T10:00:00Z")
    },
    {
        email: "nicolas.amadori@mail.com",
        first_name: "Nicolas",
        last_name: "Amadori",
        password: "$argon2id$v=19$m=19456,t=2,p=1$G1h2S+hVFyt5heDwWDlV8w$KRVRV+AcdylDYVP64xJo9HsTsn5P4+TfbpHNkCImKgc",
        is_admin: false,
        registration_date: new Date("2025-12-25T10:00:00Z")
    },
];

const reservations = [
    {
        solution_id: "SOL001",
        email: "riccardo.mazzi@mail.com",
        passengers: [
            {
                first_name: "Nicolas",
                last_name: "Amadori",
                seats: [
                    {
                        seat: "1A",
                        train: "69667b56b0b90d2b71e06991",
                        train_acronym: "FR3940",
                        departure_time: new Date("2026-01-09T08:00:00Z"),
                        arrival_time: new Date("2026-01-09T09:30:00Z"),
                    },
                    {
                        seat: "1B",
                        train: "69667b56b0b90d2b71e06992",
                        train_acronym: "FR3942",
                        departure_time: new Date("2026-01-09T09:45:00Z"),
                        arrival_time: new Date("2026-01-09T11:00:00Z"),
                    }
                ],
            }
        ]
        
    },
    {
        solution_id: "SOL002",
        email: "riccardo.mazzi@mail.com",
        passengers: [
            {
                first_name: "Riccardo",
                last_name: "Mazzi",
                seats: [
                    {
                        seat: "2A",
                        train: "69667b56b0b90d2b71e06993",
                        train_acronym: "FR9400",
                        departure_time: new Date("2026-01-09T09:30:00Z"),
                        arrival_time: new Date("2026-01-09T10:30:00Z"),
                    }
                ]
            },
            {
                first_name: "Mario",
                last_name: "Rossi",
                seats: [
                    {
                        seat: "2B",
                        train: "69667b56b0b90d2b71e06993",
                        train_acronym: "FR9400",
                        departure_time: new Date("2026-01-09T09:30:00Z"),
                        arrival_time: new Date("2026-01-09T10:30:00Z"),
                    }
                ]
            }
            
        ]
    }
];

const trains = [
    {
        _id: "69667b56b0b90d2b71e06991",
        code: "FR3940",
        logo_id: "FR",
        name: "3940",
        acronym: "FR",
        denomination: "Frecciarossa",
        date: new Date("2026-01-09"),
        delay: 67
    },
    {
        _id: "69667b56b0b90d2b71e06992",
        code: "FR3942",
        logo_id: "FR",
        name: "3942",
        acronym: "FR",
        denomination: "Frecciarossa",
        date: new Date("2026-01-09"),
        delay: 15
    },
    {
        _id: "69667b56b0b90d2b71e06993",
        code: "FR9400",
        logo_id: "FR",
        name: "9400",
        acronym: "FR",
        denomination: "Frecciarossa",
        date: new Date("2026-01-09"),
        delay: 5
    }
]

const solutions = [
    {
        solution_id: "SOL001",
        origin: "Roma",
        destination: "Milano",
        departure_time: new Date("2026-01-09T08:00:00Z"),
        arrival_time: new Date("2026-01-09T11:00:00Z"),
        duration: "3h",
        status: "Confirmed",
        price_currency: "€",
        price_amount: 49.99,
        nodes: [
            {
                origin: "Roma",
                origin_id: "S0527",
                destination: "Bologna Centrale",
                destination_id: "S0529",
                departure_time: new Date("2026-01-09T08:00:00Z"),
                arrival_time: new Date("2026-01-09T09:30:00Z"),
                train: "69667b56b0b90d2b71e06991"
            },
            {
                origin: "Bologna Centrale",
                origin_id: "S0529",
                destination: "Milano",
                destination_id: "S0531",
                departure_time: new Date("2026-01-09T09:45:00Z"),
                arrival_time: new Date("2026-01-09T11:00:00Z"),
                train: "69667b56b0b90d2b71e06992",
            }
        ]
    },
    {
        solution_id: "SOL002",
        origin: "Napoli",
        destination: "Roma",
        departure_time: new Date("2026-01-09T09:30:00Z"),
        arrival_time: new Date("2026-01-09T12:00:00Z"),
        duration: "2h 30m",
        status: "Pending",
        price_currency: "€",
        price_amount: 29.50,
        nodes: [
            {
                origin: "Napoli",
                origin_id: "S0540",
                destination: "Roma",
                destination_id: "S0527",
                departure_time: new Date("2026-01-09T09:30:00Z"),
                arrival_time: new Date("2026-01-09T12:00:00Z"),
                train: "69667b56b0b90d2b71e06993",
            }
        ]
    },
];

const createUsers = async () => {
    try {
        const operations = users.map(user =>
            User.updateOne(
                { email: user.email },
                { $set: user },
                { upsert: true }
            )
        );
        await Promise.all(operations);
    } catch (error) {
        throw error;
    }
};

const createTrains = async () => {
    try {
        const operations = trains.map(train =>
            Train.updateOne(
                { _id: train._id },
                { $set: train },
                { upsert: true }
            )
        );
        await Promise.all(operations);
    } catch (error) {
        throw error;
    }
};

const createSolutions = async () => {
    try {
        const operations = solutions.map(s =>
            Solution.updateOne(
                { solution_id: s.solution_id },
                { $set: s },
                { upsert: true }
            )
        );
        await Promise.all(operations);
    } catch (error) {
        throw error;
    }
};

const createReservations = async () => {
    try {
        const operations = reservations.map(r => 
            Reservation.updateOne(
                { solution_id: r.solution_id, email: r.email },
                { $set: r },
                { upsert: true }
            )
        );
        await Promise.all(operations);
        return await Reservation.find();
    } catch (error) {
        throw error;
    }
}


const populateDatabase = async () => {
    try {
        await createUsers();
        await createTrains();
        await createSolutions();
        const reservations = await createReservations();

        const nicolas = await User.findOne({ email: "nicolas.amadori@mail.com" });
        const riccardo = await User.findOne({ email: "riccardo.mazzi@mail.com" });
        // nicolas.reservations = reservations.filter(r => r.email === "nicolas.amadori@mail.com").map(r => r._id);
        riccardo.reservations = reservations.filter(r => r.email === "riccardo.mazzi@mail.com").map(r => r._id);
        await nicolas.save();
        await riccardo.save();
    } catch (error) {
        console.error('Fatal Error in database seeding:', error);
    }
};

export default populateDatabase;