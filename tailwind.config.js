/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo 600
        secondary: '#8B5CF6', // Violet 500
        accent: '#EC4899', // Pink 500
        background: '#F3F4F6', // Gray 100
        surface: '#FFFFFF',
        'surface-glass': 'rgba(255, 255, 255, 0.8)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #3B82F6, #8B5CF6, #7C3AED)',
      }
    },
  },
  plugins: [],
}
