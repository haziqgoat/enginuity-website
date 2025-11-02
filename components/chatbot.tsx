"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2,
  AlertCircle
} from "lucide-react"
import { AuthRequired } from "@/components/auth-required" // Added import

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hello! I'm the HNZ Consult Assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date()
  },
  {
    id: "2",
    text: "You can ask me about our projects, services, career opportunities, or anything else related to HNZ Consult.",
    sender: "bot",
    timestamp: new Date()
  }
]

const suggestedQuestions = [
  "What services do you offer?",
  "Tell me about your projects",
  "How can I apply for a job?",
  "What makes HNZ Consult different?"
]

export function ChatBot() {
  return (
    <AuthRequired>
      <ChatBotContent />
    </AuthRequired>
  )
}

function ChatBotContent() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (inputValue.trim() === "" || isLoading) return

    // Clear previous errors
    setError(null)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Prepare messages for API (excluding timestamp)
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      }))

      // Call our API route
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response from AI")
      }

      const data = await response.json()
      
      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "bot",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message || "Failed to connect to AI service")
      
      // Fallback response in case of error
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I'm having trouble connecting right now. Please try again later or contact us directly at hnzconsult@yahoo.com\n\nError: ${error.message || "Connection failed"}`,
        sender: "bot",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, fallbackResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-2xl z-50 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0 transition-all duration-300 hover:scale-110"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
        ) : (
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] md:w-full max-w-md h-[60vh] md:h-[70vh] max-h-[500px] md:max-h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white p-3 md:p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Bot className="h-4 w-4 md:h-6 md:w-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">HNZ Assistant</h3>
                <p className="text-xs text-blue-200">Online now</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-xs md:text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50">
            <div className="space-y-3 md:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-1.5 md:space-x-2">
                      {message.sender === "bot" && (
                        <Bot className="h-4 w-4 md:h-5 md:w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      )}
                      {message.sender === "user" && (
                        <User className="h-4 w-4 md:h-5 md:w-5 text-white flex-shrink-0 mt-0.5" />
                      )}
                      <div className="whitespace-pre-wrap text-sm md:text-base">{message.text}</div>
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "user" ? "text-orange-100" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-3 py-2 md:px-4 md:py-3 shadow-sm max-w-[85%] md:max-w-[80%]">
                    <div className="flex items-center space-x-1.5 md:space-x-2">
                      <Bot className="h-4 w-4 md:h-5 md:w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="flex space-x-1">
                        <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="border-t border-gray-200 bg-white p-2 md:p-3">
              <p className="text-xs text-gray-500 mb-1.5 md:mb-2 px-1">Suggested questions:</p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-auto py-1.5 px-2 md:py-2 md:px-3 text-[0.65rem] md:text-xs leading-tight border-gray-300 hover:bg-orange-50 hover:border-orange-300"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-2 md:p-3">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full border border-gray-300 rounded-xl py-2.5 px-3 pr-10 md:py-3 md:px-4 md:pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none max-h-32 text-sm md:text-base"
                  rows={1}
                  style={{ minHeight: "40px" }}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={inputValue.trim() === "" || isLoading}
                  size="icon"
                  className="absolute right-1.5 bottom-1.5 h-7 w-7 md:right-2 md:bottom-2 md:h-8 md:w-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin text-white" />
                  ) : (
                    <Send className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-[0.65rem] md:text-xs text-gray-500 mt-1.5 md:mt-2 text-center">
              HNZ Consult Assistant v1.0
            </p>
          </div>
        </div>
      )}
    </>
  )
}