import * as SQLite from "expo-sqlite";
import { DatabaseAdapter } from "../database.interface";

export async function createExpoDbAdapter(): Promise<DatabaseAdapter> {
  const sqlite = await SQLite.openDatabaseAsync("workchecklist-db");

  return {
    exec: (sql) => {
      console.log("Executing SQL:", sql);
      return sqlite.execAsync(sql);
    },
    getFirst: (sql) => {
      console.log("Getting first with SQL:", sql);
      return sqlite.getFirstAsync(sql);
    },
    transaction: (fn) => sqlite.withExclusiveTransactionAsync(fn),
    getAll: (srcName) => {
      console.log("Getting all with SQL:", srcName);
      return sqlite.getAllAsync(srcName);
    },
    run: (sql, params) => {
      console.log("Running SQL:", sql, "with params:", params);
      return sqlite.runAsync(sql, params);
    },
  };
}
