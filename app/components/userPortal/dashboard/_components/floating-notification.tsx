'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'

interface Notification {
  id: string
  icon: string
  title: string
  description: string
  timestamp: string
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    icon: '✓',
    title: 'Loan Approved',
    description: 'Your loan application has been approved.',
    timestamp: '2 mins ago',
  },
  {
    id: '2',
    icon: '💬',
    title: 'New Message',
    description: 'You have a new message from support.',
    timestamp: '15 mins ago',
  },
  {
    id: '3',
    icon: '🔒',
    title: 'Security Alert',
    description: 'New login from Chrome on Windows.',
    timestamp: '1 hour ago',
  },
]

export function FloatingNotifications() {
  const [open, setOpen] = useState(false)
  const [notifications] = useState<Notification[]>(defaultNotifications)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="fixed top-4 right-4 z-50"
        >
          <Button
            variant="outline"
            size="icon"
            className="relative h-10 w-10 rounded-full border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"
            />
          </Button>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">Notifications</h3>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-1">{notification.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}