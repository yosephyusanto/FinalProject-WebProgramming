import React from 'react'
import { router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

export default function Index({ notifications }) {
  const hasUnread = notifications.some(n => !n.read_at)

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        Notifications
      </h1>

      {notifications.length === 0 && (
        <p className="opacity-60">No notifications</p>
      )}

      <ul className="space-y-2">
        {notifications.map(notification => (
          <li
            key={notification.id}
            onClick={() => {
              router.post(
                route('notifications.read', notification.id),
                {},
                {
                  onSuccess: () => {
                    if (notification.data.url) {
                      router.visit(notification.data.url)
                    }
                  }
                }
              )
            }}
            className={`
              p-4 border rounded-lg cursor-pointer
              transition-all duration-200
              hover:bg-base-200 hover:shadow-sm
              active:scale-[0.99]
              ${!notification.read_at ? 'bg-base-100 font-semibold' : 'opacity-80'}
            `}
          >
            <p className="mb-1">
              {notification.data.title}
            </p>
            <span className="text-sm opacity-60">
              {notification.data.message}
            </span>
          </li>
        ))}
      </ul>

      {/* 🔹 Mark all as read button */}
      {hasUnread && (
        <div className="mt-6 text-left">
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={() => {
              router.post(route('notifications.readAll'))
            }}
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  )
}

Index.layout = page => <AppLayout>{page}</AppLayout>
