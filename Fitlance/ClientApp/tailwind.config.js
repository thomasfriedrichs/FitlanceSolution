module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ], theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        extend: {
            colors: {
                'darkGreen': '#166906',
                'green': '#1b8207',
                'lavender': '#e6e6fa'
            },
            rotate: {
                '180': '180deg',
            }
        },
    },
    plugins: [],
}
