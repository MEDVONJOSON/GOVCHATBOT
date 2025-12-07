import { ChatInterface } from "@/components/chat/chat-interface"
import { Navigation } from "@/components/navigation"

export default function ChatPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground">Truth Engine Chat</h1>
                    <p className="text-muted-foreground mt-2">
                        Verify claims, report scams, and get instant answers from our AI assistant.
                    </p>
                </div>
                <ChatInterface />
            </main>
        </div>
    )
}
