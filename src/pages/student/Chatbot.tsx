import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2, Loader2, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const SUPABASE_URL = 'https://irqtxxeymkamuwketglk.supabase.co';
const CHATBOT_URL = `${SUPABASE_URL}/functions/v1/chatbot`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  '🎯 How do I find the best internship for me?',
  '📝 Tips for writing a great resume?',
  '💡 What skills are trending in tech?',
  '🧬 What is Talent DNA?',
  '🏆 How do I earn more reward points?',
  '🗺️ Help me plan my career path',
];

export default function Chatbot() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hey${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 👋 I'm your InternMatch AI Assistant.\n\nI can help you with:\n- 🔍 Finding the perfect internship\n- 📊 Understanding your skill gaps\n- 📝 Resume tips & interview prep\n- 🗺️ Career path guidance\n- 🧬 Explaining Talent DNA results\n- 💡 Learning recommendations\n\nWhat would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content }));

      const res = await fetch(CHATBOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history,
          studentContext: {
            name: user?.name ?? 'Student',
            skills: (user as any)?.skills ?? [],
            cgpa: (user as any)?.cgpa ?? 'N/A',
            interests: (user as any)?.interests ?? [],
            currentPage: 'AI Chatbot',
          },
        }),
      });

      const data = await res.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I couldn't process that. Please try again!",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check your internet and try again! 🔌",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: `Chat cleared! 🧹 How can I help you, ${user?.name?.split(' ')[0] ?? 'there'}?`,
        timestamp: new Date(),
      },
    ]);
  };

  const formatContent = (text: string) => {
    // Simple markdown-like formatting
    return text.split('\n').map((line, i) => {
      // Bold
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet points
      if (formatted.startsWith('- ')) {
        formatted = `<span class="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>${formatted.slice(2)}`;
        return (
          <div key={i} className="flex items-start pl-2 py-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
      // Numbered items
      if (/^\d+\.\s/.test(formatted)) {
        return (
          <div key={i} className="pl-2 py-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
      return (
        <p key={i} className={line === '' ? 'h-2' : ''} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                AI Assistant
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  ONLINE
                </span>
              </h1>
              <p className="text-xs text-gray-400">Powered by Gemini AI • Personalized for you</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/20"
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl glass-card p-4 space-y-4 mb-4" style={{ scrollbarWidth: 'thin' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-400'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Sparkles size={14} className="text-white" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-500/20 border border-blue-500/20 text-blue-50'
                  : 'bg-white/[0.04] border border-white/[0.08] text-gray-200'
              }`}>
                <div className="space-y-1">{formatContent(msg.content)}</div>
                <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-blue-400/50 text-right' : 'text-gray-500/50'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="text-purple-400 animate-spin" />
              <span className="text-xs text-gray-400">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-2 px-1">Suggested Questions</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-blue-500/20 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <MessageCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about internships, skills, careers..."
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all"
            disabled={isTyping}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <Send size={16} />
          Send
        </button>
      </form>
    </div>
  );
}
