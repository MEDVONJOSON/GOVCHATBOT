"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
    id: string
    role: "user" | "bot"
    content: string
    timestamp: Date
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "bot",
            content: "Hello! I am the Truth Engine chatbot. You can ask me to verify claims or report scams. How can I help you today?",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    // Optimized scroll effect - only triggers when message count changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (scrollAreaRef.current) {
                const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (scrollContainer) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [messages.length])

    const handleSendMessage = useCallback(async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsLoading(true)

        try {
            const response = await fetch("http://localhost:3001/api/web-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage.content }),
            })

            if (!response.ok) {
                throw new Error("Failed to send message")
            }

            const data = await response.json()

            const botMessage: Message = {
                id: data.id || Date.now().toString(),
                role: "bot",
                content: data.text,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, botMessage])
        } catch (error) {
            console.error("Error sending message:", error)
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: "bot",
                content: "Sorry, I encountered an error processing your request. Please try again later.",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }, [inputValue, isLoading])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }, [handleSendMessage])

    return (
        <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col shadow-lg">
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    Truth Engine Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarFallback className={message.role === "bot" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                                        {message.role === "bot" ? "TE" : "ME"}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={`rounded-lg p-3 max-w-[80%] text-sm ${message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                    <span className="text-[10px] opacity-70 mt-1 block">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground">TE</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg p-3 flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="ml-2 text-xs text-muted-foreground">Analyzing...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
                <div className="flex w-full gap-2">
                    <Input
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="flex-1"
                        autoFocus
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
