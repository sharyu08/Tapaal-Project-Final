import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Bot,
    Send,
    Minimize2,
    Maximize2,
    MessageCircle,
    Brain,
    Activity,
    BarChart3,
    Users,
    Mail,
    HelpCircle,
    RefreshCw
} from 'lucide-react';

interface ChatMessage {
    type: 'user' | 'assistant';
    text: string;
    timestamp: string;
}

interface AIAssistantProps {
    dashboardData?: any;
}

export const AIAssistant: React.FC<AIAssistantProps> = () => {
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [language, setLanguage] = useState<'hi' | 'en'>('hi'); // Default Hindi

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Auto-greeting when chatbot opens
        if (isOpen && conversation.length === 0) {
            const sendAutoGreeting = async () => {
                try {
                    try {
                        const response = await fetch('http://localhost:5000/api/chatbot/', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: language === 'hi' ? 'नमस्ते' : 'hello' })
                        });

                        const data = await response.json();

                        const aiMsg: ChatMessage = {
                            type: 'assistant',
                            text: data.reply,
                            timestamp: new Date().toISOString()
                        };

                        setConversation(prev => [...prev, aiMsg]);
                    } catch (error) {
                        console.error('Auto-greeting error:', error);
                    }
                } catch (error) {
                    console.error('Auto-greeting error:', error);
                }
            };

            // Send greeting after a short delay
            const timer = setTimeout(sendAutoGreeting, 1000);
            return () => clearTimeout(timer);
        }
    }, [conversation, isOpen]);

    // ✅ AI MESSAGE HANDLER
    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMsg: ChatMessage = {
            type: 'user',
            text: message,
            timestamp: new Date().toISOString()
        };

        const updatedConversation = [...conversation, userMsg];
        setConversation(updatedConversation);
        setMessage('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5000/api/chatbot/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.text,
                    history: updatedConversation.map(m => ({
                        role: m.type === 'user' ? 'user' : 'assistant',
                        content: m.text
                    }))
                })
            });

            const data = await response.json();

            const aiMsg: ChatMessage = {
                type: 'assistant',
                text: data.reply,
                timestamp: new Date().toISOString()
            };

            setConversation(prev => [...prev, aiMsg]);
        } catch (error) {
            setConversation(prev => [
                ...prev,
                {
                    type: 'assistant',
                    text: '🤖 AI service error. Please try again later.',
                    timestamp: new Date().toISOString()
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const refreshChat = () => {
        setConversation([]);
        setMessage('');
        setIsTyping(false);
    };

    const quickActions = [
        { icon: BarChart3, label: language === 'hi' ? 'आंकड़े देखें' : 'Show system statistics', message: language === 'hi' ? 'वर्तमान देखें' : 'Show system statistics' },
        { icon: Mail, label: language === 'hi' ? 'मेल ट्रैक करें' : 'Track mail status', message: language === 'hi' ? 'ट्रैकिंग स्थिति जांच' : 'Track mail status' },
        { icon: Users, label: language === 'hi' ? 'उपयोगकर्ता' : 'Users', message: language === 'hi' ? 'उपयोगकर्ताओं की जानकारी' : 'Show users list' },
        { icon: HelpCircle, label: language === 'hi' ? 'मददता' : 'Help', message: language === 'hi' ? 'कोई सवाल' : 'Help me' }
    ];

    // Handle quick action clicks
    const handleQuickAction = async (actionMessage: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/chatbot/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: actionMessage })
            });

            const data = await response.json();

            const aiMsg: ChatMessage = {
                type: 'assistant',
                text: data.reply,
                timestamp: new Date().toISOString()
            };

            setConversation(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Quick action error:', error);
        }
    };

    const formatMessage = (text: string) =>
        text ? text.split('\n').map((line, i) => <div key={i}>{line}</div>) : null;

    // 🔘 Floating Button
    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg"
                >
                    <Bot className="w-6 h-6" />
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] bg-white rounded-xl shadow-2xl border">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <Bot className="w-6 h-6" />
                        <div>
                            <CardTitle>AI Assistant</CardTitle>
                            <p className="text-xs opacity-80">Powered by AI</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {/* Language Toggle */}
                        <Button size="sm" variant="ghost" onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}>
                            {language === 'hi' ? ' HI' : ' EN'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={refreshChat}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsMinimized(!isMinimized)}>
                            {isMinimized ? <Maximize2 /> : <Minimize2 />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                            ✕
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {!isMinimized && (
                <>
                    {/* Status */}
                    <div className="bg-gray-50 px-4 py-2 border-b text-xs flex justify-between">
                        <span className="text-green-700 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Active
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                            <Brain className="w-3 h-3" /> AI Powered
                        </span>
                    </div>

                    {/* Messages */}
                    <CardContent className="p-4 h-80 overflow-y-auto">
                        {conversation.length === 0 ? (
                            <div className="text-center">
                                <Bot className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-sm text-gray-500 mb-4">
                                    Ask anything about mails, users, departments or tracking.
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickActions.map((a, i) => (
                                        <Button key={i} size="sm" variant="outline" onClick={() => handleQuickAction(a.message)}>
                                            <a.icon className="w-3 h-3 mr-1" /> {a.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            conversation.map((msg, i) => (
                                <div key={i} className={`flex mb-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {formatMessage(msg.text)}
                                    </div>
                                </div>
                            ))
                        )}

                        {isTyping && (
                            <div className="flex gap-2 items-center text-gray-500">
                                <Bot className="w-4 h-4" />
                                <span className="animate-pulse">Thinking…</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Input */}
                    <div className="p-4 border-t flex gap-2">
                        <Input
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={language === 'hi' ? 'कोई प्रश्न लिखें...' : 'Type your message...'}
                            disabled={isTyping}
                        />
                        <Button onClick={handleSendMessage} disabled={!message.trim() || isTyping}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AIAssistant;
