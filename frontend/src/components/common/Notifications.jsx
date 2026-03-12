import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Trash2, Package, AlertTriangle, Megaphone, Info, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const TYPE_CONFIG = {
  NEW_ORDER:    { icon: Package,       color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' },
  ORDER_UPDATE: { icon: Package,       color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-100 dark:bg-blue-900/40' },
  LOW_STOCK:    { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400',      bg: 'bg-amber-100 dark:bg-amber-900/40' },
  PROMOTION:    { icon: Megaphone,     color: 'text-purple-600 dark:text-purple-400',    bg: 'bg-purple-100 dark:bg-purple-900/40' },
  ALERT:        { icon: ShieldAlert,   color: 'text-red-600 dark:text-red-400',          bg: 'bg-red-100 dark:bg-red-900/40' },
  SYSTEM:       { icon: Info,          color: 'text-gray-500 dark:text-gray-400',        bg: 'bg-gray-100 dark:bg-zinc-800' },
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function getOrderLink(n) {
  if (!n.relatedId) return null;
  if (n.type === 'NEW_ORDER') return '/dashboard/orders';
  if (n.type === 'ORDER_UPDATE') return `/orders/${n.relatedId}`;
  return null;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
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
        className="relative p-2.5 text-gray-400 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group hover:scale-105 active:scale-95"
      >
        <Bell className={`h-6 w-6 ${isOpen ? 'text-red-600 dark:text-red-500' : ''} group-hover:animate-swing origin-top`} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white dark:ring-gray-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">{unreadCount} unread</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 hover:underline">
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={handleClearAll} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Clear all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-7 w-7 text-gray-300 dark:text-zinc-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">You're all caught up!</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">New alerts will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-zinc-800/60">
                {notifications.map((n) => {
                  const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM;
                  const Icon = cfg.icon;
                  const orderLink = getOrderLink(n);
                  return (
                    <div
                      key={n._id}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${!n.read ? 'bg-red-50/40 dark:bg-red-950/20' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                              {n.title}
                            </p>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                          <div className="mt-1.5 flex items-center gap-3">
                            {orderLink && (
                              <Link to={orderLink} onClick={() => setIsOpen(false)} className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline">
                                View Order →
                              </Link>
                            )}
                            {n.type === 'LOW_STOCK' && (
                              <Link to="/dashboard/inventory" onClick={() => setIsOpen(false)} className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline">
                                Manage Stock →
                              </Link>
                            )}
                          </div>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => handleMarkRead(n._id)}
                            className="shrink-0 mt-1 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
