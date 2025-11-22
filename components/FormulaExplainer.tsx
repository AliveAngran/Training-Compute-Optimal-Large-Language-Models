import React, { useState } from 'react';
import { Info, ToggleLeft, ToggleRight, Brain, Database, Activity } from 'lucide-react';

const FormulaExplainer: React.FC = () => {
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);
  const [humanMode, setHumanMode] = useState(false);

  const explanations: Record<string, { title: string; desc: string; color: string; humanTitle?: string; humanDesc?: string }> = {
    L: { 
      title: "Loss (L)", 
      desc: "交叉熵损失。简单来说，就是模型预测下一个词时犯错的概率。值越小越好。",
      humanTitle: "错误率 (愚蠢程度)",
      humanDesc: "这是我们想最小化的目标。错误率越低，AI 就越聪明。",
      color: "text-white"
    },
    E: { 
      title: "Irreducible Loss (E)", 
      desc: "贝叶斯误差。自然语言本身的不确定性带来的底噪。就像抛硬币，你无法预测结果。",
      humanTitle: "天命 (不可抗力)",
      humanDesc: "即使是神，也猜不到你下一句想说什么废话。这是语言本身的随机性，无法消除。",
      color: "text-slate-500"
    },
    A: { 
      title: "Constant A", 
      desc: "与模型结构相关的比例常数。",
      humanTitle: "智商系数",
      humanDesc: "模型架构的固有天赋。",
      color: "text-blue-400"
    },
    N: { 
      title: "Parameters (N)", 
      desc: "模型参数数量。代表了模型的拟合能力。",
      humanTitle: "脑细胞数量",
      humanDesc: "脑子越大，能记住的规律越多。这一项越大，错误率越低。",
      color: "text-blue-400"
    },
    alpha: { 
      title: "Alpha (α)", 
      desc: "参数规模的幂律指数，论文中测得约为 0.34。",
      humanTitle: "脑力收益率",
      humanDesc: "脑子变大虽然好，但效果会越来越不明显（边际收益递减）。",
      color: "text-blue-300"
    },
    B: { 
      title: "Constant B", 
      desc: "与数据集相关的比例常数。",
      humanTitle: "知识系数",
      humanDesc: "数据质量的固有属性。",
      color: "text-emerald-400"
    },
    D: { 
      title: "Dataset Size (D)", 
      desc: "训练 Token 的总数量。",
      humanTitle: "读书量",
      humanDesc: "读的书越多，见识越广。这一项越大，错误率越低。",
      color: "text-emerald-400"
    },
    beta: { 
      title: "Beta (β)", 
      desc: "数据规模的幂律指数，论文中测得约为 0.28。注意 α ≈ β。",
      humanTitle: "阅历收益率",
      humanDesc: "书读多了，新书带来的新知识也会变少。最重要的是：这个值和'脑力收益率'惊人地相似！",
      color: "text-emerald-300"
    }
  };

  const Term = ({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) => (
    <span 
      className={`relative cursor-help transition-all duration-300 inline-block px-1 ${className} ${hoveredTerm === id ? 'scale-125 font-bold z-10 text-glow' : 'opacity-80'}`}
      onMouseEnter={() => setHoveredTerm(id)}
      onMouseLeave={() => setHoveredTerm(null)}
    >
      {children}
      {hoveredTerm === id && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full animate-ping"></span>
      )}
    </span>
  );

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden transition-all hover:border-violet-500/30">
        
        {/* Toggle Human Mode */}
        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-2">
              <Activity className="text-violet-400" size={20}/>
              <h3 className="text-lg font-semibold text-white">公式解析器</h3>
           </div>
           <button 
             onClick={() => setHumanMode(!humanMode)}
             className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
           >
             <span>{humanMode ? "人话模式 (On)" : "人话模式 (Off)"}</span>
             {humanMode ? <ToggleRight className="text-violet-400" size={24}/> : <ToggleLeft className="text-slate-500" size={24}/>}
           </button>
        </div>

        {/* The Formula Visualization */}
        <div className="flex flex-wrap justify-center items-center py-12 bg-gradient-to-b from-slate-900/80 to-slate-950/80 rounded-2xl mb-8 font-mono text-2xl md:text-5xl select-none shadow-inner border border-white/5">
          
          <div className="flex flex-col items-center mx-2 md:mx-4">
             <Term id="L" className="text-white">L(N, D)</Term>
             {humanMode && <span className="text-xs text-slate-500 mt-2 font-sans">最终错误率</span>}
          </div>
          
          <span className="text-slate-600">=</span>
          
          <div className="flex flex-col items-center mx-2 md:mx-4">
            <Term id="E" className="text-slate-500">E</Term>
            {humanMode && <span className="text-xs text-slate-500 mt-2 font-sans">不可抗力</span>}
          </div>
          
          <span className="text-slate-600">+</span>
          
          <div className="flex flex-col items-center mx-2 md:mx-4 p-2 rounded-xl transition-colors hover:bg-blue-500/10">
            <div className="inline-flex flex-col items-center group">
                <Term id="A" className="text-blue-400 border-b border-blue-400/30 text-lg md:text-3xl mb-1">A</Term>
                <div className="flex items-start">
                  <Term id="N" className="text-blue-400">N</Term>
                  <Term id="alpha" className="text-blue-300 text-sm md:text-xl -mt-2 opacity-70">α</Term>
                </div>
            </div>
            {humanMode && (
                <div className="flex items-center gap-1 text-xs text-blue-400 mt-2 font-sans">
                    <Brain size={12} />
                    <span>脑力不足带来的错误</span>
                </div>
            )}
          </div>

          <span className="text-slate-600">+</span>

          <div className="flex flex-col items-center mx-2 md:mx-4 p-2 rounded-xl transition-colors hover:bg-emerald-500/10">
            <div className="inline-flex flex-col items-center group">
                <Term id="B" className="text-emerald-400 border-b border-emerald-400/30 text-lg md:text-3xl mb-1">B</Term>
                <div className="flex items-start">
                  <Term id="D" className="text-emerald-400">D</Term>
                  <Term id="beta" className="text-emerald-300 text-sm md:text-xl -mt-2 opacity-70">β</Term>
                </div>
            </div>
            {humanMode && (
                <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-sans">
                    <Database size={12} />
                    <span>见识太少带来的错误</span>
                </div>
            )}
          </div>
        </div>

        {/* Dynamic Explanation Box */}
        <div className={`transition-all duration-500 min-h-[120px] p-6 rounded-xl border ${hoveredTerm ? 'bg-slate-800/80 border-violet-500/30 translate-y-0 opacity-100' : 'bg-slate-900/50 border-white/5 translate-y-2 opacity-80'}`}>
          {hoveredTerm ? (
            <div className="animate-float-in">
              <div className="flex items-center gap-3 mb-2">
                 <h3 className={`text-xl font-bold ${explanations[hoveredTerm].color}`}>
                    {humanMode ? explanations[hoveredTerm].humanTitle : explanations[hoveredTerm].title}
                 </h3>
                 <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-slate-400 uppercase tracking-widest">
                    {humanMode ? "Analogy" : "Math"}
                 </span>
              </div>
              <p className="text-slate-300 text-base leading-relaxed">
                  {humanMode ? explanations[hoveredTerm].humanDesc : explanations[hoveredTerm].desc}
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-slate-500 gap-2">
              <Info size={24} className="opacity-50" />
              <p className="italic">请将鼠标悬停在公式的各个部分上...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaExplainer;