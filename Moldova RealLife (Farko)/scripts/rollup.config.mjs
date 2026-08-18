import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import jsonPlugin from "@rollup/plugin-json";
import { swc } from "rollup-plugin-swc3";
import builtinModules from "builtin-modules";
import { resolve } from "node:path";
import jetpack from "fs-jetpack";

const resolvePath = (...parts) => jetpack.path(...parts);

/**
 * @param {"server" | "client"} side
 * @returns {import("rollup").RollupOptions}
 */
function generateRollupConfig(side) {
  const outputFile = resolvePath(
    "server",
    side === "server"
      ? "packages/gamemode/index.js"
      : "client_packages/index.js"
  );
  const tsConfigPath = resolvePath("src", side, "tsconfig.json");
  const inputPath = resolve("src", side, "index.ts");

  return {
    input: inputPath,
    output: {
      file: outputFile,
      format: "cjs",
    },
    external: side === "server" ? [...builtinModules] : [],
    plugins: [
      side === "client" && nodeResolve(),
      jsonPlugin(),
      commonjs(),
      swc({
        tsconfig: tsConfigPath,
        jsc: {
          target: "es5",
          transform: {
            decoratorMetadata: true,
            legacyDecorator: true,
          },
        },
      }),
    ],
    onwarn: (warning) => {
      if (["UNRESOLVED_IMPORT", "CIRCULAR_DEPENDENCY"].includes(warning.code))
        return;
    },
  };
}

export default [generateRollupConfig("server"), generateRollupConfig("client")];
