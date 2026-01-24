import { DatabaseAdapter } from "@/core/config/storage/database.interface";
import { Service } from "@/types";
import { SQLiteRunResult } from "expo-sqlite";

export type ServiceRepository = {
  getAll(): Promise<Service[] | null>;
  save(
    data: Omit<Service, "id" | "created_at" | "updated_at">,
    id: string,
  ): Promise<string>;
  update(
    id: string,
    data: Partial<Service>,
  ): Promise<SQLiteRunResult | undefined>;
  delete(id: string): Promise<SQLiteRunResult>;
};

export const createServiceRepository = (
  db: DatabaseAdapter,
): ServiceRepository => ({
  async getAll() {
    return await db.getAll<Service>(
      `SELECT * FROM service ORDER BY service_date DESC`,
    );
  },

  async save(data, id) {
    try {
      // console.log("ServiceRepository.save called with id:", id, "data:", data);

      const params = [
        id || "",
        data.client_name?.trim() || "",
        data.service_type?.trim() || "",
        data.service_date?.trim() || "",
        data.location?.trim() || "",
        data.observations?.trim() ? String(data.observations.trim()) : null,
        data.template_id ? String(data.template_id) : null,
        data.status || "in-progress",
        Number(data.progress ?? 0),
        data.checklist_data ? String(data.checklist_data) : null,
      ];

      // console.log("Insert parameters:", params);

      await db.run(
        `INSERT INTO service (id, client_name, service_type, service_date, location, observations, template_id, status, progress, checklist_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params,
      );
      // console.log("Service saved successfully");
      return id;
    } catch (error) {
      console.error("Error in save:", error);
      throw error;
    }
  },

  async update(id: string, data) {
    try {
      // console.log(
      //   "ServiceRepository.update called with id:",
      //   id,
      //   "data:",
      //   data,
      // );

      // Build dynamic SET clause with only provided fields
      const fields: string[] = [];
      const values: any[] = [];

      if (data.client_name !== undefined) {
        fields.push("client_name = ?");
        values.push(data.client_name?.trim() || "");
      }
      if (data.service_type !== undefined) {
        fields.push("service_type = ?");
        values.push(data.service_type?.trim() || "");
      }
      if (data.service_date !== undefined) {
        fields.push("service_date = ?");
        values.push(data.service_date?.trim() || "");
      }
      if (data.location !== undefined) {
        fields.push("location = ?");
        values.push(data.location?.trim() || "");
      }
      if (data.observations !== undefined) {
        fields.push("observations = ?");
        values.push(
          data.observations?.trim() ? String(data.observations.trim()) : null,
        );
      }
      if (data.template_id !== undefined) {
        fields.push("template_id = ?");
        values.push(data.template_id ? String(data.template_id) : null);
      }
      if (data.status !== undefined) {
        fields.push("status = ?");
        values.push(data.status?.trim() || "");
      }
      if (data.progress !== undefined) {
        fields.push("progress = ?");
        values.push(Number(data.progress ?? 0));
      }
      if (data.checklist_data !== undefined) {
        fields.push("checklist_data = ?");
        values.push(data.checklist_data ? String(data.checklist_data) : null);
      }

      if (fields.length === 0) {
        console.warn("ServiceRepository.update - No fields to update");
        return;
      }

      // Always update updated_at
      fields.push("updated_at = CURRENT_TIMESTAMP");

      // Add id as the last parameter for WHERE clause
      values.push(id);

      const sql = `UPDATE service SET ${fields.join(", ")} WHERE id = ?`;
      // console.log("ServiceRepository.update - SQL:", sql);
      // console.log("ServiceRepository.update - Values:", values);

      const result = await db.run(sql, values);

      // console.log(
      //   "Service updated successfully, rows affected:",
      //   result?.changes,
      // );
      return result;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      // console.log("ServiceRepository.delete called with id:", id);
      const result = await db.run(`DELETE FROM service WHERE id = ?`, [id]);
      // console.log(
      //   "Service deleted successfully, rows affected:",
      //   result?.changes,
      // );
      return result;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  },
});
