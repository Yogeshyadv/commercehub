import { Bell, Clock, Package, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

const getIcon = (type) => {
  switch (type) {
    case 'ORDER_UPDATE': return <Package className="w-5 h-5 text-blue-500" />;
    case 'NEW_ORDER': return <Package className="w-5 h-5 text-red-500" />;
    case 'SYSTEM': return <Info className="w-5 h-5 text-gray-500" />;
    case 'PROMOTION': return <CheckCircle className="w-5 h-5 text-red-500" />;
    case 'ALERT': return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'LOW_STOCK': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    default: return <Bell className="w-5 h-5 text-indigo-500" />;
  }
};

export default function RecentNotifications({ notifications = [] }) {
  if (!notifications.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Notifications</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px]">
          You're all caught up! New updates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            Recent Notifications
        </h3>
        <span className="text-xs font-bold px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800/30">
            {notifications.length} New
        </span>
      </div>
      
      <div className="divide-y divide-gray-50 dark:divide-gray-700 overflow-y-auto custom-scrollbar flex-1">
        {notifications.map((notification) => (
          <div 
            key={notification._id} 
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all cursor-pointer group border-l-4 border-transparent hover:border-red-500"
          >
            <div className="flex gap-4">
              <div className={`mt-1 flex-shrink-0 p-2 rounded-full h-fit transition-transform duration-300 group-hover:scale-110 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                    <p className={`text-sm line-clamp-1 ${!notification.read ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(notification.createdAt)}
                    </span>
                </div>
                <p className={`text-sm line-clamp-2 ${!notification.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
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
