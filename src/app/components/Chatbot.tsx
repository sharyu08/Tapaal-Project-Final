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
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        message: userMessage.text
    })
});

const data = await response.json();

console.log("Backend response:", data);

const botMessage: Message = {
    id: (Date.now() + 1).toString(),
    text: data.response || "AI did not return a response.",
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

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col ${isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'} bg-gray-900 rounded-2xl shadow-lg`}>
            
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    <span className="font-semibold">Tapaal Assistant</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)}>
                        {isMinimized ? <Maximize2 size={16}/> : <Minimize2 size={16}/>}
                    </button>
                    <button onClick={() => setIsOpen(false)}>
                        <X size={16}/>
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-800 border'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="text-sm text-gray-500">AI is typing...</div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask something..."
                            className="flex-1 px-3 py-2 border rounded-full text-sm"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className="bg-blue-600 text-white p-2 rounded-full"
                        >
                            <Send size={18}/>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
