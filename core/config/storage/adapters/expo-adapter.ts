import * as SQLite from "expo-sqlite";
import { DatabaseAdapter } from "../database.interface";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("workchecklist-db");
  }
  return dbPromise;
}

export async function createExpoDbAdapter(): Promise<DatabaseAdapter> {
  const sqlite = await getDb();

  return {
    exec: (sql) => {
      // console.log("Executing SQL:", sql);
      return sqlite.execAsync(sql);
    },
    getFirst: (sql) => {
      // console.log("Getting first with SQL:", sql);
      return sqlite.getFirstAsync(sql);
    },
    transaction: (fn) => sqlite.withExclusiveTransactionAsync(fn),
    getAll: (srcName) => {
      try {
        // console.log("DB getAll ->", srcName);
        if (!srcName) {
          throw new Error("getAll called with empty SQL");
        }
        return sqlite.getAllAsync(srcName);
      } catch (error) {
        console.error("Expo Adapter - getAllAsync failed:", error);
        throw error;
      }
    },
    run: (sql, params) => {
      try {
        // console.log("DB run ->", sql, "params:", params);
        if (!sql) {
          throw new Error("run called with empty SQL");
        }
        return sqlite.runAsync(sql, params);
      } catch (error) {
        console.error("Expo Adapter - runAsync failed:", error);
        throw error;
      }
    },
  };
}
