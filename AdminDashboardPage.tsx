import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

interface Message {
    sender: 'user' | 'assistant';
    text: string;
    time: string;
}

export const AIChatDrawer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'assistant',
            text: "Hello! I am your AI Career Advisor. Ask me anything about career options, required skills, learning roadmaps, or how to prepare for your future!",
            time: 'Just now'
        }
    ]);
    const [suggestions, setSuggestions] = useState<string[]>([
        "What skills should I learn for data analysis?",
        "What is the difference between a data analyst and data scientist?",
        "What should I learn after Python?",
        "What careers match my interests?",
        "How can I improve my programming skills?"
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = async (messageText?: string) => {
        const textToSend = (messageText || input).trim();
        if (!textToSend || loading) return;

        const userMsg: Message = {
            sender: 'user',
            text: textToSend,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post<{ reply: string; suggestions?: string[] }>('/chat', {
                message: textToSend
            });

            const botMsg: Message = {
                sender: 'assistant',
                text: res.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMsg]);
            if (res.suggestions && res.suggestions.length > 0) {
                setSuggestions(res.suggestions);
            }
        } catch (err: any) {
            const errorMsg: Message = {
                sender: 'assistant',
                text: err.message || "I'm having trouble connecting right now. Please try again shortly.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-brand-600 via-accent-indigo to-accent-purple text-white shadow-2xl hover:shadow-brand-500/50 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center gap-2.5 group"
                    title="Open AI Career Assistant"
                >
                    <div className="relative">
                        <Bot className="w-6 h-6 animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white"></span>
                    </div>
                    <span className="font-bold text-sm hidden sm:inline-block pr-1 font-sans">
                        AI Assistant
                    </span>
                </button>
            )}

            {/* Slide-out Drawer / Chat Modal */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[420px] h-[580px] max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-600 via-accent-indigo to-accent-purple p-4 text-white flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-cyan-200" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm font-sans flex items-center gap-1.5">
                                    AI Career Assistant
                                    <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded-full border border-emerald-400/30">
                                        Online
                                    </span>
                                </h3>
                                <p className="text-[11px] text-brand-100">Personalized Career & Skill Guidance</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'assistant' && (
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-purple text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-brand-600 text-white rounded-br-none shadow-sm'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-soft'
                                        }`}
                                >
                                    <p className="whitespace-pre-line">{msg.text}</p>
                                    <span
                                        className={`block text-[10px] mt-1 ${msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'
                                            }`}
                                    >
                                        {msg.time}
                                    </span>
                                </div>

                                {msg.sender === 'user' && (
                                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
                                Thinking & analyzing career data...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions Pills */}
                    <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200/80">
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-brand-600" /> Quick Questions
                        </p>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            {suggestions.slice(0, 3).map((sug, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(sug)}
                                    disabled={loading}
                                    className="text-[11px] whitespace-nowrap bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition-colors shadow-2xs shrink-0 disabled:opacity-50"
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Footer */}
                    <div className="p-3 bg-white border-t border-slate-200">
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
                                placeholder="Ask about careers, skills, roadmaps..."
                                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400">
                            <AlertCircle className="w-3 h-3 text-slate-400" />
                            <span>Guidance based on student profile; not guaranteed prediction.</span>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
};
