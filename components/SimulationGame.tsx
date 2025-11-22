import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Play, Database, Brain, AlertTriangle, CheckCircle, TrendingUp, Cpu } from 'lucide-react';
import { GameLevel } from '../types';

interface SimulationGameProps {
  onBack: () => void;
}

const levels: GameLevel[] = [
  { 
    id: 1, 
    name: "阶段一：初创公司原型", 
    budgetLabel: "Small Scale (Seed Round)", 
    budgetExponent: 18, 
    description: "资金有限。你需要用极其有限的算力训练一个 Demo。你会选择做一个大而空洞的模型，还是小而精悍的模型？" 
  },
  { 
    id: 2, 
    name: "阶段二：独角兽崛起", 
    budgetLabel: "Medium Scale (Series B)", 
    budgetExponent: 21, 
    description: "你拿到了一笔可观的融资。算力提升了 1000 倍。这是验证 Chinchilla Scaling Law 的关键时刻。" 
  },
  { 
    id: 3, 
    name: "阶段三：AGI 冲刺", 
    budgetLabel: "Hyperscale (IPO)", 
    budgetExponent: 24, 
    description: "全球算力中心为你敞开。现在的每一个决策偏差，都会导致数亿美元的浪费。寻找绝对的最优解。" 
  }
];

