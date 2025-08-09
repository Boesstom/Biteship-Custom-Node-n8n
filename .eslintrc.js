module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },
  plugins: [
    '@typescript-eslint',
    'n8n-nodes-base',
  ],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/nodes',
  ],
  rules: {
    'n8n-nodes-base/node-param-default-wrong-for-limit': 'error',
    'n8n-nodes-base/node-param-placeholder-miscased-id': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
