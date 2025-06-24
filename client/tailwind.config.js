// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vintageDark: '#1e293b',       // Deep Slate Blue
        vintageLight: '#f8f4f0',      // Soft Cream White
        vintageAccent: '#c9a66b',     // Muted Gold
        cream: '#fdf6e3',             // Background neutral
        vintageBlue: {
          light: '#b0c4de',           // Light Steel Blue
          DEFAULT: '#4682b4',         // Steel Blue
          dark: '#2c3e50',            // Deep Blue-Gray
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
