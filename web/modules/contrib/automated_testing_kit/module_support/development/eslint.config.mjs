import cypress from "eslint-plugin-cypress";
import chaiFriendly from "eslint-plugin-chai-friendly";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("plugin:cypress/recommended", "airbnb-base"), // Removed TypeScript config
    {
        plugins: {
            cypress,
            "chai-friendly": chaiFriendly,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...cypress.environments.globals.globals,
            },

            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                project: null  // Disable TypeScript parsing
            }
        },

        rules: {
            "no-unused-expressions": 0,
            "chai-friendly/no-unused-expressions": 2,
            "semi":
              ["error", "never"],
            "no-console":
              ["error", { "allow": ["warn", "error"] }]
        },
    },
    {
        files: ["**/.eslintrc.{js,cjs}"],

        languageOptions: {
            globals: {
                ...globals.node,
            },

            ecmaVersion: 5,
            sourceType: "commonjs",
        },
    },
];