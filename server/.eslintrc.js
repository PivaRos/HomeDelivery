module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'standard-with-typescript',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: `${process.cwd()}/tsconfig.json`,
  },
  rules: {
    '@typescript-eslint/semi': 'off',
    semi: 'off',
    'comma-dangle': 'off',
  },
};
