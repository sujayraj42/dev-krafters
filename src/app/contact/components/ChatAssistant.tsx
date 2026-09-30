'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatAssistantProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  handleChatInputSend: () => void;
}

export function ChatAssistant({
  chatMessages,
  chatInput,
  setChatInput,
  handleChatInputSend,
}: ChatAssistantProps) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-card border border-gray-200 shadow-2xl overflow-hidden">
      <div className="bg-primary text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-md">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-heading font-extrabold text-sm">Dev Krafters AI Assistant</h3>
          <p className="text-[11px] text-emerald-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online • Replies Instantly
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto bg-surface-alt/60">
        {chatMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
          >
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] text-xs font-body leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-accent text-white rounded-br-none font-semibold'
                  : 'bg-white border border-gray-200 text-primary rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>

            {msg.options && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {msg.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={opt.action}
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-accent hover:bg-accent/10 text-primary text-xs font-heading font-bold shadow-2xs transition-all"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="tel"
          placeholder="Type your WhatsApp / Mobile number..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleChatInputSend()}
          className="flex-1 px-4 py-2.5 bg-surface-alt border border-gray-200 rounded-xl text-xs font-body text-primary outline-none focus:border-accent"
        />
        <button
          onClick={handleChatInputSend}
          className="px-4 py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs hover:bg-accent-dark transition shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
