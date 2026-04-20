'use client'

import { useState, useEffect } from 'react'
import { Bell, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { deleteNotification, getNotifications, markNotificationAsRead } from '~/api/auth'

interface Notification {
  notification_id: number
  message: string
  is_read: number
  created_at: string
}

export function FloatingNotifications() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications()
      if (response.success) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error("Failed to load notifications", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      // Update local state to show as read
      setNotifications(prev => 
        prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n)
      )
    } catch (error) {
      console.error("Failed to mark as read", error)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation() // Prevent triggering the "read" click
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.notification_id !== id))
    } catch (error) {
      console.error("Failed to delete", error)
    }
  }

  const unreadCount = notifications.filter(n => n.is_read === 0).length

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
            {unreadCount > 0 && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"
              />
            )}
          </Button>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">Notifications</h3>
          {unreadCount > 0 && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
        </div>

        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">Loading...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.notification_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => notification.is_read === 0 && handleMarkAsRead(notification.notification_id)}
                  className={`group relative border-b border-slate-100 dark:border-slate-800 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors last:border-b-0 ${
                    notification.is_read === 0 ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-1">{notification.is_read === 0 ? '🔵' : '⚪'}</span>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className={`text-sm ${notification.is_read === 0 ? 'font-semibold text-slate-900' : 'text-slate-600'} dark:text-slate-50`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDelete(e, notification.notification_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            onClick={fetchNotifications}
          >
            Refresh
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}