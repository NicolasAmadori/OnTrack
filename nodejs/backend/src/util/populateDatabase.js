import User from '../models/userModel.js';

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

const populateDatabase = async () => {
    try {
        await createUsers();
    } catch (error) {
        console.error('Errore fatale nel seeding del database:', error);
    }
};

export default populateDatabase;