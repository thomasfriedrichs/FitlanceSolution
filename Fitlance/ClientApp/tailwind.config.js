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
                'green': '#0c0',
                'lavender': '#e6e6fa'
            },
            rotate: {
                '180': '180deg',
            }
        },
    },
    plugins: [],
}
