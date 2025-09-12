import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "import/no-anonymous-default-export": "off",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      quotes: ["error", "double"],
      "react/display-name": "off",
    },
  },
];

export default eslintConfig;

