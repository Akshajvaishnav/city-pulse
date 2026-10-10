import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bot,
  User,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useIssues } from '../context/IssueContext';

export default function CivicChatbotModal({ setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I am **CityPulse Copilot**, your municipal AI assistant. Ask me about active potholes, 2070 city readiness scores, weather telemetry, or report status!',
      suggestedActions: ['Check Road Potholes', '2070 City Readiness', 'Sensor & Flood Alerts', 'Export Audit Report']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { selectedCity } = useIssues();
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversation_history: history,
          city_context: selectedCity === 'All' ? 'Gurugram' : (selectedCity || 'Gurugram')
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            suggestedActions: data.suggested_actions || [],
            referencedIssues: data.referenced_issues || [],
            provider: data.provider
          }
        ]);
      } else {
        throw new Error('Chatbot service unavailable');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ I encountered an issue connecting to the municipal neural engine. Please verify that the backend service is running at `http://localhost:8000`.',
          suggestedActions: ['Retry Connection', 'Check 2070 Readiness']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.includes('Map') || action.includes('Leaflet')) {
      if (setActiveTab) setActiveTab('map');
      setIsOpen(false);
    } else if (action.includes('2070') || action.includes('Readiness')) {
      if (setActiveTab) setActiveTab('readiness');
      setIsOpen(false);
    } else if (action.includes('Scanner') || action.includes('Upload')) {
      if (setActiveTab) setActiveTab('detect');
      setIsOpen(false);
    } else if (action.includes('Export') || action.includes('Audit')) {
      if (setActiveTab) setActiveTab('analytics');
      setIsOpen(false);
    } else {
      handleSend(action);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-400/40 group"
          title="Open CityPulse AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <span className="tracking-wide">Ask Civic AI</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 font-mono border border-cyan-400/30">
            LLM
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed right-4 sm:right-8 z-50 flex flex-col bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl transition-all duration-200 overflow-hidden ${
            isMinimized
              ? 'bottom-6 w-80 h-16'
              : 'bottom-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-wide">CityPulse Copilot</h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                  {selectedCity || 'Gurugram'} Municipal Telemetry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-rose-400 hover:bg-slate-800 rounded transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map((msg, idx) => {
                  const isAssistant = msg.role === 'assistant';
                  return (
                    <div
                      key={idx}
                      className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                    >
                      {isAssistant && (
                        <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                      )}

                      <div className="max-w-[85%] space-y-2">
                        <div
                          className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                            isAssistant
                              ? 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-sm'
                              : 'bg-cyan-600 text-white font-medium rounded-tr-sm shadow-md shadow-cyan-600/20'
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* Suggested Follow-up Actions */}
                        {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.suggestedActions.map((action, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleActionClick(action)}
                                className="px-2.5 py-1 text-[10px] font-semibold bg-slate-800/80 hover:bg-cyan-950/60 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 rounded-full transition cursor-pointer shadow-sm"
                              >
                                {action} →
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {!isAssistant && (
                        <div className="w-6 h-6 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 text-blue-200" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-cyan-400 text-xs pl-8">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span className="text-[11px] text-slate-400">Querying municipal AI engine...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-slate-950/90 border-t border-slate-800 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about potholes, alerts, 2070 metrics..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
