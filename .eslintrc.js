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
    },
    {
      files: ["src/tasks/finder.ts"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-extra-non-null-assertion": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
      },
    },
    {
      files: ["src/extensions/Finder.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-extra-non-null-assertion": "off",
      },
    },
    {
      files: ["src/tasks/compile.ts"],
      rules: {
        "@typescript-eslint/no-unsafe-member-access": "off",
      },
    },
    {
      files: ["src/types.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
    {
      files: ["src/utils.ts"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "prefer-rest-params": "off",
      },
    },
  ],
};
