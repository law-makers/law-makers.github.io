// @ts-nocheck

/** @type {import("tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
	content: ['./src/**/*.{ts,tsx,css}'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			mono: ['"DM Mono"', 'monospace'],
		},
		fontWeight: {
			light: 300,
			medium: 500,
		},
		extend: {
			colors: {
				cream: '#f2ebd4',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
