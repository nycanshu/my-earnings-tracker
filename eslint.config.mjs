import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable "any" type errors
      "@typescript-eslint/no-unused-vars": "warn", // Change unused vars to warnings
      "react/no-unescaped-entities": "off", // Disable error for single quotes in JSX
    },
  },
];

export default eslintConfig;
