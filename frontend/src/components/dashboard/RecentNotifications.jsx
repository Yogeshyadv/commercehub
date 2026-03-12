import { Bell, Clock, Package, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

const getIcon = (type) => {
  switch (type) {
    case 'ORDER_UPDATE': return <Package className="w-5 h-5 text-blue-500" />;
    case 'NEW_ORDER': return <Package className="w-5 h-5 text-red-500" />;
    case 'SYSTEM': return <Info className="w-5 h-5 text-gray-500" />;
    case 'PROMOTION': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    case 'ALERT': return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'LOW_STOCK': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    default: return <Bell className="w-5 h-5 text-indigo-500" />;
  }
};

export default function RecentNotifications({ notifications = [] }) {
  if (!notifications.length) {
    return (
      <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm
        border border-gray-100 dark:border-white/[0.07] overflow-hidden
        flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
        <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Notifications</h3>
        <p className="text-sm text-gray-500 dark:text-[#5a5a7a] max-w-[200px]">
          You're all caught up! New updates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm
      border border-gray-100 dark:border-white/[0.07] overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.07] flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#dc2626]" />
            Recent Notifications
        </h3>
        <span className="text-[11px] font-bold px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-500/20">
            {notifications.length} New
        </span>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-white/[0.05] overflow-y-auto custom-scrollbar flex-1 text-left">
        {notifications.map((notification) => (
          <div 
            key={notification._id} 
            className="p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group border-l-4 border-transparent hover:border-[#dc2626]"
          >
            <div className="flex gap-4">
              <div className={`mt-1 flex-shrink-0 p-2 rounded-full h-fit transition-transform duration-300 group-hover:scale-110 ${!notification.read ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-gray-50 dark:bg-white/5'}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                    <p className={`text-sm line-clamp-1 ${!notification.read ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-[#5a5a7a] flex-shrink-0 flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(notification.createdAt)}
                    </span>
                </div>
                <p className={`text-sm line-clamp-2 leading-relaxed ${!notification.read ? 'text-gray-600 dark:text-[#8888a8]' : 'text-gray-500 dark:text-[#5a5a7a]'}`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
