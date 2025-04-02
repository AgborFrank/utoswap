import {heroui} from '@heroui/theme';
import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
    darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#000000FF", // Emerald Green
          secondary: "#ffc244", // Royal Blue
          accent: "#1ABC9C", // Soft Teal
          neutral: "#3d4451", // Neutral Gray
		  footer: '#002847',
		  careemgreen: "#00e784",
		  forestgreen: "#000000FF",
		  lightgreen: "#d6ffea",
		  desertskyblue: "#a6edf2",
		  midnightblue: "#001942",
		  offwhite: "#fafffc",
		  warmgrey: "#F6F6F1",
		  black: "#000000",
		  pay: "#000C26",
		  get: "#7f5ffa",
		  eat: "#80FF80",
		  go: "#3837e4",
          "base-100": "#ffffff", // White background
          "--rounded-box": "1rem", // Box corner radius
          "--rounded-btn": "0.5rem", // Button corner radius
          "--rounded-badge": "0.25rem", // Badge corner radius
          "--font-sans": '"Addrezza", sans-serif', // Font
        },
      },
    ],
  },
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['"DM Sans"', "sans-serif"],
  			ibm: ['IBM Plex Sans Arabic"', "sans-serif"]
  		},
  		colors: {
  			primary: {
  				DEFAULT: '#000000FF',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: '#FFFFFFFF',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			background: "var(--background)",
			text: "var(--text)",
			cta: "var(--cta)",
			grade: "var(--grade)",
			wallet: "var(--wallet)",
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			highlight: '#F1C40F',
			lemon: '#9df00f',
  			san: '#f5eee9',
			royalblue: '#016ef1',
			brandblue: '#3883f8',
			paleblue: '#629ef9',
			blue: '#0d6efd',
			footer: '#000000FF',
			facebook: '#3b5998',
			careemgreen: "#00e784",
			typo: "#00493e",
			forestgreen: "#006fee",
			lightgreen: "#d6ffea",
			desertskyblue: "#a6edf2",
			midnightblue: "#001942",
			offwhite: "#fafffc",
			warmgrey: "#F6F6F1",
			black: "#000000",
			pay: "#000C26",
			get: "#7f5ffa",
			eat: "#80FF80",
			go: "#3837e4",
  			neutral: {
  				light: '#ECF0F1',
  				dark: '#34495E'
  			},
  			
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
plugins: [daisyui, heroui()],
};

export default config;
