import { ServiceType } from "@/types";
import { SQLiteRunResult } from "expo-sqlite";
import { DatabaseAdapter } from "../storage/database.interface";

export type ServiceTypeRepository = {
  getAll(): Promise<ServiceType[] | null>;
  save(data: Partial<ServiceType>): Promise<void>;
  delete(id: string): Promise<SQLiteRunResult>;
  edit(data: Partial<ServiceType>): Promise<SQLiteRunResult | undefined>;
};

export const createServiceTypeRepository = (
  db: DatabaseAdapter
): ServiceTypeRepository => ({
  async getAll() {
    return await db.getAll<ServiceType>("SELECT * FROM service_type");
  },

  async save(data: ServiceType) {
    await db.run(
      `INSERT OR REPLACE INTO service_type (
   name, slug
  ) VALUES (?, ?)`,
      [data.name, data.slug ?? ""]
    );
  },
  async edit(data: ServiceType) {
    return await db.run(
      `UPDATE service_type SET 
          name = ?,
          slug= ?,
          WHERE id = ?`,
      [data.name, data.slug ?? "", data.id]
    );
  },
  async delete(id) {
    return await db.run(`DELETE FROM service_type WHERE id = ?`, [id]);
  },
});
