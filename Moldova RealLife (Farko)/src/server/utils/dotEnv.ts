import dotenv from "dotenv";

const parsedDotEnv = dotenv.config({ debug: false }).parsed;

export class DotEnv {
  public static readVariable<T extends "string" | "boolean" | "number">(
    key: string,
    type: T
  ): T extends "string"
    ? string
    : T extends "boolean"
    ? boolean
    : T extends "number"
    ? number
    : undefined {
    const parsed = parsedDotEnv?.[key] || process.env[key];

    return typeof parsed !== "undefined"
      ? type === "number"
        ? (Number(parsed) as any)
        : type === "boolean"
        ? (Boolean(parsed) as any)
        : (`${parsed}` as any)
      : (undefined as any);
  }
}
