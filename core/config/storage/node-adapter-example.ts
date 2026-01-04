/*import Database from 'better-sqlite3';
import { DatabaseAdapter } from './database';

const db = new Database('app.db');

export const nodeDbAdapter: DatabaseAdapter = {
  exec: async sql => {
    db.exec(sql);
  },

  getFirst: async sql => {
    const stmt = db.prepare(sql);
    return stmt.get() ?? null;
  },

  transaction: async fn => {
    const trx = db.transaction(fn);
    trx();
    return null as any;
  },
};
*/