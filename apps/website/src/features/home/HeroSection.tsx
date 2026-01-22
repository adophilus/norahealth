import { FilePenLineIcon, ShieldCheckIcon, WalletIcon } from "lucide-react";

export function HeroSection() {
  return (
    <main>
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Focus on what really matters creating :)
            </h3>
            <div className="my-8 mb-10 text-center">
              <button
                onClick={() => {
                  window.location.href = "https://waitlist.nora-health.xyz";
                }}
                type="button"
                className="group cursor-pointer transition hover:scale-110 relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-200 bg-black dark:bg-white dark:text-black rounded-full hover:bg-opacity-90 dark:hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-white "
              >
                Join waitlist.
                <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
                <div className="absolute inset-0 -z-10 rounded-full blur-lg opacity-40 bg-primary dark:bg-white group-hover:opacity-60 transition-opacity"></div>
              </button>
              <p className="mt-4 text-xs opacity-50">
                No credit card required. Web3 wallet optional.
              </p>
            </div>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              nora-health combines traditional social scheduling with blockchain
              immutability. Proof of post, every time.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-border-light dark:via-border-dark to-transparent z-0"></div>
            <div className="relative group">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark shadow-lg flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  <WalletIcon className="size-6 opacity-80" />
                  <div className="absolute -right-2 -bottom-2 bg-surface-light dark:bg-surface-dark text-[10px] font-bold px-2 py-1 rounded-full border border-border-light dark:border-border-dark">
                    01
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3">Connect Identity</h4>
                <p className="text-sm opacity-60 leading-relaxed max-w-[240px]">
                  Sign in with Farcaster or connect your Ethereum wallet to link
                  your X and LinkedIn accounts securely.
                </p>
                <div className="mt-8 w-full max-w-[280px] h-32 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-3 relative overflow-hidden shadow-inner">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="h-2 w-20 bg-gray-400/20 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-background-light dark:bg-black p-2 rounded border border-black/5 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-12 bg-gray-400/30 rounded"></div>
                      </div>
                      <span className="material-icons-round text-xs opacity-50">
                        link
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-background-light dark:bg-black p-2 rounded border border-black/5 dark:border-white/10 opacity-60">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                        <div className="h-1.5 w-12 bg-gray-400/30 rounded"></div>
                      </div>
                      <span className="material-icons-round text-xs opacity-50">
                        add
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark shadow-lg flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  <FilePenLineIcon className="size-6 opacity-80" />
                  <div className="absolute -right-2 -bottom-2 bg-surface-light dark:bg-surface-dark text-[10px] font-bold px-2 py-1 rounded-full border border-border-light dark:border-border-dark">
                    02
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3">
                  Create &amp; Compose
                </h4>
                <p className="text-sm opacity-60 leading-relaxed max-w-[240px]">
                  Write your thread, attach IPFS-hosted media, and set a
                  specific time for deployment.
                </p>
                <div className="mt-8 w-full max-w-[280px] h-32 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-3 relative overflow-hidden shadow-inner">
                  <div className="bg-background-light dark:bg-black w-full h-full rounded-lg p-3 border border-black/5 dark:border-white/10">
                    <div className="flex gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-full bg-gray-400/20 rounded"></div>
                        <div className="h-2 w-2/3 bg-gray-400/20 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-full bg-gray-200 dark:bg-gray-800 rounded mt-2 flex items-center justify-center">
                      <span className="material-icons-round text-xs opacity-30">
                        image
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="gradient-border w-24 h-24 mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="gradient-border-content w-full h-full flex items-center justify-center">
                    <ShieldCheckIcon className="size-6 opacity-80" />
                  </div>
                  <div className="absolute -right-2 -bottom-2 bg-primary text-white dark:bg-white dark:text-black z-20 text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                    03
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3">
                  Schedule &amp; Verify
                </h4>
                <p className="text-sm opacity-60 leading-relaxed max-w-[240px]">
                  nora-health posts for you and records the action on-chain.
                  Receive a transaction proof and immutable analytics.
                </p>
                <div className="mt-8 w-full max-w-[280px] h-32 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-3 relative overflow-hidden shadow-inner flex flex-col justify-center">
                  <div className="bg-background-light dark:bg-black p-3 rounded-lg border border-green-500/30 flex items-center gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                      <span className="material-icons-round text-sm">
                        check
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-mono opacity-50 uppercase tracking-wide">
                        Transaction Hash
                      </div>
                      <div className="text-xs font-mono font-medium truncate w-32">
                        0x71C...92F
                      </div>
                    </div>
                    <span className="material-icons-round text-xs opacity-30 ml-auto">
                      open_in_new
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
