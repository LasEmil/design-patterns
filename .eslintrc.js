module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
  rules: {
    "simple-import-sort/imports": 1,
    "simple-import-sort/exports": 1,
    "prettier/prettier": 1,
  },
};
