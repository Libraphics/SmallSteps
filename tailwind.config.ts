import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f3ff',
          100: '#e4e7ff',
          500: '#6d66ff',
          600: '#5a4df5',
          700: '#4a3fd1'
        }
      },
      boxShadow: {
        soft: '0 8px 30px rgba(46,35,99,0.12)'
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, #7a5cff 0%, #35c3ff 100%)'
      }
    }
  },
  plugins: []
};

export default config;
