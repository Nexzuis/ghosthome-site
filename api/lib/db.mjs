import pg from "pg";
const { Pool } = pg;

let pool;

export function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.POSTGRES_URL,
            ssl: { rejectUnauthorized: false }
        });
    }
    return pool;
}

export async function getDb() {
    return await getPool().connect();
}

export async function ensureLogTable(db) {
    return await db.query(`
        create table if not exists notify_log (
        id serial8 NOT NULL,
        payload text NULL,
        body text NULL,
        created_at timestamptz DEFAULT now() NULL,
        CONSTRAINT notify_log_pk PRIMARY KEY (id)
    );`);
}
