import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const socket = useSocket();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Listen for socket events to update the list immediately
  useEffect(() => {
    if (!socket) return;
    
    const handleNewNotification = () => {
      fetchNotifications();
    };

    socket.on('notification', handleNewNotification);
    socket.on('new_order', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
      socket.off('new_order', handleNewNotification);
    };
  }, [socket]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all read');
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications/clear-all');
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-400 dark:text-gray-400 hover:text-[#128C7E] dark:hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-xl transition-all duration-300 group hover:scale-105 active:scale-95"
      >
        <Bell className={`h-6 w-6 ${isOpen ? 'text-[#128C7E] dark:text-[#25D366]' : ''} group-hover:animate-swing origin-top`} />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-3 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-900 bg-red-500 transform scale-100 group-hover:scale-125 transition-all duration-300 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white dark:bg-[#111b21] rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-[#128C7E] dark:text-[#25D366] hover:underline"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-xs font-medium text-red-500 hover:text-red-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${!notification.read ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notification.read ? 'bg-[#25D366]' : 'bg-transparent'}`} />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                          {notification.message}
                        </p>
                        {notification.relatedId && notification.type === 'ORDER_UPDATE' && (
                           <Link 
                             to={`/orders/${notification.relatedId}`}
                             onClick={() => setIsOpen(false)}
                             className="inline-block mt-2 text-xs font-medium text-[#128C7E] dark:text-[#25D366] hover:underline"
                           >
                             View Order
                           </Link>
                        )}
                      </div>
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkRead(notification._id)}
                          className="self-start text-gray-400 hover:text-[#128C7E] dark:hover:text-[#25D366] p-1 rounded-full hover:bg-[#25D366]/10 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
