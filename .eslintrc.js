require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['@metaphor-xyz/eslint-config'],
  rules: {
    'unicorn/prefer-node-protocol': 'off',
  },
};
