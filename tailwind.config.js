/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#2C91F6',
        'neutral-0': '#ffffff',
        'neutral-1': '#fcfcfc',
        'neutral-2': '#f2f4f7',
        'neutral-3': '#eaecf0',
        'neutral-4': '#d0d5dd',
        'neutral-5': '#98a2b3',
        'neutral-6': '#667085',
        'neutral-7': '#475467',
        'neutral-8': '#344054',
        'neutral-9': '#182230',
        'semantic-waiting': '#fbc852',
        'semantic-secondary-background': '#c0e2fc',
        'semantic-secondary': '#0960bd',
        'semantic-highlight': '#f46414',
        'semantic-cancelled': '#e22a2a',
        'semantic-cancelled-background': '#f9d2d2',
        'semantic-success': '#1e863d',
        'semantic-success-background': '#e4ffec',
        'title-text': '#182230',
        'body-text': '#242424',
        'body-text-2': '#525252',
        'hover-icon': '#e7e7e7',
        'icon-gray': '#c2cfe0',
      }
    }
  },
  plugins: []
}