'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MAX_SESSION_MESSAGES = 15;

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        "Hi! I'm Dev Krafters' AI assistant. Ask me about our web design services, fixed pricing packages, or how to get started!",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      setIsOpen(true);
      const customEvent = e as CustomEvent<{ url?: string; score?: number; summary?: string }>;
      if (customEvent.detail?.url) {
        const { url, score } = customEvent.detail;
        const initialAuditMessage = `I just ran a health check on my website (${url}) and got a score of ${
          score !== undefined ? score : 'N/A'
        }/10. Can Dev Krafters help improve it?`;
        setInputValue(initialAuditMessage);
      }
    };

    window.addEventListener('open-chat-widget', handleOpenEvent);
    return () => {
      window.removeEventListener('open-chat-widget', handleOpenEvent);
    };
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (userMsgCount >= MAX_SESSION_MESSAGES) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content:
            "Session message limit reached for cost safety. Please fill out our contact form at /contact to discuss your project directly with our developer!",
        },
      ]);
      setInputValue('');
      return;
    }

    const userText = inputValue.trim();
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);
    setUserMsgCount((prev) => prev + 1);

    try {
      const apiMessages = [...messages, newUserMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      const botResponseText =
        data.reply ||
        "I'd be happy to help! You can view our pricing on the /pricing page or get a quote at /contact.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: botResponseText,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "I experienced a quick connection hiccup, but you can always reach us directly at hello@devkrafters.com or via our /contact page!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {/* FLOATING CHAT PANEL */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[380px] h-[500px] bg-white rounded-card shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* HEADER */}
          <div className="bg-primary px-4 py-3.5 flex items-center justify-between text-white border-b border-primary-dark">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center border border-accent/40">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Dev Krafters Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="font-body text-[11px] text-gray-300">
                  AI Support & Lead Desk
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus-ring"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MESSAGES LIST CONTAINER */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-surface-alt/40 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                      isUser
                        ? 'bg-accent text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-primary border border-gray-100 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            })}

            {/* TYPING / LOADING INDICATOR */}
            {isLoading && (
              <div className="flex items-start gap-2 justify-start animate-in fade-in duration-150">
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-xs border border-gray-100 text-muted flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span className="text-xs">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM BAR */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                userMsgCount >= MAX_SESSION_MESSAGES
                  ? 'Limit reached — visit /contact'
                  : 'Ask about pricing, services...'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading || userMsgCount >= MAX_SESSION_MESSAGES}
              className="flex-1 px-3.5 py-2.5 rounded-btn border border-gray-200 font-body text-xs sm:text-sm text-primary placeholder:text-gray-400 focus-ring"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading || userMsgCount >= MAX_SESSION_MESSAGES}
              className="w-10 h-10 rounded-btn bg-accent text-white flex items-center justify-center hover:bg-accent-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 focus-ring"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING ACTION TOGGLE BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-accent text-white shadow-2xl hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center relative focus-ring group"
        aria-label="Toggle AI Assistant Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </span>
          </>
        )}
      </button>
    </div>
  );
};
