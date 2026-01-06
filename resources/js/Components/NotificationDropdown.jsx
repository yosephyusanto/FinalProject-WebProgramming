import React from 'react'
import { router, usePage } from '@inertiajs/react'

const NotificationDropdown = ({notifications, setNotifications}) => {
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? {...n, read_at: new Date()} : n)
    );
  };

  console.log('notifications', notifications);

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
                console.log('Visiting notification URL:', notification.data.url);
                router.post(
                  route('notifications.read', notification.id),
                  {},
                  {
                    onSuccess: () => {
                      router.visit(notification.data.url)
                    },
                  }
                )
                markAsRead(notification.id);
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

        {/* Mark all as read */}
        {notifications.length > 0 && unreadCount > 0 && (
          <li className="mb-1">
            <button
              className="w-full text-xs text-right text-primary"
              onClick={() => {
                router.post(route('notifications.readAll'), {}, {
                  preserveScroll: true,
                  onSuccess: () => {
                    setNotifications(prev =>
                      prev.map(n => ({ ...n, read_at: new Date() }))
                    )
                  }
                })
              }}
            >
              Mark all as read
            </button>
          </li>
        )}

      </ul>
    </div>
  )
}

export default NotificationDropdown