import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MDEditor from "@uiw/react-md-editor";
import {
  Send,
  Bot,
  User,
  RotateCcw,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { geminiService } from "@/lib/gemini";
import { useAuth } from "@/lib/auth";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    available: boolean;
    configured: boolean;
  }>({ available: false, configured: false });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Check API status on component mount
    const status = geminiService.getApiStatus();
    setApiStatus(status);

    // Add welcome message
    setMessages([
      {
        id: "1",
        content: `Hello ${
          user?.email ? user.email.split("@")[0] : "there"
        }! I'm your AI study assistant. I'm here to help you with your academic journey. You can ask me about any subject, study strategies, or academic concepts. How can I assist you today?`,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, [user]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiService.sendMessage(inputMessage);

      // Check if the response indicates an API error
      if (
        response.includes("Sorry, the chatbot is currently unavailable") ||
        response.includes("encountered an error")
      ) {
        throw new Error("API configuration error");
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm having trouble connecting to my AI service right now. Please check your internet connection and try again. If the problem persists, you may need to configure the Gemini API key.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError("Failed to get response from AI service");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = async () => {
    try {
      await geminiService.resetChat();
      setMessages([
        {
          id: Date.now().toString(),
          content:
            "Chat has been reset. How can I help you with your studies today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setError(null);
    } catch (error) {
      console.error("Error resetting chat:", error);
      setError("Failed to reset chat");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary rounded-lg">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Study Assistant</h1>
            <p className="text-muted-foreground">
              Your AI-powered learning companion
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {!apiStatus.configured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Gemini API key not found. Please check your .env file and
                restart the development server.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="w-full">
        <Card className="h-[70vh] min-h-[500px] flex flex-col">
          <CardHeader className="flex-shrink-0 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Chat
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetChat}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        {message.sender === "bot" ? (
                          <>
                            <AvatarImage src="/bot-avatar.png" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/user-avatar.png" />
                            <AvatarFallback className="bg-secondary">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`flex-1 min-w-0 ${
                        message.sender === "user" ? "flex justify-end" : ""
                      }`}
                    >
                      <div className="flex flex-col">
                        <div
                          className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="text-sm leading-6">
                            {message.sender === "bot" ? (
                              <div data-color-mode="light">
                                <MDEditor.Markdown
                                  source={message.content}
                                  style={{
                                    backgroundColor: "transparent",
                                    color: "inherit",
                                    fontSize: "inherit",
                                    lineHeight: "inherit",
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="break-words whitespace-pre-wrap">
                                {message.content}
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={`text-xs mt-2 text-muted-foreground ${
                            message.sender === "user"
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="inline-block bg-muted rounded-2xl px-4 py-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 border-t bg-background">
              <div className="p-4">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your studies..."
                      disabled={isLoading}
                      className="min-h-[44px] resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="icon"
                    className="h-[44px] w-[44px] flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
