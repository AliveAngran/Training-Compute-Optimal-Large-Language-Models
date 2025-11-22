import React, { useState } from 'react';
import { Gamepad2, BookOpen, Lightbulb, ChevronDown } from 'lucide-react';
import HeroSection from './components/HeroSection';
import FormulaExplainer from './components/FormulaExplainer';
import IsoFlopChart from './components/IsoFlopChart';
import ComparisonViz from './components/ComparisonViz';
import Calculator from './components/Calculator';
import AITutor from './components/AITutor';
import SimulationGame from './components/SimulationGame';
import { ViewState } from './types';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('HOME');

  if (viewState === 'GAME') {
    return <SimulationGame onBack={() => setViewState('HOME')} />;
  }

  const SectionHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle: string }) => (
    <div className="mb-8 border-l-4 border-violet-500 pl-6 py-2">
      <span className="text-violet-400 font-mono text-sm tracking-widest uppercase mb-1 block">Chapter {number}</span>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 text-lg font-light">{subtitle}</p>
    </div>
  );

  const Note = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="my-8 bg-slate-900/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-colors">
      <div className="absolute top-0 left-0 w-1 h-full bg-slate-700 group-hover:bg-violet-500 transition-colors"></div>
      <h4 className="flex items-center gap-2 text-white font-semibold mb-3">
        <Lightbulb size={18} className="text-yellow-400" />
        {title}
      </h4>
      <div className="text-slate-400 leading-relaxed text-sm md:text-base">
        {children}
      </div>
    </div>
  );

  return (
    <div className="text-slate-200 selection:bg-violet-500/30 font-sans">
      
      {/* Introduction */}
      <section id="intro">
        <HeroSection />
      </section>

      {/* Main Content Container */}
      <div className="relative max-w-5xl mx-auto px-6 md:px-12 space-y-32 pb-32 pt-20">
        
        {/* CHAPTER 1: THE FORMULA */}
        <section id="math" className="relative">
           <SectionHeader 
             number="01" 
             title="解构损失函数 (The Loss Function)" 
             subtitle="在大模型训练中，我们究竟在优化什么？"
           />
           
           <div className="prose prose-invert max-w-none text-slate-400 mb-8">
             <p>
               在 DeepMind 这篇论文之前，业界（如 OpenAI 的 Kaplan 团队）主要关注参数量（N）的扩展。
               大家普遍认为：<b>模型越大越好</b>。就像觉得只要脑子够大，哪怕书读得少也没关系。
             </p>
             <p>
               Chinchilla 论文的核心贡献在于提出了一个更精确的损失函数模型。它认为模型的最终表现（Loss）
               是由两个因素共同决定的：<b>模型的大小（N）</b>和<b>数据的多少（D）</b>。
               两者之间存在着微妙的边际效应递减。
             </p>
           </div>

           <FormulaExplainer />

           <Note title="导师划重点">
             注意看上面的公式交互。关键在于 α (Alpha) 和 β (Beta) 这两个参数几乎相等！
             这意味着：<b>增加模型参数</b>和<b>增加训练数据</b>对于降低 Loss 的贡献几乎是一样大的。
             这就是为什么单纯把模型做大是错误的——你必须同时喂给它更多的数据。
           </Note>
        </section>

        {/* CHAPTER 2: THE EXPERIMENT */}
        <section id="experiment" className="relative">
           <SectionHeader 
             number="02" 
             title="寻找最优解 (IsoFLOP Analysis)" 
             subtitle="如果钱（算力）是固定的，该买更大的脑子，还是买更多的书？"
           />

           <div className="prose prose-invert max-w-none text-slate-400 mb-8">
             <p>
               这是论文最核心的方法论：<b>IsoFLOP 曲线</b>（等算力曲线）。
               DeepMind 实际上并没有直接训练一个 70B 的模型，而是先训练了 400 多个小模型，
               每个模型都设定了固定的算力预算（FLOPs）。
             </p>
             <p>
               在每一个固定的算力等级下，他们尝试了各种“模型大小”与“数据量”的组合，
               然后画出了下面这条优美的曲线。请务必动手操作下面的模拟器。
             </p>
           </div>

           <IsoFlopChart />

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
             <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
               <h4 className="text-red-400 font-bold mb-2">左侧陷阱 (参数太小)</h4>
               <p className="text-sm text-slate-400">
                 如果你在曲线左侧：你的模型太小了，但数据量巨大。这就好比让一个小学生去读完国会图书馆的所有藏书。
                 他的脑容量（参数 N）成为了瓶颈，读再多书也记不住，Loss 降不下去。
               </p>
             </div>
             <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-lg">
               <h4 className="text-amber-400 font-bold mb-2">右侧陷阱 (参数太大)</h4>
               <p className="text-sm text-slate-400">
                 如果你在曲线右侧：你的模型巨大，但数据不够。这就像造了一个爱因斯坦的大脑，
                 却只让他读了几本连环画。他的智力（算力）被闲置了，这就叫<b>Under-training（欠训练）</b>。
                 Gopher 和 GPT-3 当年就掉进了这个坑里。
               </p>
             </div>
           </div>
        </section>

        {/* CHAPTER 3: THE SHOWDOWN */}
        <section id="comparison">
           <SectionHeader 
             number="03" 
             title="巅峰对决：Gopher vs Chinchilla" 
             subtitle="以弱胜强：更小的模型如何击败更大的巨人？"
           />
           
           <div className="prose prose-invert max-w-none text-slate-400 mb-8">
             <p>
               DeepMind 将理论付诸实践，训练了 Chinchilla。
               它的参数量只有 Gopher 的 1/4 (70B vs 280B)，但它阅读的数据量是 Gopher 的 4 倍 (1.4T vs 300B)。
               结果如何？Chinchilla 在几乎所有任务上都击败了 Gopher。
             </p>
             <p>
               更重要的是<b>推理成本 (Inference Cost)</b>。在工业界，模型训练是一次性的，但调用是无数次的。
               小模型的运行速度更快，显存占用更低。
             </p>
           </div>

           <ComparisonViz />
        </section>

        {/* CHAPTER 4: APPLICATION */}
        <section id="tooling" className="relative">
           <SectionHeader 
             number="04" 
             title="自己动手设计 (The Application)" 
             subtitle="理论必须落地。现在的你，已经是合格的架构师了。"
           />
           <div className="prose prose-invert max-w-none text-slate-400 mb-8">
             <p>
               根据 Chinchilla 定律，最优的资源分配比例大约是：<b>每 1 个参数，对应 20 个 Token 的训练数据</b>。
               <br/>
               即 <code className="bg-slate-800 px-1 py-0.5 rounded text-violet-300">Ratio = D / N ≈ 20</code>。
             </p>
             <p>
               使用下方的计算器，输入你老板给你的算力预算，算出你应该设计多大的模型。
             </p>
           </div>
           <Calculator />
        </section>

        {/* CTA: GAME */}
        <section className="py-10">
           <div className="relative group cursor-pointer" onClick={() => setViewState('GAME')}>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative px-7 py-16 bg-slate-950 rounded-3xl leading-none flex flex-col items-center text-center border border-white/10">
                <span className="flex items-center space-x-5 mb-6">
                  <Gamepad2 className="w-12 h-12 text-violet-400 animate-bounce" />
                  <span className="text-gray-100 text-3xl font-bold">最终考核：首席科学家模拟器</span>
                </span>
                <p className="text-slate-400 max-w-xl text-lg mb-8 leading-relaxed">
                  "Talk is cheap, show me the model." <br/>
                  如果你真的理解了 Chinchilla 定律，就请进入模拟环境，在真实的算力约束下击败 DeepMind 的旧记录。
                </p>
                <button className="pl-8 pr-6 py-4 bg-white text-black font-bold rounded-full transition-transform group-hover:scale-105 flex items-center gap-2">
                  开始实战演练 <ChevronDown className="-rotate-90" />
                </button>
              </div>
           </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-12 text-center space-y-4">
           <div className="flex justify-center gap-4 text-slate-500">
              <span className="flex items-center gap-1 text-xs uppercase tracking-widest"><BookOpen size={12}/> Hoffmann et al. 2022</span>
              <span className="flex items-center gap-1 text-xs uppercase tracking-widest"><Lightbulb size={12}/> DeepMind</span>
           </div>
           <p className="text-slate-600 text-sm">
             Design Philosophy: Post-Material Aesthetics & Computational Elegance. <br/>
             Made for learners, by learners.
           </p>
        </footer>

      </div>

      <AITutor />
    </div>
  );
};

export default App;