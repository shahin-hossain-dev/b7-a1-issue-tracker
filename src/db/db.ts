import { pool } from "../config/connectDB";

export async function initDb() {
  try {
    const createUserTable = `
    DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('contributor', 'maintainer');
    EXCEPTION
    WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role user_role DEFAULT 'contributor',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `;

    const createIssuesTable = `

    DO $$ BEGIN
    CREATE TYPE issue_type AS ENUM (
        'bug',
        'feature_request'
    );
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
        CREATE TYPE issue_status AS ENUM (
            'open',
            'in_progress',
            'resolved'
        );
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;


    CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT CHECK(char_length(description) >= 20) NOT NULL,
    type issue_type NOT NULL,
    status issue_status DEFAULT 'open',
    reporter_id INT REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    )
    
    `;

    await pool.query(createUserTable);
    await pool.query(createIssuesTable);

    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
}
