import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Auth } from "@/features/auth";
import { getUnixTime } from "date-fns";

export const Route = createFileRoute("/auth")({
	component: AuthPage,
});

function AuthPage() {
	const [email, setEmail] = useState("");
	const [step, setStep] = useState<"email" | "otp">("email");
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const { set } = Auth.hooks.useAuth();
	const navigate = Route.useNavigate();

	const showMessage = (type: "success" | "error", text: string) => {
		setMessage({ type, text });
		setTimeout(() => setMessage(null), 4000);
	};

	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			showMessage("error", "Please enter your email");
			return;
		}

		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showMessage("error", "Please enter a valid email address");
			return;
		}

		setLoading(true);
		try {
			await Auth.lib.sendSignInOtp(email);
			setStep("otp");
			showMessage("success", "OTP sent to your email!");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to send OTP";
			showMessage("error", errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleOtpSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!otp || otp.length !== 4) {
			showMessage("error", "Please enter a valid 6-digit OTP");
			return;
		}

		setLoading(true);
		try {
			const res = await Auth.lib.verifyOtp(email, otp);
			set({
				status: "authenticated",
				token: res.access_token,
				user: res.user,
			});
			showMessage("success", "Successfully logged in!");
			navigate({
				to: "/dashboard",
			});
			setTimeout(() => {
				window.location.href = "/dashboard";
			}, 1000);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Invalid OTP";
			showMessage("error", errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleFarcasterAuth = async () => {
		setLoading(true);

		try {
			const { token, url } = await Auth.lib.getSignInWithFarcasterUrl();

			const width = 500;
			const height = 700;
			const left = window.screenX + (window.outerWidth - width) / 2;
			const top = window.screenY + (window.outerHeight - height) / 2;

			const popup = window.open(
				url,
				"farcaster-siwf",
				`width=${width},height=${height},left=${left},top=${top},popup=true`,
			);

			if (!popup) {
				throw new Error(
					"Failed to open popup. Please allow popups for this site.",
				);
			}

			const startTime = getUnixTime(new Date());
			const checkAuthInterval = setInterval(async () => {
				let lastError: Error | null = null;
				const currentTime = getUnixTime(new Date());

				if (currentTime - startTime > 300) {
					clearInterval(checkAuthInterval);
					setLoading(false);
					if (lastError) throw lastError;
				}

				try {
					console.log("checking farcaster sign in stat");
					const res = await Auth.lib.verifySignInWithFarcasterUrl(token);

					clearInterval(checkAuthInterval);
					setLoading(false);
					set({
						status: "authenticated",
						token: res.access_token,
						user: res.user,
					});
					showMessage("success", "Successfully logged in!");
					navigate({
						to: "/dashboard",
					});
				} catch (err) {
					lastError = err as Error;
				}
			}, 10000);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Google authentication failed";
			showMessage("error", errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleAuth = async () => {
		setLoading(true);
		try {
			// TODO: Implement Google authentication
			showMessage("error", "Google authentication coming soon");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Google authentication failed";
			showMessage("error", errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo & Header */}
				<div className="text-center mb-8 flex flex-row justify-center items-center">
					<div className="w-20 h-20 mb-6 flex items-center justify-center">
						<img
							src="/nora-health-logo.png"
							alt="nora-health"
							width={80}
							height={80}
							className="w-full h-full"
						/>
					</div>
					<h1 className="text-4xl font-bold text-foreground mb-6">nora-health</h1>
					{/*<p className="text-muted-foreground text-lg">
            Schedule and cross-post content across channels
          </p>*/}
				</div>
				<p className="text-neutral-400 text-lg text-foreground w-full text-center mt-[-40px] mb-4">
					Schedule and cross-post content across channels
				</p>

				{/* Message Alert */}
				{message && (
					<div
						className={`mb-6 p-4 rounded-lg text-sm font-medium ${
							message.type === "success"
								? "bg-green-500/10 border border-green-500 text-green-500"
								: "bg-destructive/10 border border-destructive text-destructive"
						}`}
					>
						{message.text}
					</div>
				)}

				{/* Auth Card */}
				<div className="bg-card border border-border rounded-2xl p-8 mb-6 shadow-xl">
					{step === "email" ? (
						<form onSubmit={handleEmailSubmit} className="space-y-5">
							<div>
								<h2 className="text-2xl font-bold text-foreground mb-1">
									Welcome back
								</h2>
								<p className="text-muted-foreground text-sm">
									Sign in with your email to continue
								</p>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="email"
									className="block text-sm font-semibold text-foreground"
								>
									Email Address
								</label>
								<input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
									required
								/>
							</div>
							<button
								type="submit"
								disabled={loading}
								className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 mt-6"
							>
								{loading ? "Sending OTP..." : "Continue with Email"}
							</button>
						</form>
					) : (
						<form onSubmit={handleOtpSubmit} className="space-y-5">
							<div>
								<h2 className="text-2xl font-bold text-foreground mb-1">
									Verify your email
								</h2>
								<p className="text-muted-foreground text-sm">
									We sent a 6-digit code to {email}
								</p>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="otp"
									className="block text-sm font-semibold text-foreground"
								>
									One-Time Password
								</label>
								<input
									type="text"
									id="otp"
									value={otp}
									onChange={(e) => setOtp(e.target.value.slice(0, 6))}
									placeholder="000000"
									maxLength={6}
									className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-center text-3xl font-mono text-foreground placeholder-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
									required
								/>
							</div>
							<button
								type="submit"
								disabled={loading}
								className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 mt-6"
							>
								{loading ? "Verifying..." : "Verify OTP"}
							</button>
							<button
								type="button"
								onClick={() => {
									setStep("email");
									setOtp("");
								}}
								className="w-full text-primary font-medium py-2 rounded-lg transition-all hover:opacity-80 text-sm"
							>
								Change Email
							</button>
						</form>
					)}
				</div>

				{/* Divider */}
				<div className="flex items-center gap-3 mb-6">
					<div className="flex-1 h-px bg-border" />
					<span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
						Or continue with
					</span>
					<div className="flex-1 h-px bg-border" />
				</div>

				{/* OAuth Options */}
				<div className="space-y-3 mb-6">
					{/* Farcaster Button */}
					<button
						type="button"
						onClick={handleFarcasterAuth}
						disabled={loading}
						className="w-full flex items-center justify-center gap-3 bg-secondary border border-border hover:border-primary/50 hover:bg-primary/5 text-foreground font-semibold py-3 rounded-lg transition-all disabled:opacity-50 active:scale-95"
					>
						{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6.5 3C5.12 3 4 4.12 4 5.5V18.5C4 19.88 5.12 21 6.5 21H17.5C18.88 21 20 19.88 20 18.5V5.5C20 4.12 18.88 3 17.5 3H6.5ZM6.5 4.5H10V8.5H6.5V4.5ZM11.5 4.5H17.5V8.5H11.5V4.5ZM6.5 10V15.5H10V10H6.5ZM11.5 10V15.5H17.5V10H11.5ZM6.5 17H10V19.5H6.5V17ZM11.5 17H17.5V19.5H11.5V17Z" />
						</svg>
						Sign in with Farcaster
					</button>

					{/* Google Button */}
					<button
						type="button"
						onClick={handleGoogleAuth}
						disabled={loading}
						className="w-full flex items-center justify-center gap-3 bg-secondary border border-border hover:border-primary/50 hover:bg-primary/5 text-foreground font-semibold py-3 rounded-lg transition-all disabled:opacity-50 active:scale-95"
					>
						{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path
								fill="#EA4335"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#4285F4"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Sign in with Google
					</button>
				</div>

				{/* Terms */}
				<p className="text-xs text-muted-foreground text-center leading-relaxed">
					By signing in, you agree to our{" "}
					<a href="/terms-of-service" className="text-primary hover:underline">
						Terms of Service
					</a>{" "}
					and{" "}
					<a href="/privacy-policy" className="text-primary hover:underline">
						Privacy Policy
					</a>
				</p>
			</div>
		</div>
	);
}
