import React, { useState, useEffect } from 'react';
import { ArrowDown, Cpu, Database, Brain } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] animate-float" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-xs text-slate-300 tracking-widest uppercase font-mono">DeepMind Paper Analysis</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 text-glow">
          Training Compute-Optimal <br /> Large Language Models
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
          别怕，这其实不是关于如何把模型造得“更大”，而是关于如何造得“更聪明”。
          <br />
          <span className="text-cyan-400/80 text-sm font-mono mt-2 block">Let's decode the Chinchilla scaling laws together.</span>
        </p>

        {/* Interaction 1: The Triangle of Trade-offs */}
        <div className="mt-12 p-8 glass-panel rounded-2xl border border-white/5 relative group hover:border-violet-500/30 transition-all duration-500">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-950 border border-violet-500/50 rounded-full text-xs text-violet-300 font-mono">
            交互 01: 核心权衡
          </div>
          <p className="text-sm text-slate-400 mb-6 font-mono">
            如果你的算力预算 (Compute) 是有限的，你应该把钱花在哪里？
          </p>
          <div className="flex justify-center items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-blue-300">PARAMETERS (N)</span>
              <span className="text-[10px] text-slate-500 max-w-[120px]">模型的脑容量<br/>(更聪明)</span>
            </div>
            
            <div className="h-px w-24 bg-gradient-to-r from-blue-500/20 via-white/20 to-emerald-500/20"></div>
            
            <div className="flex flex-col items-center gap-3">
               <div className="p-5 bg-violet-500/20 rounded-full border border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.2)] animate-pulse">
                <Cpu className="w-10 h-10 text-violet-400" />
              </div>
              <span className="text-sm font-bold tracking-widest text-violet-300">COMPUTE (C)</span>
              <span className="text-[10px] text-slate-500">有限的算力预算</span>
            </div>

            <div className="h-px w-24 bg-gradient-to-r from-emerald-500/20 via-white/20 to-blue-500/20"></div>

            <div className="flex flex-col items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <Database className="w-8 h-8 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-emerald-300">DATA (D)</span>
              <span className="text-[10px] text-slate-500 max-w-[120px]">训练的阅读量<br/>(更有见识)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce text-slate-500">
        <ArrowDown size={24} />
      </div>
    </div>
  );
};

export default HeroSection;
