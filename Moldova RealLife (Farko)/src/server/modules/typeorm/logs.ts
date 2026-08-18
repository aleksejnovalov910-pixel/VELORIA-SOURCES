import "reflect-metadata";
import { createConnection } from "typeorm";
import { LogEntity, LogFamilyEntity, LogItemsEntity } from "./entities/log";
import { InventoryLogEntity } from "./entities/inventoryLog";
import { AdminDialogEntity, AdminStatEntity } from "./entities/adminLogs";

import type { Connection } from "typeorm";
import { DotEnv } from "@/utils/dotEnv";

export let dbLogsConnection: Connection;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const initLogsDatabaseConnection = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    createConnection({
      debug: false,
      type: "mariadb",
      host: DotEnv.readVariable("MARIADB_HOST", "string"),
      port: 3306,
      username: DotEnv.readVariable("MARIADB_USERNAME", "string"),
      password: DotEnv.readVariable("MARIADB_PASSWORD", "string"),
      database: DotEnv.readVariable("MARIADB_DATABASE", "string"),
      charset: "UTF8_GENERAL_CI",
      entities: [
        LogEntity,
        InventoryLogEntity,
        LogItemsEntity,
        LogFamilyEntity,
        AdminDialogEntity,
        AdminStatEntity,
      ],
      synchronize: true,
      logging: false,
    })
      .then((connection) => {
        dbLogsConnection = connection;
        resolve(connection);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};
