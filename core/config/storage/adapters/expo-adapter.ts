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
      console.log("Expo Adapter - Running SQL:", sql);
      console.log("Expo Adapter - Params count:", params?.length);
      console.log("Expo Adapter - Params types:", params?.map(p => typeof p));
      console.log("Expo Adapter - Params values preview:", params?.map((p, i) => 
        typeof p === 'string' && p.length > 100 
          ? `[${i}]: string(${p.length} chars)` 
          : `[${i}]: ${JSON.stringify(p)}`
      ));
      
      try {
        return sqlite.runAsync(sql, params);
      } catch (error) {
        console.error("Expo Adapter - runAsync failed:", error);
        throw error;
      }
    },
  };
}
