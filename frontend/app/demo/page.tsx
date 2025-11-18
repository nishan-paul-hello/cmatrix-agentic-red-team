"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Shield, Send, Loader2, Zap } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import Link from "next/link"

export default function DemoPage() {
   const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; animationSteps?: any[]; diagram?: { nodes: any[]; edges: any[] } }>>([])
   const [input, setInput] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const [animationSteps, setAnimationSteps] = useState<Array<any>>([])
   const [currentAnimationStep, setCurrentAnimationStep] = useState(0)
   const [isAnimating, setIsAnimating] = useState(false)
   const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setAnimationSteps([])
    setCurrentAnimationStep(0)
    setIsAnimating(false)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to fetch")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""
      let receivedAnimationSteps: any[] = []
      let receivedDiagram: any = null

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "", animationSteps: [] }])

      if (!reader) {
        throw new Error("No response body")
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n").filter(line => line.trim() !== "")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim()
            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.animation_step) {
                console.log("[DEMO] Received animation step:", parsed.animation_step.step)
                receivedAnimationSteps.push(parsed.animation_step)
                setAnimationSteps([...receivedAnimationSteps])
                setIsAnimating(true)
                setIsLoading(false)

                setMessages((prev) => {
                  const updated = [...prev]
                  const lastMsg = updated[updated.length - 1]
                  if (lastMsg.role === "assistant") {
                    lastMsg.animationSteps = [...receivedAnimationSteps]
                    if (receivedDiagram) {
                      lastMsg.diagram = receivedDiagram
                    }
                  }
                  return updated
                })

                setTimeout(() => {
                  setCurrentAnimationStep(prev => Math.min(prev + 1, receivedAnimationSteps.length))
                }, parsed.animation_step.duration)

              } else if (parsed.diagram) {
                console.log("[DEMO] Received diagram data")
                receivedDiagram = parsed.diagram
                setMessages((prev) => {
                  const updated = [...prev]
                  const lastMsg = updated[updated.length - 1]
                  if (lastMsg.role === "assistant") {
                    lastMsg.diagram = receivedDiagram
                  }
                  return updated
                })

              } else if (parsed.token) {
                assistantMessage += parsed.token
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: assistantMessage
                  }
                  return updated
                })
              } else if (parsed.error) {
                console.error("[DEMO] Stream error:", parsed.error)
                throw new Error(parsed.error)
              }
            } catch (e) {
              if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
                console.error("[DEMO] Parse error:", e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("[DEMO] Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        },
      ])
    } finally {
      setIsLoading(false)
      setIsAnimating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const resetDemo = () => {
    setMessages([])
    setInput("")
    setAnimationSteps([])
    setCurrentAnimationStep(0)
    setIsAnimating(false)
  }

  // Demo prompt suggestions
  const demoPrompts = [
    "Can you perform a security scan on my web server at 192.168.1.100 to check for any vulnerabilities?",
    "What's the current status of the nginx service on my server?",
    "Please analyze the nginx access logs for any errors or unusual activity in the last 24 hours.",
    "Deploy the updated firewall configuration to the production environment.",
    "Scan ports 1-1000 on the target IP 10.0.0.5 to see what's open.",
  ]

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="matrix-rain"></div>
      {/* Header */}
      <header className="border-b border-border bg-card cyber-border scan-line">
        <div className="container flex items-center justify-between h-14 px-4 mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="cursor-pointer">
              <Button variant="ghost" size="icon" className="cyber-border cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary cyber-border">
              <Shield className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold terminal-text">CMatrix Demo</h1>
              <div className="text-xs text-muted-foreground">Interactive Demonstration</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button 
                onClick={resetDemo}
                variant="outline"
                size="sm"
                className="cyber-border terminal-text"
              >
                Reset Demo
              </Button>
            )}
            <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse"></div>
            <div className="text-xs text-muted-foreground terminal-text">DEMO MODE</div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl px-4 py-8 mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-8 py-12">
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary cyber-border">
                  <Zap className="w-10 h-10 text-secondary-foreground" />
                </div>
                <div className="text-left">
                  <h2 className="text-4xl font-bold text-balance terminal-text glow-primary">
                    Demo Mode
                  </h2>
                  <div className="text-sm text-muted-foreground terminal-text mt-2">
                    Try a demo prompt below
                  </div>
                </div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground text-pretty max-w-md terminal-text">
                  Enter one of the demo prompts to see animated visualizations and workflow diagrams.
                </p>
              </div>
              <div className="grid gap-3 mt-4 sm:grid-cols-2 w-full max-w-2xl">
                {demoPrompts.slice(0, 4).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="px-4 py-3 text-sm text-left transition-colors border rounded-lg border-border hover:bg-accent hover:text-accent-foreground cyber-border cursor-pointer"
                  >
                    <div className="font-medium terminal-text line-clamp-2">{prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  animationSteps={message.role === "assistant" ? (message.animationSteps || animationSteps) : []}
                  currentAnimationStep={currentAnimationStep}
                  isAnimating={isAnimating && index === messages.length - 1 && message.role === "assistant"}
                  diagram={message.role === "assistant" ? message.diagram : undefined}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <ChatMessage role="assistant" content="" isLoading />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card cyber-border">
        <div className="container max-w-4xl px-4 py-4 mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a demo prompt..."
              className="pr-12 resize-none min-h-[60px] max-h-[200px] cyber-border bg-black text-white placeholder:text-gray-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute bottom-2 right-2 rounded-lg bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
          <p className="mt-2 text-xs text-center text-muted-foreground terminal-text">
            [DEMO MODE] Enter prompts from demos.json to see animated visualizations
          </p>
        </div>
      </div>
    </div>
  )
}
