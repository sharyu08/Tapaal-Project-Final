import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    Bot,
    Send,
    Minimize2,
    Maximize2,
    RefreshCw,
    Activity,
    Brain
} from "lucide-react";

interface ChatMessage {
    type: "user" | "assistant";
    text: string;
    timestamp: string;
}

const API = `${import.meta.env.VITE_API_URL}/chatbot`;

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    // auto greeting
    useEffect(() => {
        if (!isOpen || conversation.length !== 0) return;

        const greet = async () => {
            try {
                const res = await fetch(API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: "hello" })
                });

                const data = await res.json();

                setConversation([
                    {
                        type: "assistant",
                        text: data.reply || "Hello! I am your Tapaal AI assistant.",
                        timestamp: new Date().toISOString()
                    }
                ]);
            } catch (err) {
                console.error("Greeting failed:", err);
            }
        };

        const timer = setTimeout(greet, 800);
        return () => clearTimeout(timer);
    }, [isOpen]);

    // send message
    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMsg: ChatMessage = {
            type: "user",
            text: message,
            timestamp: new Date().toISOString()
        };

        setConversation(prev => [...prev, userMsg]);
        setMessage("");
        setIsTyping(true);

        try {
            const res = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMsg.text })
            });

            const data = await res.json();

            const aiMsg: ChatMessage = {
                type: "assistant",
                text: data.reply || "AI did not return a response.",
                timestamp: new Date().toISOString()
            };

            setConversation(prev => [...prev, aiMsg]);
        } catch (err) {
            setConversation(prev => [
                ...prev,
                {
                    type: "assistant",
                    text: "⚠️ Unable to reach AI server. Please try again.",
                    timestamp: new Date().toISOString()
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const refreshChat = () => {
        setConversation([]);
    };

    // floating button
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
                            <CardTitle>Tapaal AI Assistant</CardTitle>
                            <p className="text-xs opacity-80">Database Aware AI</p>
                        </div>
                    </div>

                    <div className="flex gap-1">
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
                            <Activity className="w-3 h-3" /> Connected
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                            <Brain className="w-3 h-3" /> Gemini AI
                        </span>
                    </div>

                    {/* Messages */}
                    <CardContent className="p-4 h-80 overflow-y-auto">
                        {conversation.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex mb-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.type === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-2 items-center text-gray-500">
                                <Bot className="w-4 h-4" />
                                <span className="animate-pulse">AI is thinking...</span>
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
                            placeholder="Ask about mails, tracking ID, departments..."
                            disabled={isTyping}
                        />

                        <Button onClick={handleSendMessage} disabled={isTyping || !message.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AIAssistant;
