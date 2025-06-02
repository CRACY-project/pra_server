import formKitTailwind from '@formkit/themes/tailwindcss';
import fancyForms from '@tailwindcss/forms';
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';

const iconLayerPlugin = plugin(function ({ addVariant }) {
    addVariant('accent-layer', `& .secondary-layer`);
    addVariant('accent-fill-layer', `& .secondary-fill-layer`);
});

const darkColors = {
    50: '#38414A',
    100: '#2C333A',
    200: '#282E33',
    300: '#22272B',
    400: '#1D2125',
    500: '#161a1d',
    600: '#101214',
    700: '#0d1011',
    800: '#090a0c',
    900: '#040506',
    950: '#050406',
};

const actionTypeColors = {
    create: colors.green,
    delete: colors.orange,
    update: colors.amber,
    error: colors.red,
    warn: colors.yellow,
};

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class',
    safelist: [
        {
            pattern: /(bg|text)-(actionType).*/,
        },
        {
            pattern: /rounded-r-(md|none)/,
        },
        {
            pattern: /sticky/,
        },
    ],
    theme: {
        extend: {
            screens: {
                landscape: {
                    raw: '(orientation: landscape) and (max-height: 480px)',
                },
                statsxxl: '1500px',
                tk: '2000px',
                xxl: '2500px',
                xxxl: '3200px',
            },
            'backdrop-blur': {
                xs: '2px',
            },
            colors: {
                primary: {
                    100: '#f2f2f7',
                    200: '#c0c0d6',
                    300: '#8182af',
                    400: '#424386',
                    500: '#111279',
                    600: '#090e6c',
                    700: '#090e50',
                    800: '#090e3c',
                    900: '#090e28',
                    950: '#090e14',
                },
                secondary: {
                    100: '#fdfefe',
                    200: '#f6fcfc',
                    300: '#eff9f9',
                    400: '#e6f6f6',
                    500: '#def3F3',
                    600: '#bbe5e6',
                    700: '#8cd1d4',
                    800: '#56b5ba',
                    900: '#3b9a9f',
                },
                tertiary: {
                    100: '#f6fcfc',
                    200: '#d5f0f0',
                    300: '#ace1e1',
                    400: '#83d2d2',
                    500: '#59C3C3',
                    600: '#2c9ea0',
                    700: '#449393',
                    800: '#1e6467',
                    900: '#1c5053',
                },
                dark: darkColors,
                actionType: actionTypeColors,
            },
            fontSize: {
                sm: '0.95rem',
            },
        },
        backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        },
        fontFamily: {
            sans: ['Open Sans', 'sans-serif'],
        },
    },
    plugins: [fancyForms, formKitTailwind, iconLayerPlugin],
};
