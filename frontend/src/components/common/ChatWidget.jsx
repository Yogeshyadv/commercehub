import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, ChevronDown, RotateCcw, Bot, Terminal, Cpu, Zap } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm your **Neural Nexus** powered by Groq.\n\nI have direct access to your telemetry — query me about **orders, inventory metrics, or revenue forecasts**.",
};

const SUGGESTIONS = [
  { label: '📊 Revenue Telemetry',      text: 'Analyze my sales trajectory for this fiscal month.' },
  { label: '⚠️ Inventory Alerts',       text: 'Identify critical stock depletion across nodes.' },
  { label: '🏆 Elite Assets',           text: 'List the highest performing assets in current period.' },
  { label: '🕊️ Active Protocols',        text: 'Review count of pending order protocols.' },
  { label: '💡 Growth Strategy',        text: 'Synthesize 3 tactical insights for revenue optimization.' },
];

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.08]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';
const SUB  = 'text-gray-400 dark:text-[#5a5a7a]';

// Minimal markdown → JSX renderer (bold, bullets, line breaks)
function renderMarkdown(text) {
  if (!text) return null;
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <li key={i} className="ml-4 list-disc text-[13px] font-medium leading-relaxed mb-1">
            {renderInline(line.replace(/^[-•]\s*/, ''))}
          </li>
        );
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-[13px] font-medium leading-relaxed mb-1">{renderInline(line)}</p>;
    });
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') ? <strong key={i} className="font-black text-[#dc2626]">{p.slice(2, -2)}</strong> : p
  );
}

export default function ChatWidget() {
  const { user } = useAuth();
  const isVendor = user?.role === 'vendor' || user?.role === 'vendor_staff' || user?.role === 'super_admin';

  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showSugs, setShowSugs] = useState(true);
  const bottomRef  = useRef();
  const inputRef   = useRef();
  
  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [open, messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = useCallback(async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    const next = [...messages, { role: 'user', content: msg }];
    setMessages(next);
    setInput('');
    setShowSugs(false);
    setLoading(true);
    try {
      const res = await aiService.chat(next.filter(m => m.role !== 'system'));
      setMessages(prev => [...prev, { role: 'assistant', content: res.data?.reply || "Communication failure. Retry protocol." }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Neural link interrupted. Please check network status.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading]);

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleReset = () => {
    setMessages([WELCOME]);
    setShowSugs(true);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {open && (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`w-[360px] sm:w-[400px] h-[580px] flex flex-col ${CARD} overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10`}
            >
                {/* Tactical Header */}
                <div className="px-5 py-5 bg-[#dc2626] flex items-center gap-3.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                        <Cpu className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0 z-10">
                        <p className="text-[13px] font-black text-white uppercase tracking-wider leading-none">Neural Nexus Agent</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Active Link · Secured</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 z-10">
                        <button onClick={handleReset} className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all"><RotateCcw className="w-4 h-4" /></button>
                        <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all"><ChevronDown className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 custom-scrollbar bg-white dark:bg-[#0a0a0d]">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 flex items-center justify-center shrink-0 mt-1">
                                    <Sparkles className="w-4 h-4 text-[#dc2626]" />
                                </div>
                            )}
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-[#dc2626] text-white font-bold rounded-tr-none' 
                                    : 'bg-gray-50 dark:bg-white/[0.02] text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-white/[0.05] rounded-tl-none'
                            }`}>
                                {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 flex items-center justify-center shrink-0">
                                <RotateCcw className="w-4 h-4 text-[#dc2626] animate-spin" />
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl rounded-tl-none bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] flex items-center gap-3">
                                <div className="flex gap-1">
                                    {[0,1,2].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-[#dc2626]/40 animate-bounce" style={{ animationDelay: `${d*0.2}s` }} /> )}
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Synthesizing Intelligence...</span>
                            </div>
                        </div>
                    )}

                    {showSugs && isVendor && messages.length === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626] mb-3 opacity-60">Telemetry Queries</p>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTIONS.map(s => (
                                    <button
                                        key={s.text}
                                        onClick={() => send(s.text)}
                                        className="px-3.5 py-2.5 rounded-xl border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-[11px] font-bold text-gray-600 dark:text-[#8888a8] hover:border-[#dc2626] hover:text-[#dc2626] transition-all active:scale-95 shadow-sm"
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Matrix */}
                <div className="p-4 bg-white dark:bg-[#0d0d0d] border-t border-gray-100 dark:border-white/[0.08]">
                    <div className="flex items-end gap-3 p-1.5 bg-gray-50 dark:bg-black/40 rounded-2xl border border-gray-100 dark:border-white/[0.06] focus-within:ring-2 focus-within:ring-[#dc2626]/20 transition-all">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Awaiting neural input..."
                            rows={1}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#3a3a5a] py-3.5 px-4 resize-none max-h-32 custom-scrollbar"
                        />
                        <button
                            onClick={() => send()}
                            disabled={!input.trim() || loading}
                            className="w-11 h-11 flex items-center justify-center bg-[#dc2626] text-white rounded-xl shrink-0 shadow-lg shadow-red-500/20 disabled:grayscale disabled:opacity-30 transition-all active:scale-90"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-500 ${
            open ? 'bg-gray-900 dark:bg-white text-white dark:text-black rotate-90' : 'bg-[#dc2626] text-white'
        }`}
        style={{ boxShadow: open ? 'none' : '0 12px 32px rgba(220,38,38,0.3)' }}
      >
        {open ? <X className="w-7 h-7" /> : <Sparkles className="w-7 h-7" fill="currentColor" />}
      </motion.button>
    </div>
  );
}
