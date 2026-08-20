import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette materica: colori presi dalla merce, non dal verde generico.
        // orto = verde foglia caldo, terra = fondo di carta/legno,
        // pesca/mela/agrume = accenti dal banco.
        // Alias di compatibilita': il CSS esistente usa brand/accent.
        // Rimappati sulla palette materica invece di essere rimossi, cosi'
        // le utility gia' scritte cambiano colore senza riscrivere il CSS.
        brand: {
          50: '#f2f8ef', 100: '#e2efdb', 200: '#c4dfb8',
          300: '#9cc98c', 400: '#74ae60', 500: '#548f41',
          600: '#3f7231', 700: '#335a29', 800: '#2a4823', 900: '#233b1e',
        },
        accent: {
          50: '#fff2cc', 100: '#ffe8d6', 200: '#ffd45c',
          300: '#ffb787', 400: '#f5a623', 500: '#f97e3c',
          600: '#c9541b', 700: '#c07510', 800: '#a82a2c', 900: '#74553c',
        },
        orto: {
          50: '#f2f8ef', 100: '#e2efdb', 200: '#c4dfb8',
          300: '#9cc98c', 400: '#74ae60', 500: '#548f41',
          600: '#3f7231', 700: '#335a29', 800: '#2a4823', 900: '#233b1e',
        },
        terra: {
          50: '#faf7f2', 100: '#f3ece0', 200: '#e6d8c3',
          300: '#d4bd9c', 400: '#bf9d74', 500: '#ab8358',
          600: '#8f6a47', 700: '#74553c', 800: '#5f4634', 900: '#4f3b2d',
        },
        pesca:  { 100: '#ffe8d6', 300: '#ffb787', 500: '#f97e3c', 700: '#c9541b' },
        mela:   { 100: '#ffe0e0', 300: '#ff9a9a', 500: '#e4433f', 700: '#a82a2c' },
        agrume: { 100: '#fff2cc', 300: '#ffd45c', 500: '#f5a623', 700: '#c07510' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        // forme morbide: niente angoli netti sulle superfici principali
        blob: '2rem 2.5rem 2rem 2.5rem',
        card: '1.75rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(79 59 45 / 0.08), 0 12px 32px -12px rgb(79 59 45 / 0.14)',
        lift: '0 8px 20px -6px rgb(79 59 45 / 0.14), 0 24px 48px -20px rgb(79 59 45 / 0.22)',
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
      },
    },
  },
  plugins: [],
} satisfies Config
