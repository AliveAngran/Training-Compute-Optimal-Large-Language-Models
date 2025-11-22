import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { askChinchillaTutor } from '../services/geminiService';
import { ChatMessage } from '../types';

const AITutor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '你好！我是你的 Chinchilla 论文专属导师。关于算力、Scaling Laws 或者参数分配，哪里看不懂尽管问我！我会用最通俗的话解释给你听。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const context = "User is looking at the Chinchilla scaling laws visualization.";
    const answer = await askChinchillaTutor(userMsg, context);

    setMessages(prev => [...prev, { role: 'model', text: answer }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-110 transition-transform duration-300 flex items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles size={24} className="animate-pulse" />
        <span className="font-semibold hidden md:inline">看不懂？问导师</span>
      </button>

      {/* Chat Interface */}
      <div className={`fixed bottom-8 right-8 z-50 w-[90vw] md:w-[400px] h-[600px] flex flex-col glass-panel rounded-2xl shadow-2xl transition-all duration-500 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-violet-900/20 rounded-t-2xl">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
             <h3 className="font-bold text-white">Chinchilla Tutor AI</h3>
           </div>
           <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
             <X size={20} />
           </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400 text-sm">
                 <Loader2 size={14} className="animate-spin" />
                 <span>思考中...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50 rounded-b-2xl">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="例如：为什么要用等 FLOPs 曲线？"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 text-white"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="p-2 bg-violet-600 rounded-xl text-white hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AITutor;
