import { db } from '../database/mysql';

export const mysql = {
  query<T = any>(sql: string, params?: any[]) {
    return db().query<T extends any ? any : never>(sql, params);
  }
};
