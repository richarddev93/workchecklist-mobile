import { CompanyInfo } from "@/types";

export interface Database {
  getCompany(): Promise<CompanyInfo | null>;
  saveCompany(data: CompanyInfo): Promise<void>;
}


export interface DatabaseAdapter {
  exec(sql: string): Promise<void>;
  getFirst<T>(sql: string): Promise<T | null>;
  transaction(fn: () => Promise<void>): Promise<void>;
}

