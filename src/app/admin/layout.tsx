export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cyber-black flex flex-col pt-10">
      <header className="px-6 py-4 border-b border-cyber-gray bg-cyber-dark sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h1 className="font-mono text-xl font-bold text-red-500 tracking-widest">
              COMMAND_CENTER
            </h1>
          </div>
          <div className="font-mono text-xs text-cyber-text/50">
            LOGGED IN AS: ROOT
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6 bg-[linear-gradient(to_right,#1a1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1f2e_1px,transparent_1px)] bg-[size:4rem_4rem]">
        {children}
      </main>
    </div>
  );
}
