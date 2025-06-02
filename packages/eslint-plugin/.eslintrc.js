const settings = {
    parser: '@typescript-eslint/parser',
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
};

module.exports = { ...settings };
