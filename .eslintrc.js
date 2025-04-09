export default {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["react", "@typescript-eslint"],
  rules: {
    // Other rules...
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "react/react-in-jsx-scope": "off", // Disable the rule for TypeScript files
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
