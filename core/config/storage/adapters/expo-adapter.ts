import * as SQLite from "expo-sqlite";
import { DatabaseAdapter } from "../database.interface";

export async function createExpoDbAdapter(): Promise<DatabaseAdapter> {
  const sqlite = await SQLite.openDatabaseAsync("workchecklist-db");

  return {
    exec: (sql) => sqlite.execAsync(sql),
    getFirst: (sql) => sqlite.getFirstAsync(sql),
    transaction: (fn) => sqlite.withExclusiveTransactionAsync(fn),
    getAll: (srcName) => sqlite.getAllAsync(srcName),
    run: (sql, params) => sqlite.runAsync(sql, params),
  };
}
