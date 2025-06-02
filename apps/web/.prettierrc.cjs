const config = require('../../.prettierrc.js');
module.exports = {
    ...config,
    plugins: ['prettier-plugin-tailwindcss'],
};
