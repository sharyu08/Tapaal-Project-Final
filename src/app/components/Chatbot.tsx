import React, { useState, useEffect, useRef } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Bot,
    Minimize2,
    Maximize2,
    RefreshCw,
    ChevronDown
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
    const [showSuggestions, setShowSuggestions] = useState(false);
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chatbot/`, {
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
                        <div className="flex gap-2 relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setShowSuggestions(false)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your question or choose from suggestions below..."
                                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => setShowSuggestions(!showSuggestions)}
                                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-all duration-200 text-gray-700"
                                title="Toggle suggestions"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isTyping}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                        {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800">Quick Suggestions</h3>
                                    <button
                                        onClick={() => setShowSuggestions(false)}
                                        className="text-gray-400 hover:text-gray-600 p-1 rounded"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            setInputValue('Show users list');
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-300 text-gray-700 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">Show users list</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInputValue('Show statistics');
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-300 text-gray-700 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm">Show statistics</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInputValue('Show inward mails');
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-300 text-gray-700 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">Show inward mails</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInputValue('Show outward mails');
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-300 text-gray-700 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">Show outward mails</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInputValue('Show departments');
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-300 text-gray-700 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">Show departments</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInputValue('Track mail status');
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-300 text-gray-700 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">Track mail status</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInputValue('Help');
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-300 text-gray-700 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">Help</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>
        </div>
        
        {/* Footer */ }
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-200 p-2 text-center">
        <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
                Powered by Tapaal Database
            </span>
            <span className="text-xs text-gray-500 ml-2"> 2024</span>
        </div>
    </div>
    );
}
        </div >
    )
}
}
