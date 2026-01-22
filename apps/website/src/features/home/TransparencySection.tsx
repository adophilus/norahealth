export function TransparencySection() {
  return (
    <section className="py-20 border-t border-border-light dark:border-border-dark bg-surface-light/30 dark:bg-surface-dark/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-black dark:text-white uppercase bg-white dark:bg-black border border-border-light dark:border-border-dark rounded-full">
              Transparency
            </div>
            <h3 className="text-3xl font-bold mb-4">Trust, but verify.</h3>
            <p className="text-lg opacity-70 mb-6">
              Every scheduled post generates a unique hash on the Base L2
              network. Clients and brands can verify that content was published
              exactly as approved.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-icons-round text-green-500 mt-1">
                  check_circle
                </span>
                <div>
                  <strong className="block text-sm">Immutable Logs</strong>
                  <span className="text-sm opacity-60">
                    History cannot be altered or deleted.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-icons-round text-green-500 mt-1">
                  check_circle
                </span>
                <div>
                  <strong className="block text-sm">
                    Cross-Platform Sync
                  </strong>
                  <span className="text-sm opacity-60">
                    Status updates reflect on-chain in real-time.
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl transform rotate-3 scale-105 opacity-50"></div>
            <div className="relative bg-[#1e1e1e] rounded-xl shadow-2xl p-6 font-mono text-xs text-gray-300 overflow-hidden border border-gray-700">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-blue-400">verifyPost</span> ={" "}
                  <span className="text-purple-400">async</span>
                  {" (hash) =&gt; {"}
                </p>
                <p className="pl-4">
                  <span className="text-purple-400">const</span> data ={" "}
                  <span className="text-purple-400">await</span>{" "}
                  chain.getTx(hash);
                </p>
                <p className="pl-4">
                  <span className="text-purple-400">if</span> (data.status
                  === <span className="text-green-400">'CONFIRMED'</span>)
                  {" {"}
                </p>
                <p className="pl-8">
                  <span className="text-purple-400">return</span>
                  {" {"}
                </p>
                <p className="pl-12">
                  platform:{" "}
                  <span className="text-green-400">'farcaster'</span>,
                </p>
                <p className="pl-12">
                  timestamp:{" "}
                  <span className="text-orange-400">1678901234</span>,
                </p>
                <p className="pl-12">
                  verified: <span className="text-blue-400">true</span>
                </p>
                <p className="pl-8">{"};"}</p>
                <p className="pl-4">{"}"}</p>
                <p>{"}"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
