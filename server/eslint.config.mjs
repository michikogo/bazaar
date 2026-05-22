import js from "@eslint/js"
import globals from "globals"
import prettier from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.ts"],
    plugins: { prettier, "@typescript-eslint": tseslint },
    languageOptions: {
      parser: tsParser,
      globals: globals.node,
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },
]