const SimulationGame: React.FC<SimulationGameProps> = ({ onBack }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gameState, setGameState] = useState<'SETUP' | 'TRAINING' | 'RESULT'>('SETUP');
  const [allocation, setAllocation] = useState(50); // 0 = All Data, 100 = All Params
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  const level = levels[currentLevelIdx];

  // Core Chinchilla Math Simulation
  // Cost C = 6 * N * D. 
  // We allow user to vary ratio R = D/N.
  // Ideally R = 20.
  // Allocation slider 50 => Ratio 20.
  // Slider < 50 => Ratio > 20 (Data heavy). Slider > 50 => Ratio < 20 (Model heavy).
  
  const simulationResults = useMemo(() => {
    // Mapping slider (0-100) to Ratio (D/N)
    // 50 -> 20
    // 0 -> 400 (Extreme Data)
    // 100 -> 1 (Extreme Params)
    // Logarithmic scale for better feel
    const logRatio = Math.log(400) - (allocation / 100) * (Math.log(400) - Math.log(1));
    const ratio = Math.exp(logRatio); // D/N
    
    // C = 6 * N * D = 6 * N * (N * ratio) = 6 * ratio * N^2
    // N = sqrt(C / (6 * ratio))
    const totalFLOPs = Math.pow(10, level.budgetExponent);
    const N = Math.sqrt(totalFLOPs / (6 * ratio));
    const D = N * ratio;

    // Relative Loss Calculation (Simplified for gameplay)
    // Optimal is at Ratio ~20.
    // Error factor increases as log(ratio) moves away from log(20)
    const optimalRatio = 20;
    const deviation = Math.abs(Math.log(ratio) - Math.log(optimalRatio));
    // Efficiency: 100% at optimal, drops as deviation increases
    const efficiency = Math.max(0, 100 - (deviation * 40)); 
    
    return { N, D, ratio, efficiency };
  }, [allocation, level.budgetExponent]);

  const handleTrain = () => {
    setGameState('TRAINING');
    setTrainingProgress(0);
  };

  useEffect(() => {
    if (gameState === 'TRAINING') {
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setGameState('RESULT');
            return 100;
          }
          return prev + 2; // Speed of training animation
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const nextLevel = () => {
    if (currentLevelIdx < levels.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setGameState('SETUP');
      setAllocation(50); // Reset to middle
    }
  };

  const formatNum = (num: number) => {
    if (num > 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num > 1e6) return (num / 1e6).toFixed(1) + "M";
    return (num / 1e3).toFixed(1) + "K";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回教程</span>
        </button>
        <div className="flex items-center gap-2 px-4 py-1 bg-violet-900/30 border border-violet-500/30 rounded-full">
          <Cpu size={16} className="text-violet-400" />
          <span className="text-sm font-mono text-violet-200">CHINCHILLA PROTOCOL SIMULATOR v1.0</span>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Context & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-violet-500">
            <h2 className="text-2xl font-bold text-white mb-2">{level.name}</h2>
            <p className="text-violet-300 font-mono text-xs mb-4">{level.budgetLabel}</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              {level.description}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-black">
            <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-4">Architecture Preview</h3>
            
            <div className="space-y-6">
              <div className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-blue-400 flex items-center gap-2"><Brain size={14}/> Parameters (N)</span>
                  <span className="font-mono">{formatNum(simulationResults.N)}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300" 
                    style={{ width: `${Math.min(100, (allocation / 100) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-emerald-400 flex items-center gap-2"><Database size={14}/> Tokens (D)</span>
                  <span className="font-mono">{formatNum(simulationResults.D)}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-emerald-500 transition-all duration-300" 
                    style={{ width: `${Math.min(100, 100 - (allocation / 100) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Token/Param Ratio</span>
                    <span className={`font-mono font-bold transition-colors ${
                      simulationResults.ratio >= 15 && simulationResults.ratio <= 25 
                      ? 'text-green-400' 
                      : 'text-amber-400'
                    }`}>
                      {simulationResults.ratio.toFixed(1)} : 1
                    </span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Area */}
        <div className="lg:col-span-2 relative">
          
          {gameState === 'SETUP' && (
            <div className="h-full flex flex-col justify-center glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
               {/* Ambient Background */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none"></div>

               <div className="relative z-10 text-center space-y-12">
                  <div>
                    <h3 className="text-xl text-white font-semibold mb-6">分配你的算力预算</h3>
                    
                    <div className="flex justify-between items-end px-4 mb-2 text-xs font-bold tracking-widest text-slate-500">
                       <span className="text-emerald-400">← MORE DATA (Knowledge)</span>
                       <span className="text-blue-400">BIGGER BRAIN (Capacity) →</span>
                    </div>

                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="1"
                      value={allocation}
                      onChange={(e) => setAllocation(Number(e.target.value))}
                      className="w-full h-4 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-violet-300 transition-all"
                    />
                    
                    <div className="flex justify-between mt-2 text-xs text-slate-600 font-mono">
                       <span>D &gt;&gt; N</span>
                       <span>Optimal Balance?</span>
                       <span>N &gt;&gt; D</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 mx-auto max-w-lg">
                    <p className="text-slate-300 text-sm">
                       <span className="text-violet-400 font-bold">顾问提示：</span> 
                       {simulationResults.ratio > 50 ? "警告：你正在构建一个读了太多书的小脑袋模型，它可能记不住这么多知识。" : 
                        simulationResults.ratio < 5 ? "警告：这就像让爱因斯坦只读小学课本。巨大的脑容量被浪费了（过拟合）。" :
                        "当前的配置看起来比较平衡，但能达到完美的 20:1 吗？"}
                    </p>
                  </div>

                  <button 
                    onClick={handleTrain}
                    className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto"
                  >
                    <Play size={20} fill="black" />
                    开始训练 (Start Run)
                  </button>
               </div>
            </div>
          )}

          {gameState === 'TRAINING' && (
             <div className="h-full flex flex-col items-center justify-center glass-panel p-8 rounded-3xl border border-white/10">
                <div className="w-full max-w-md space-y-6 text-center">
                   <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-full h-full animate-spin text-violet-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" opacity="0.3"/>
                        <path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" className="animate-[spin_3s_linear_infinite]" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-2xl font-mono font-bold">
                        {trainingProgress}%
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                     <h3 className="text-xl animate-pulse">正在利用 GPU 集群训练...</h3>
                     <p className="text-slate-400 text-sm">
                       Optimizing parameters: {formatNum(simulationResults.N)} <br/>
                       Processing tokens: {formatNum(simulationResults.D)}
                     </p>
                   </div>
                   
                   {/* Live Loss Graph Simulation */}
                   <div className="h-32 bg-slate-900/50 rounded-xl border border-white/5 relative overflow-hidden flex items-end">
                      <div className="absolute inset-0 flex items-center justify-center text-slate-700 text-xs uppercase tracking-widest font-bold z-0">
                        Loss Curve
                      </div>
                      <div 
                        className="w-full bg-gradient-to-t from-violet-500/50 to-transparent transition-all duration-300 z-10"
                        style={{ height: `${100 - (trainingProgress * 0.6)}%` }} // Simulating loss dropping
                      ></div>
                   </div>
                </div>
             </div>
          )}

          {gameState === 'RESULT' && (
            <div className="h-full flex flex-col justify-center glass-panel p-8 rounded-3xl border border-white/10 relative">
               <div className="text-center space-y-8">
                  
                  {simulationResults.efficiency > 90 ? (
                    <div className="inline-flex flex-col items-center">
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-emerald-500 ring-offset-4 ring-offset-slate-900">
                        <CheckCircle size={40} className="text-emerald-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">Compute Optimal!</h2>
                      <p className="text-emerald-400 mt-2">Perfect Balance Achieved</p>
                    </div>
                  ) : (
                    <div className="inline-flex flex-col items-center">
                      <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-amber-500 ring-offset-4 ring-offset-slate-900">
                         <AlertTriangle size={40} className="text-amber-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">Sub-Optimal Config</h2>
                      <p className="text-amber-400 mt-2">算力被浪费了</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                      <span className="text-slate-500 text-xs block mb-1">Compute Efficiency</span>
                      <span className={`text-2xl font-mono ${simulationResults.efficiency > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {simulationResults.efficiency.toFixed(1)}%
                      </span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                      <span className="text-slate-500 text-xs block mb-1">Your Ratio (D/N)</span>
                      <span className="text-2xl font-mono text-white">
                        {simulationResults.ratio.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Target: 20.0</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl text-sm text-slate-300 max-w-lg mx-auto leading-relaxed border border-white/5">
                     {simulationResults.efficiency > 90 ? 
                       "太棒了！你完美遵循了 Chinchilla 定律。你的模型大小和数据量处于黄金比例 (20:1)。这意味着在相同的花费下，没有其他任何配置能比你的模型表现更好。" :
                       simulationResults.ratio < 20 ? 
                       "你的模型太大了（N过大）。这是典型的 'Kaplan' 时代错误。你应该把用来增加参数的钱省下来，去清洗更多的数据。记住：小模型+海量数据=更低成本+更强能力。" :
                       "你的数据量太多了（D过大），模型太小了，根本消化不了这么多信息。你应该增加模型的参数量（宽度/深度）来提升它的学习能力。"
                     }
                  </div>

                  {currentLevelIdx < levels.length - 1 ? (
                    <button 
                      onClick={nextLevel}
                      className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-semibold transition-all flex items-center gap-2 mx-auto"
                    >
                      <TrendingUp size={18} />
                      晋升到下一阶段 (Next Round)
                    </button>
                  ) : (
                    <div className="space-y-4">
                       <p className="text-violet-300 font-bold">恭喜通关！你已经掌握了首席架构师的核心直觉。</p>
                       <button 
                          onClick={onBack}
                          className="px-6 py-2 border border-slate-600 rounded-full text-slate-400 hover:text-white transition-colors"
                       >
                          回到主页复习理论
                       </button>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationGame;