import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// Основная палитра
				primary: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
				},
				// Военная палитра
				military: {
					green: '#2d5016',
					'green-light': '#4a7c59',
					'green-dark': '#1a3009',
					brown: '#8b4513',
					'brown-light': '#cd853f',
					'brown-dark': '#654321',
					gray: '#2c2c2c',
					'gray-light': '#404040',
					'gray-dark': '#1a1a1a',
				},
				// Акцентные цвета
				accent: {
					red: '#dc2626',
					'red-light': '#ef4444',
					'red-dark': '#b91c1c',
					orange: '#ea580c',
					'orange-light': '#f97316',
					'orange-dark': '#c2410c',
				},
			},
			fontFamily: {
				'russo': ['var(--font-russo-one)', 'system-ui', 'sans-serif'],
				'sans': ['var(--font-open-sans)', 'system-ui', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #0284c7 0%, #075985 100%)',
				'gradient-military': 'linear-gradient(135deg, #2d5016 0%, #8b4513 100%)',
				'gradient-dark': 'linear-gradient(135deg, #262626 0%, #171717 100%)',
				'gradient-accent': 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
			},
			boxShadow: {
				'glow': '0 0 20px rgba(14, 165, 233, 0.3)',
				'glow-lg': '0 0 30px rgba(14, 165, 233, 0.6)',
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.5s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'bounce-slow': 'bounce 2s infinite',
				'float': 'float 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				slideDown: {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				scaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				glow: {
					'0%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
					'100%': { boxShadow: '0 0 30px rgba(14, 165, 233, 0.6)' },
				},
			},
			backdropBlur: {
				'xs': '2px',
			},
		},
	},
	plugins: [],
}

export default config