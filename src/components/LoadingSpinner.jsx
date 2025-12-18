function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#21569A] via-[#1B4B59] to-[#0F2D3E] relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        <div className="absolute w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse bottom-10 right-10" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-48 h-48 bg-teal-400/10 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Multi-layer Spinner dengan glow effect */}
        <div className="relative w-24 h-24">
          {/* Outer ring dengan gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-20 blur-md"></div>
          
          {/* Middle rotating ring */}
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-400"
            style={{
              animation: "spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite",
            }}
          ></div>
          
          {/* Inner counter-rotating ring */}
          <div
            className="absolute inset-4 rounded-full border-4 border-transparent border-b-white border-l-cyan-300"
            style={{
              animation: "spinReverse 1s linear infinite",
            }}
          ></div>
          
          {/* Center dot dengan pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full shadow-lg shadow-cyan-400/50" style={{animation: "pulse 2s ease-in-out infinite"}}></div>
          </div>
        </div>

        {/* Text dengan gradient dan glow */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-white text-2xl font-bold tracking-wider relative">
            <span className="relative z-10 bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent" style={{animation: "shimmer 3s linear infinite"}}>
              Loading
            </span>
            <span className="absolute inset-0 blur-lg bg-gradient-to-r from-cyan-400 to-blue-400 opacity-40"></span>
          </p>
          
          {/* Animated dots dengan scale effect */}
          <div className="flex gap-2">
            {[0, 0.15, 0.3].map((delay, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full shadow-lg shadow-cyan-400/50"
                style={{
                  animation: "bounceScale 1.4s ease-in-out infinite",
                  animationDelay: `${delay}s`,
                }}
              ></span>
            ))}
          </div>
        </div>

        {/* Progress bar dengan shimmer */}
        <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 rounded-full"
            style={{
              animation: "progress 2s ease-in-out infinite",
              backgroundSize: "200% 100%",
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes bounceScale {
          0%, 80%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          40% {
            transform: translateY(-12px) scale(1.3);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;