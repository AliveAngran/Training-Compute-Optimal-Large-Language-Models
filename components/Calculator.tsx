import React, { useState } from 'react';
import { Calculator as CalcIcon, Zap, Database, Box } from 'lucide-react';

const Calculator: React.FC = () => {
  // Simplification of C = 6 * N * D
  // Optimal scaling: N_opt proportional to C^0.5, D_opt proportional to C^0.5
  // Chinchilla ratio: D/N = 20
  
  const [budgetExponent, setBudgetExponent] = useState(23); // 10^23 FLOPs approx GPT-3

  const flops = Math.pow(10, budgetExponent);
  // Approximation based on paper:
  // C approx 6 * N * D
  // N_opt approx (C/6)^(0.5) / sqrt(20) * sqrt(1) ... simplifying roughly:
  // Paper says for Gopher budget (5.76e23): N=67B, D=1.5T (actually Gopher was 280B/300B)
  // Let's use the simple rule of thumb: C = 6 * N * 20N = 120 N^2
  // N = sqrt(C / 120)
  // D = 20 * N
  
  const optimalN = Math.sqrt(flops / 120);
  const optimalD = 20 * optimalN;

  const formatNumber = (num: number) => {
    if (num > 1e12) return (num / 1e12).toFixed(1) + " Trillion (T)";
    if (num > 1e9) return (num / 1e9).toFixed(1) + " Billion (B)";
    if (num > 1e6) return (num / 1e6).toFixed(1) + " Million (M)";
    return num.toExponential(2);
  };

  const examples = [
    { label: "GPT-3 (175B)", exp: 23.5 },
    { label: "Gopher (280B)", exp: 23.76 }, // Gopher was huge budget
    { label: "Llama 3 (8B)", exp: 22 }, // Smaller
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-20">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
         <div className="glass-panel p-8 rounded-3xl border border-violet-500/20 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
                <CalcIcon className="text-violet-400" />
                <h3 className="text-xl font-bold text-white">算力预算规划器</h3>
            </div>
            
            <p className="text-slate-400 text-sm mb-8">
              如果你有这么多的钱（算力），按照 Chinchilla 定律，你应该训练多大的模型？
            </p>

            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>总 FLOPs (10^{budgetExponent})</span>
                  <span className="font-mono text-violet-300">~{formatNumber(flops)} Ops</span>
                </label>
                <input 
                  type="range" 
                  min="18" 
                  max="26" 
                  step="0.1"
                  value={budgetExponent}
                  onChange={(e) => setBudgetExponent(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {examples.map(ex => (
                  <button 
                    key={ex.label}
                    onClick={() => setBudgetExponent(ex.exp)}
                    className="px-3 py-1 text-xs rounded-full border border-slate-600 hover:border-violet-500 bg-slate-800 hover:bg-violet-900/20 text-slate-300 transition-colors"
                  >
                    Set to {ex.label}
                  </button>
                ))}
              </div>
            </div>
         </div>

         <div className="space-y-4">
            {/* Result Cards */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 p-6 rounded-2xl border border-blue-500/30 backdrop-blur hover:scale-[1.02] transition-transform">
               <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-blue-300 text-sm font-semibold tracking-wider uppercase mb-1">Optimal Model Size</h4>
                    <p className="text-3xl font-mono text-white">{formatNumber(optimalN)}</p>
                    <p className="text-xs text-blue-400/60 mt-2">Parameters</p>
                  </div>
                  <Box className="text-blue-500 opacity-50 w-10 h-10" />
               </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur hover:scale-[1.02] transition-transform">
               <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-emerald-300 text-sm font-semibold tracking-wider uppercase mb-1">Optimal Data Size</h4>
                    <p className="text-3xl font-mono text-white">{formatNumber(optimalD)}</p>
                    <p className="text-xs text-emerald-400/60 mt-2">Tokens</p>
                  </div>
                  <Database className="text-emerald-500 opacity-50 w-10 h-10" />
               </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
               <span className="text-slate-400 text-sm">黄金比例 (Golden Ratio)</span>
               <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mt-1">
                 ~20 Tokens / Parameter
               </div>
            </div>
         </div>

       </div>
    </div>
  );
};

export default Calculator;
