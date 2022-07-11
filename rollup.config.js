import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const cfg = [
  {
    input: "./src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "umd",
        name: "Client",
        globals: { axios: "Axios", "@sentry/browser": "SentryBrowser"},
      },{
        file: pkg.module,
        format: "esm",
      },
    ],
    plugins: [typescript(), terser()],
    external: ["@sentry/browser", "axios"],
  },
];

export default cfg;
