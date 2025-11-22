import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Area } from 'recharts';
import { Search, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const IsoFlopChart: React.FC = () => {
  const [computeBudget, setComputeBudget] = useState(50); // Slider 1-100 scale
  const [hoveredData, setHoveredData] = useState<any>(null);
  
  // Simulation constants
  const data = useMemo(() => {
    // K represents Compute Budget. N * D ≈ K.
    // Let's scale K based on slider.
    const K = Math.pow(computeBudget, 1.5) * 100; 
    const points = [];
    const alpha = 0.34;
    const beta = 0.28;
    const A = 400; 
    const B = 400; 

    // Generate points varying N (Model Size) from small to large
    for (let i = 1; i <= 100; i++) {
        // N varies from small fraction of budget to large fraction
        // Let's map i to a reasonable range of N
        const n = i * (K / 2000); 
        if (n <= 0) continue;
        const d = K / n;
        
        // The Formula
        const loss = (A / Math.pow(n, alpha)) + (B / Math.pow(d, beta));
        points.push({ n, d, loss, ratio: d/n });
    }
    return points;
  }, [computeBudget]);

  const minPoint = useMemo(() => data.reduce((prev, curr) => (prev.loss < curr.loss ? prev : curr)), [data]);

  const getZoneInfo = (n: number) => {
    const optimalN = minPoint.n;
    if (n < optimalN * 0.6) return {
        title: "参数瓶颈区 (Under-parameterized)",
        desc: "模型太小了！哪怕你给它再多的数据，它的脑容量也不够记不住。Loss 很高。",
        color: "text-red-400",
        bg: "bg-red-900/20",
        icon: <AlertTriangle size={16} />
    };
    if (n > optimalN * 1.5) return {
        title: "数据瓶颈区 (Over-parameterized)",
        desc: "模型太大了！这就是 Kaplan 时期的误区。大模型没吃饱（数据不够），严重浪费算力。",
        color: "text-amber-400",
        bg: "bg-amber-900/20",
        icon: <AlertTriangle size={16} />
    };
    return {
        title: "Chinchilla 最优区 (Optimal)",
        desc: "完美平衡！脑子大小刚好能消化所有数据。这是性价比最高的点。",
        color: "text-emerald-400",
        bg: "bg-emerald-900/20",
        icon: <CheckCircle size={16} />
    };
  };

  const currentZone = hoveredData ? getZoneInfo(hoveredData.n) : getZoneInfo(minPoint.n);

  return (
    <div className="w-full max-w-5xl mx-auto my-12">
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-700 shadow-2xl">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-white/5 pb-6">
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-2">
                <Search className="text-violet-400" size={20}/>
                <h2 className="text-xl font-bold text-white">IsoFLOP 实验室</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
              拖动滑块改变<b>总算力预算 (Compute Budget)</b>。
              观察曲线：在每一个预算下，都有一个 Loss 最低的“甜点”。
              DeepMind 就是通过连接这些甜点，发现了新的定律。
            </p>
          </div>
          
          <div className="w-full md:w-72 bg-slate-900/50 p-4 rounded-xl border border-white/10">
            <label className="flex justify-between text-xs text-violet-300 font-mono mb-2">
              <span>MIN BUDGET</span>
              <span>COMPUTE (FLOPs)</span>
              <span>MAX BUDGET</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={computeBudget} 
              onChange={(e) => setComputeBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 transition-all"
            />
            <div className="text-center mt-2 text-white font-mono font-bold text-lg">
               10^{((computeBudget/10) + 18).toFixed(1)} FLOPs
            </div>
          </div>
        </div>

        {/* Dynamic Zone Explanation */}
        <div className={`mb-4 flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${currentZone.bg} ${hoveredData ? 'opacity-100' : 'opacity-80'}`}>
            <div className={`mt-1 ${currentZone.color}`}>
                {currentZone.icon}
            </div>
            <div>
                <h4 className={`font-bold text-sm ${currentZone.color} mb-1`}>{currentZone.title}</h4>
                <p className="text-slate-300 text-xs md:text-sm">{currentZone.desc}</p>
                {hoveredData && (
                    <div className="flex gap-4 mt-2 font-mono text-xs opacity-70">
                        <span>Params: {hoveredData.n.toFixed(0)}M</span>
                        <span>Tokens: {hoveredData.d.toFixed(0)}B</span>
                        <span>Loss: {hoveredData.loss.toFixed(3)}</span>
                    </div>
                )}
            </div>
        </div>

        {/* The Chart */}
        <div className="h-[350px] w-full relative group">
           {/* Custom Overlay Grid for Zones */}
           <div className="absolute inset-0 flex pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-[30%] h-full border-r border-dashed border-red-500/30 bg-red-500/5 flex items-center justify-center">
                  <span className="text-red-500/20 font-bold text-4xl -rotate-90 whitespace-nowrap">TOO SMALL</span>
              </div>
              <div className="w-[40%] h-full"></div>
              <div className="w-[30%] h-full border-l border-dashed border-amber-500/30 bg-amber-500/5 flex items-center justify-center">
                  <span className="text-amber-500/20 font-bold text-4xl -rotate-90 whitespace-nowrap">TOO BIG</span>
              </div>
           </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
                data={data} 
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                onMouseMove={(e) => {
                    if (e.activePayload) {
                        setHoveredData(e.activePayload[0].payload);
                    }
                }}
                onMouseLeave={() => setHoveredData(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
              <XAxis 
                dataKey="n" 
                type="number" 
                domain={['dataMin', 'dataMax']}
                tickFormatter={(val) => `${val.toFixed(0)}`} 
                label={{ value: '模型大小 (N) →', position: 'insideBottomRight', offset: -10, fill: '#64748b' }} 
                stroke="#475569"
                tick={{fill: '#64748b', fontSize: 10}}
              />
              <YAxis 
                domain={['dataMin', 'auto']} 
                hide 
              />
              <Tooltip 
                cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                content={() => null} // We use the custom top banner instead
              />
              
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 8, fill: '#fff', strokeWidth: 0 }}
                animationDuration={500}
              />
              
              {/* Optimal Point Marker */}
              <ReferenceDot x={minPoint.n} y={minPoint.loss} r={6} fill="#10b981" stroke="#fff" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center mt-2 text-xs text-slate-500 px-4">
             <div>← 模型太小 (参数不足)</div>
             <div className="text-emerald-500 font-bold">▲ 最优点 (Loss 最低)</div>
             <div>模型太大 (数据不足) →</div>
        </div>

      </div>
    </div>
  );
};

export default IsoFlopChart;