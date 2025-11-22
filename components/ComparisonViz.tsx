import React, { useState, useEffect } from 'react';
import { Target, Trophy, Clock, Zap, Coins } from 'lucide-react';

const ComparisonViz: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'specs' | 'inference'>('specs');
  const [inferenceProgress, setInferenceProgress] = useState({ gopher: 0, chinchilla: 0 });
  const [isInferencing, setIsInferencing] = useState(false);

  const startInference = () => {
      setIsInferencing(true);
      setInferenceProgress({ gopher: 0, chinchilla: 0 });
  };

  useEffect(() => {
      if (isInferencing) {
          const interval = setInterval(() => {
              setInferenceProgress(prev => {
                  // Chinchilla is ~4x faster (smaller N)
                  const newChinchilla = Math.min(100, prev.chinchilla + 4);
                  // Gopher is slow
                  const newGopher = Math.min(100, prev.gopher + 1);
                  
                  if (newChinchilla === 100 && newGopher === 100) {
                      setIsInferencing(false);
                      clearInterval(interval);
                  }
                  return { gopher: newGopher, chinchilla: newChinchilla };
              });
          }, 50);
          return () => clearInterval(interval);
      }
  }, [isInferencing]);

  return (
    <div className="w-full max-w-5xl mx-auto my-12">
       
       <div className="glass-panel rounded-3xl overflow-hidden border border-slate-700 flex flex-col md:flex-row min-h-[500px]">
          
          {/* Sidebar Control */}
          <div className="w-full md:w-64 bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-700 p-6 flex flex-col gap-4">
              <h3 className="text-white font-bold mb-2">对比维度</h3>
              <button 
                onClick={() => setActiveTab('specs')}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all text-left ${activeTab === 'specs' ? 'bg-violet-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                  <Target size={18} />
                  <div>
                      <div className="font-semibold">参数与数据</div>
                      <div className="text-xs opacity-70">Training Config</div>
                  </div>
              </button>
              <button 
                onClick={() => setActiveTab('inference')}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all text-left ${activeTab === 'inference' ? 'bg-violet-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                  <Zap size={18} />
                  <div>
                      <div className="font-semibold">推理成本 (关键)</div>
                      <div className="text-xs opacity-70">Deployment Cost</div>
                  </div>
              </button>
          </div>

          {/* Main Visualization Area */}
          <div className="flex-1 p-8 bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden">
             
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/5 blur-[100px] rounded-full pointer-events-none"></div>

             {activeTab === 'specs' && (
                 <div className="h-full flex flex-col justify-center animate-fade-in">
                    <h3 className="text-center text-xl font-bold text-white mb-12">模型体型 vs 阅读量</h3>
                    
                    <div className="flex justify-around items-end h-[300px] gap-8">
                        {/* Gopher */}
                        <div className="flex flex-col items-center gap-4 group">
                            <div className="relative">
                                {/* Parameter Circle (Big) */}
                                <div className="w-48 h-48 rounded-full border-4 border-slate-600 bg-slate-800/50 flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform">
                                    <span className="text-slate-400 font-bold text-2xl">280B</span>
                                    <span className="absolute -bottom-8 text-xs text-slate-500 uppercase tracking-widest">Parameters</span>
                                </div>
                                {/* Data Circle (Small) - Inside or Behind */}
                                <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center animate-pulse">
                                    <span className="text-blue-300 text-xs font-bold">300B</span>
                                </div>
                            </div>
                            <h4 className="text-slate-300 font-bold text-lg">Gopher</h4>
                            <p className="text-xs text-slate-500 max-w-[150px] text-center">
                                大胖子，书读得少。<br/>(Undertrained)
                            </p>
                        </div>

                        {/* VS Divider */}
                        <div className="h-full flex items-center text-slate-700 font-black text-4xl italic opacity-30">VS</div>

                        {/* Chinchilla */}
                        <div className="flex flex-col items-center gap-4 group">
                            <div className="relative">
                                {/* Parameter Circle (Small) */}
                                <div className="w-24 h-24 rounded-full border-4 border-emerald-500 bg-emerald-900/30 flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <span className="text-emerald-300 font-bold text-xl">70B</span>
                                    <span className="absolute -bottom-8 text-xs text-emerald-500 uppercase tracking-widest text-center w-full">Parameters</span>
                                </div>
                                {/* Data Circle (Huge) */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center z-0">
                                    <span className="text-blue-300 font-bold">1.4T</span>
                                    <span className="absolute bottom-6 text-[10px] text-blue-400">Tokens</span>
                                </div>
                            </div>
                            <h4 className="text-white font-bold text-lg text-glow">Chinchilla</h4>
                            <p className="text-xs text-slate-400 max-w-[150px] text-center">
                                精干，博览群书。<br/>(Optimally Trained)
                            </p>
                        </div>
                    </div>
                 </div>
             )}

             {activeTab === 'inference' && (
                 <div className="h-full flex flex-col animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white">推理速度模拟 (Latency)</h3>
                        <button 
                            onClick={startInference}
                            disabled={isInferencing}
                            className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:scale-105 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            <Zap size={16} className={isInferencing ? 'text-yellow-600' : 'text-yellow-500'} fill="currentColor"/>
                            {isInferencing ? "Generating..." : "Generate 100 Tokens"}
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Gopher Row */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400 font-bold">Gopher (280B)</span>
                                <span className="text-red-400 text-xs flex items-center gap-1"><Coins size={12}/> Expensive ($$$)</span>
                            </div>
                            <div className="h-12 bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700">
                                <div 
                                    className="h-full bg-slate-600 transition-all ease-linear"
                                    style={{ width: `${inferenceProgress.gopher}%` }}
                                ></div>
                                <div className="absolute inset-0 flex items-center px-4 text-xs font-mono text-slate-400">
                                    {isInferencing && inferenceProgress.gopher < 100 ? "Loading weights..." : inferenceProgress.gopher === 100 ? "Done" : "Idle"}
                                </div>
                            </div>
                        </div>

                        {/* Chinchilla Row */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-emerald-400 font-bold flex items-center gap-2">Chinchilla (70B) <Trophy size={14}/></span>
                                <span className="text-emerald-400 text-xs flex items-center gap-1"><Coins size={12}/> Cheap ($)</span>
                            </div>
                            <div className="h-12 bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700">
                                <div 
                                    className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all ease-linear"
                                    style={{ width: `${inferenceProgress.chinchilla}%` }}
                                ></div>
                                <div className="absolute inset-0 flex items-center px-4 text-xs font-mono text-white mix-blend-difference">
                                    {isInferencing && inferenceProgress.chinchilla < 100 ? "Generating tokens..." : inferenceProgress.chinchilla === 100 ? "Finished (4x Faster!)" : "Idle"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                        <Clock className="text-blue-400 shrink-0 mt-1" size={18}/>
                        <p className="text-sm text-blue-200">
                            <span className="font-bold">商业价值：</span>
                            因为 Chinchilla 只有 Gopher 的 1/4 大小，所以它的推理成本也只有 1/4。
                            同样的钱，你可以服务 4 倍的用户，或者生成速度快 4 倍。这就是为什么现在的 Llama、Mistral 都倾向于做“小而精”的模型。
                        </p>
                    </div>
                 </div>
             )}

          </div>
       </div>
    </div>
  );
};

export default ComparisonViz;