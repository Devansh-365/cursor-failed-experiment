export function WaitlistStats({ count }: { count: number }) {
  return (
    <div className="relative px-6 py-4 bg-black/10 backdrop-blur-md border border-white/10 rounded-xl">
      <div className="flex items-center">
        <div className="h-8 w-8 flex items-center justify-center bg-purple-600/20 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-white/70">People waiting</p>
          <p className="text-xl font-medium text-white">{count.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
} 