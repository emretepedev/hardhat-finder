module.exports = {
  root: true,

  env: {
    browser: false,
    mocha: true,
    node: true,
  },

  extends: ["eslint:recommended", "plugin:json/recommended"],

  parser: "@typescript-eslint/parser",

  plugins: ["@typescript-eslint", "json"],

  rules: {
    "json/*": ["error", { allowComments: true }],
  },

  overrides: [
    {
      files: ["*.ts"],

      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],

      parserOptions: {
        project: ["./tsconfig.json"],
      },

      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
      },
    },

    {
      files: ["src/extensions/Finder.ts"],
      rules: {
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-return": "off",
      },
    },

    {
      files: ["src/utils/helper.ts"],
      rules: {
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
      },
    },
  ],
};
