import { useState, useEffect } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'

export function Header() {
	const [isDarkMode, setIsDarkMode] = useState(false)

	useEffect(() => {
		// Initialize theme based on localStorage or system preference
		const savedTheme = localStorage.theme
		const prefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches

		if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
			setIsDarkMode(true)
			document.documentElement.classList.add('dark')
		} else {
			setIsDarkMode(false)
			document.documentElement.classList.remove('dark')
		}
	}, []) // Run once on mount

	useEffect(() => {
		// Update class and localStorage whenever isDarkMode changes
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
			localStorage.theme = 'dark'
		} else {
			document.documentElement.classList.remove('dark')
			localStorage.theme = 'light'
		}
	}, [isDarkMode]) // Run whenever isDarkMode changes

	const toggleTheme = () => {
		setIsDarkMode((prevMode) => !prevMode)
	}

	return (
		<header className="fixed w-full z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-primary bg-black dark:bg-white rounded-lg flex items-center justify-center">
						<img src="/icon.jpeg" className="rounded-lg" alt="logo" />
					</div>
					<span className="font-bold text-xl tracking-tight">nora-health</span>
				</div>
				<nav className="hidden md:flex items-center gap-8">
					<a
						className="text-sm font-medium opacity-60 hover:opacity-100 transition"
						href="/features"
					>
						Features
					</a>
					<a
						className="text-sm font-medium opacity-60 hover:opacity-100 transition"
						href="/faq"
					>
						How it Works
					</a>
					<a
						className="text-sm font-medium opacity-60 hover:opacity-100 transition"
						href="/pricing"
					>
						Pricing
					</a>
				</nav>
				<div className="flex items-center gap-4">
					<button
						type="button"
						className="p-2 rounded-lg cursor-pointer hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
						onClick={toggleTheme}
					>
						{isDarkMode ? (
							<SunIcon className="size-6" />
						) : (
							<MoonIcon className="size-6" />
						)}
					</button>
					<a href="https://localhost:3001">
						<button
							type="button"
							className="bg-primary hover:scale-110 transition cursor-pointer hover:bg-opacity-90 text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
						>
							Launch App
						</button>
					</a>
				</div>
			</div>
		</header>
	)
}
