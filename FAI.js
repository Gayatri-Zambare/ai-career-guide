/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eef6ff',
                    100: '#d9ebff',
                    200: '#bcdbff',
                    300: '#8ec3ff',
                    400: '#59a0ff',
                    500: '#327eff',
                    600: '#195ff5',
                    700: '#1248e2',
                    800: '#143bb7',
                    900: '#163590',
                    950: '#0c1b4b',
                },
                accent: {
                    purple: '#7c3aed',
                    cyan: '#06b6d4',
                    teal: '#0d9488',
                    indigo: '#4f46e5',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'card': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
                'glow': '0 0 25px rgba(50, 126, 255, 0.25)',
            }
        },
    },
    plugins: [],
}
