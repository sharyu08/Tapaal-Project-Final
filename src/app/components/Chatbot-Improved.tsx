import React, { useState, useEffect, useRef } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Bot,
    Minimize2,
    Maximize2,
    RefreshCw
} from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your AI-powered Tapaal Assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5000/api/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.text,
                    history: updatedMessages.map(m => ({
                        role: m.sender === 'user' ? 'user' : 'assistant',
                        content: m.text
                    }))
                })
            });

            const data = await response.json();
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    text: '🤖 Chatbot error. Please try again later.',
                    sender: 'bot',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const refreshChat = () => {
        setMessages([
            {
                id: Date.now().toString(),
                text: "Hello! I'm your AI-powered Tapaal Assistant. How can I help you today?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
        setInputValue('');
        setIsTyping(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-3 h-3 animate-pulse" />
            </button>
        );
    }

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 flex flex-col ${isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Bot className="w-6 h-6 text-green-400" />
                        <div>
                            <span className="font-bold text-lg">Tapaal Assistant</span>
                            <span className="text-sm text-blue-200 ml-2">Powered by Database</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={refreshChat}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 text-blue-700 font-medium"
                            title="Refresh chat"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 text-blue-700 font-medium"
                            title={isMinimized ? "Maximize" : "Minimize"}
                        >
                            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border rounded-tl-none'
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                    <p className="text-[10px] mt-1 opacity-70">
                                        {msg.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask anything about mails, users, tracking..."
                                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isTyping}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
