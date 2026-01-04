import * as SQLite from "expo-sqlite";
import { DatabaseAdapter } from "../database";


export async function createExpoDbAdapter(): Promise<DatabaseAdapter> {
  const sqlite = await SQLite.openDatabaseAsync('workchecklist-db');

  return {
    exec: sql => sqlite.execAsync(sql),
    getFirst: sql => sqlite.getFirstAsync(sql),
    transaction: fn => sqlite.withExclusiveTransactionAsync(fn),
  };
}