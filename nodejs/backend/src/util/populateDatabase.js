import User from '../models/userModel.js';
import Reservation from '../models/reservationModel.js';

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
        email: "nicolas.amadori@mail.com",
        passengers: [
            {
                first_name: "Nicolas",
                last_name: "Amadori",
                seats: [
                    {
                        seat: "1A",
                        train_id: "FR3940",
                        departure_time: new Date("2025-06-01T08:00:00Z"),
                        arrival_time: new Date("2025-06-01T09:30:00Z"),
                    },
                    {
                        seat: "1B",
                        train_id: "FR3942",
                        departure_time: new Date("2025-06-01T09:45:00Z"),
                        arrival_time: new Date("2025-06-01T11:00:00Z"),
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
                        train_id: "FR9400",
                        departure_time: new Date("2025-06-02T09:30:00Z"),
                        arrival_time: new Date("2025-06-02T10:30:00Z"),
                    }
                ]
            },
            {
                first_name: "Mario",
                last_name: "Rossi",
                seats: [
                    {
                        seat: "2B",
                        train_id: "FR9400",
                        departure_time: new Date("2025-06-02T09:30:00Z"),
                        arrival_time: new Date("2025-06-02T10:30:00Z"),
                    }
                ]
            }
            
        ]
    }
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
        const reservations = await createReservations();

        const nicolas = await User.findOne({ email: "nicolas.amadori@mail.com" });
        const riccardo = await User.findOne({ email: "riccardo.mazzi@mail.com" });
        nicolas.reservations = [reservations.find(r => r.email === "nicolas.amadori@mail.com")._id];
        riccardo.reservations = [reservations.find(r => r.email === "riccardo.mazzi@mail.com")._id];
        await nicolas.save();
        await riccardo.save();
    } catch (error) {
        console.error('Fatal Error in database seeding:', error);
    }
};

export default populateDatabase;