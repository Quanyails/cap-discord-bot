module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier", "eslint-config-prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "eslint-plugin-simple-import-sort",
  ],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/order": "off",
    "import/prefer-default-export": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-arrow-callback": "error",
    "simple-import-sort/sort": "error",
    "sort-imports": "off",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
