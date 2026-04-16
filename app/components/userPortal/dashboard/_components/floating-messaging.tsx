'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'

interface Message {
  id: string
  type: 'user' | 'agent'
  text: string
  timestamp: string
}

const defaultMessages: Message[] = [
  {
    id: '1',
    type: 'agent',
    text: 'Hello! Welcome to Nexus Support. How can I help you today?',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    type: 'user',
    text: 'I have a question about my loan application.',
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    type: 'agent',
    text: 'Of course! I&apos;d be happy to help. What would you like to know?',
    timestamp: '10:32 AM',
  },
]

export function FloatingMessaging() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(defaultMessages)
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue('')

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        text: 'Thank you for your message. Our team will get back to you shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, agentMessage])
    }, 500)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-96 bg-white dark:bg-slate-950 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
                    Nexus Support
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-emerald-500 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-bl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.type === 'user'
                            ? 'text-emerald-100'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage()
                  }
                }}
                className="text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-900"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-2"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full shadow-lg bg-emerald-500 hover:bg-emerald-600 text-white p-0"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    </>
  )
}
