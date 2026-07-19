// pages/AIChat.jsx
// Chat interface for the Gemini-powered AI Nutrition Assistant.

import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSend, FiCpu, FiUser } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SUGGESTED_QUESTIONS = [
  'Can diabetics eat mango?',
  'Suggest a 2000 calorie diet',
  'Suggest a protein-rich breakfast',
  'Suggest a meal plan for weight loss',
];

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your AI Nutrition Assistant. Ask me anything about food, calories, or healthy eating.",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setSending(true);

    try {
      const { data } = await api.post('/ai/recommend', {
        message: trimmed,
        userContext: user
          ? {
              age: user.age,
              gender: user.gender,
              goal: user.goal,
              activityLevel: user.activityLevel,
            }
          : undefined,
      });

      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get a response. Please try again.';
      toast.error(message);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "Sorry, I couldn't process that right now." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div>
        <h1 className="page-title">AI Nutrition Assistant</h1>
        <p className="text-sm text-gray-500">
          Get instant nutrition guidance. This is general advice, not a medical diagnosis.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => sendMessage(q)}
            className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="card flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                  msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-700'
                }`}
              >
                {msg.role === 'user' ? <FiUser size={16} /> : <FiCpu size={16} />}
              </span>
              <div
                className={`max-w-[75%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-50 text-gray-700 border border-gray-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <FiCpu size={16} />
              </span>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-400">
                Thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-100 p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a nutrition question..."
            className="input-field flex-1"
          />
          <button type="submit" disabled={sending} className="btn-primary !px-4">
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
