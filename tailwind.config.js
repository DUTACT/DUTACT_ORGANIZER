/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2C91F6',
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
        overlay: 'rgba(32, 41, 57, 0.50)'
      },
      width: {
        sidebar: 'var(--sidebar)',
        aside: 'var(--aside)',
        main: 'var(--w-main)',
        'logo-sm': 'var(--logo-sm)',
        'logo-md': 'var(--logo-md)',
        'logo-lg': 'var(--logo-lg)'
      },
      height: {
        header: 'var(--h-header)',
        'header-popup': 'var(--h-header-popup)',
        'footer-popup': 'var(--h-footer-popup)',
        main: 'var(--h-main)',
        'main-abs': 'var(--h-main-absolute)',
        'logo-sm': 'var(--logo-sm)',
        'logo-md': 'var(--logo-md)',
        'logo-lg': 'var(--logo-lg)'
      },
      minWidth: {
        'logo-sm': 'var(--logo-sm)',
        'logo-md': 'var(--logo-md)',
        'logo-lg': 'var(--logo-lg)'
      },
      maxWidth: {
        popup: 'var(--max-w-popup)'
      },
      minHeight: {
        'logo-sm': 'var(--logo-sm)',
        'logo-md': 'var(--logo-md)',
        'logo-lg': 'var(--logo-lg)'
      },
      maxHeight: {
        main: 'var(--h-main)',
        'main-abs': 'var(--h-main-absolute)',
        popup: 'var(--max-h-popup)',
        'main-popup': 'var(--h-main-popup)'
      },
      margin: {
        header: 'var(--h-header)'
      },
      boxShadow: {
        custom:
          '0px -1px 1px 0px rgba(0, 0, 0, 0.04) inset, 0px 2px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 8px -4px rgba(80, 80, 80, 0.20)'
      },
      inset: {
        sidebar: 'var(--sidebar)',
        aside: 'var(--aside)'
      }
    }
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
}
