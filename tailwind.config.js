/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      jakarta: 'Plus Jakarta Sans',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '40px': '40px',
      '60px': '60px',
      '10px': '10px',
    },
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        gray: {
          25: '#DCDCDC',
          50: '#A7A7A7',
          100: '#f7fafc',
          200: '#8A8A8A',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#282828',
          800: '#2d3748',
          900: '#1a202c',
        },
        blue: {
          50: '#F6FCFF',
          100: '#ebf8ff',
          200: '#bee3f8',
          300: '#90cdf4',
          400: '#63b3ed',
          500: '#4299e1',
          600: '#3182ce',
          700: '#2b6cb0',
          800: '#2c5282',
          900: '#2a4365',
        },
        primary: {
          100: '#353535',
          200: '#021E2D',
          500: '#021926',
          600: '#0D062D',
          900: '#000609',
        },
        base: {
          100: '#787486',
          200: '#E4E7EC',
          300: '#667085',
          400: '#F9FAFB',
        },
        yellow: {
          50: '#FFFCF5',
          100: '#FFFCF4',
          200: '#FFF1CD',
          300: '#FFE7AB',
          400: '#FFA500',
        },
        brandWhite: {
          100: '#F9F9F9',
          200: '#F5F5F5',
          300: '#FFF6ED',
        },
        brandBlack: {
          100: '#01141E',
          200: '#625F6D',
          300: '#0D1823',
        },
        brandRed: {
          50: '#FFF6ED',
          100: '#D8727D',
          200: '#C4320A',
        },
        brandGreen: {
          100: '#219150',
        },
        brandGray: {
          100: '#E0E0E0',
          200: '#C4C4C4',
          300: '#242B35',
          400: '#4F4F4F',
          500: '#424242',
          600: '#6C6C6C',
        },
        brandOrange: {
          100: '#ED844C',
          300: '#FFE7AB',
          400: '#FFA500',
          500: '#FFB703',
        },
        brandPurple: {
          50: '#F4F3FF',
          100: '#5030E5',
          200: '#5925DC',
          300: '#F4F8FF',
        },
        success: {
          100: '#FAFFFA',
          200: '#4BBB7B',
        },
      },

      backgroundImage: {
        'button-gradient':
          'linear-gradient(92.76deg, #4C5ACD 50.52%, #F598AA 150.68%, #FDDFD0 168.67%)',
        'hero-banner': 'url(/assets/images/hero-banner.svg)',
        'hero-banner-mob': 'url(/assets/images/hero_banner_mob.png)',
        'banner-2': 'url(/assets/images/banner-2.svg)',
        'banner-2-mob': 'url(/assets/images/banner_2_mob.png)',
      },
      boxShadow: {
        custom: '0px 4px 65px rgba(0, 0, 0, 0.05)',
      },

      lineHeight: {
        120: '120%',
        150: '150%',
      },

      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
      },
    },
  },
};
