import { Link } from 'react-router-dom';
import { ArrowRight, Package, User, Calendar } from 'lucide-react';
import Badge from '../common/Badge';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

const statusColorMap = {
  pending: 'yellow', confirmed: 'blue', processing: 'indigo',
  shipped: 'purple', delivered: 'green', cancelled: 'red', refunded: 'gray',
};

export default function RecentOrders({ orders = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
        </div>
        <Link 
          to="/dashboard/orders" 
          className="group flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
        >
          View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar max-h-[300px]">
        {orders.length > 0 ? orders.slice(0, 5).map((order) => (
          <div 
            key={order._id} 
            className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900/30 border border-transparent transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-600 border border-gray-100 dark:border-gray-500 flex items-center justify-center text-gray-400 dark:text-gray-300 font-bold text-xs shadow-sm">
                #{order.orderNumber ? order.orderNumber.slice(-4) : order._id.slice(-4)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <User className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                  <p className="font-bold text-sm text-gray-900 dark:text-white">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                   <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                   <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{formatRelativeTime(order.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-sm text-gray-900 dark:text-white mb-1">{formatCurrency(order.total)}</p>
              <Badge color={statusColorMap[order.status] || 'gray'} className="capitalize border border-current/10">
                {order.status}
              </Badge>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
            <Package className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2 opacity-50" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No recent orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}