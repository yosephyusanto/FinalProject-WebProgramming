import React from 'react'
import { router, usePage } from '@inertiajs/react'

const NotificationDropdown = ({notifications, setNotifications}) => {


  const unreadCount = notifications.filter(n => !n.read_at).length

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          🔔
          {unreadCount > 0 && (
            <span className="badge badge-sm badge-primary indicator-item">
              {unreadCount}
            </span>
          )}
        </div>
      </label>

      <ul
        tabIndex={0}
        className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-80"
      >
        {notifications.length === 0 && (
          <li className="p-2 text-sm opacity-60">
            No notifications
          </li>
        )}

        {notifications.map(notification => (
          <li key={notification.id}>
            <button
              onClick={() => {
                router.post(
                  route('notifications.read', notification.id),
                  {},
                  {
                    onSuccess: () => {
                      router.visit(notification.data.url)
                    },
                  }
                )
              }}
              className={`text-left ${
                !notification.read_at ? 'font-semibold' : ''
              }`}
            >
              <p>{notification.data.title}</p>
              <span className="text-xs opacity-60">
                {notification.data.message}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationDropdown