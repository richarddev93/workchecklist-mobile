import { Service } from "@/types";
import { SQLiteRunResult } from "expo-sqlite";
import { DatabaseAdapter } from "@/core/config/storage/database.interface";
import { randomUUID } from "expo-crypto";

export type ServiceRepository = {
  getAll(): Promise<Service[] | null>;
  save(data: Omit<Service, "id" | "created_at" | "updated_at">, id: string): Promise<string>;
  update(id: string, data: Partial<Service>): Promise<SQLiteRunResult | undefined>;
  delete(id: string): Promise<SQLiteRunResult>;
};

export const createServiceRepository = (db: DatabaseAdapter): ServiceRepository => ({
  async getAll() {
    return await db.getAll<Service>(
      `SELECT * FROM service ORDER BY service_date DESC`
    );
  },

  async save(data, id) {
    try {
      console.log("ServiceRepository.save called with id:", id, "data:", data);
      
      await db.run(
        `INSERT INTO service (id, client_name, service_type, service_date, location, observations, template_id, status, progress, checklist_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `${id}`,
          `${data.client_name ?? ""}`,
          `${data.service_type ?? ""}`,
          `${data.service_date ?? ""}`,
          `${data.location ?? ""}`,
          `${data.observations ?? ""}`,
          `${data.template_id ?? ""}`,
          `${data.status ?? "in-progress"}`,
          `${data.progress ?? 0}`,
          `${data.checklist_data ?? ""}`,
        ]
      );
      console.log("Service saved successfully");
      return id;
    } catch (error) {
      console.error("Error in save:", error);
      throw error;
    }
  },

  async update(id: string, data) {
    return await db.run(
      `UPDATE service SET 
        client_name = COALESCE(?, client_name),
        service_type = COALESCE(?, service_type),
        service_date = COALESCE(?, service_date),
        location = COALESCE(?, location),
        observations = COALESCE(?, observations),
        template_id = COALESCE(?, template_id),
        status = COALESCE(?, status),
        progress = COALESCE(?, progress),
        checklist_data = COALESCE(?, checklist_data),
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
      [
        `${data.client_name ?? ""}`,
        `${data.service_type ?? ""}`,
        `${data.service_date ?? ""}`,
        `${data.location ?? ""}`,
        `${data.observations ?? ""}`,
        `${data.template_id ?? ""}`,
        `${data.status ?? ""}`,
        `${data.progress ?? ""}`,
        `${data.checklist_data ?? ""}`,
        `${id}`,
      ]
    );
  },

  async delete(id) {
    return await db.run(`DELETE FROM service WHERE id = ?`, [id]);
  },
});
