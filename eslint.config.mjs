import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    ignores: ["eslint.config.mjs","eslintrc.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
];
