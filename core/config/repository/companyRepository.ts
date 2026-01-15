import { CompanyInfo } from "@/types";
import { DatabaseAdapter } from "../storage/database.interface";

export type CompanyRepository = {
  getCompany(): Promise<CompanyInfo | null>;
  saveCompany(data: Partial<CompanyInfo>): Promise<void>;
};

export const createCompanyRepository = (db: DatabaseAdapter):CompanyRepository => ({
  async getCompany() {
    return await db.getFirst<CompanyInfo>(
      'SELECT * FROM company WHERE id = 1;'
    );
  },

  async saveCompany(data: CompanyInfo) {
    await db.exec(`
      INSERT INTO company (id, name, logo, phone, email, address)
      VALUES (1, '${data.name}', '${data.logo}', '${data.phone}', '${data.email}', '${data.address}')
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        logo = excluded.logo,
        phone = excluded.phone,
        email = excluded.email,
        address = excluded.address,
        updated_at = CURRENT_TIMESTAMP;
    `);
  },
});
