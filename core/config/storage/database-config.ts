import { DatabaseAdapter } from "./database.interface";

type Migration = {
  version: number;
  up: (db: DatabaseAdapter) => Promise<void>;
};

export const migrations: Migration[] = [
  {
    version: 1,
    up: async (db) => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS company (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          logo TEXT,
          phone TEXT,
          email TEXT,
          address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    },
  },

  {
    version: 2,
    up: async (db) => {
      await db.exec(`
        ALTER TABLE company ADD COLUMN cnpj TEXT;
      `);
    },
  },
  {
    version: 3,
    up: async (db) => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS service_type (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          slug TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    },
  },
  {
    version: 4,
    up: async (db) => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS service_template (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          items TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    },
  },
  {
    version: 5,
    up: async (db) => {
      await db.exec(`
        ALTER TABLE service_template ADD COLUMN service_type TEXT NOT NULL
      `);
    },
  },
];

export async function runMigrations(db: DatabaseAdapter) {
  console.log("DB - run migrations");
  const row = await db.getFirst<{ user_version: number }>(
    "PRAGMA user_version;",
  );

  let currentVersion = row?.user_version ?? 0;
  console.log("DB Version:", currentVersion);

  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      await migration.up(db);
      await db.exec(`PRAGMA user_version = ${migration.version};`);
      currentVersion = migration.version;
    }
  }
}

export async function initDatabase(db: DatabaseAdapter) {
  await db.transaction(async () => {
    await runMigrations(db);
  });
}
