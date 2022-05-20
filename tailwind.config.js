module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    '*.vue',
  ],
  safelist: [
    'border-l-2',
    'border-blue-500',
    {
      pattern:
        /(bg|text|border)-(red|green|blue|purple|yellow|gray|indigo|orange)-(100|200|300|400|500)/,
    },
  ],
  theme: {
    extend: {
      colors: { themeBackground: 'var(--background)', themeText: 'var(--text)' },
    },
  },
  plugins: [],
  darkMode: 'class',
};
