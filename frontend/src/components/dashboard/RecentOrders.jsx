import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import Badge from '../common/Badge';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

const statusColorMap = {
  pending: 'yellow', confirmed: 'blue', processing: 'indigo',
  shipped: 'purple', delivered: 'green', cancelled: 'red', refunded: 'gray',
};

export default function RecentOrders({ orders = [] }) {
  return (
    <div className="bg-white dark:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-white/[0.09] overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.09] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent orders</h3>
          <p className="text-xs text-gray-400 dark:text-[#8080a8] mt-0.5">Latest transactions</p>
        </div>
        <Link
          to="/dashboard/orders"
          className="group flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:underline transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="divide-y divide-gray-50 dark:divide-white/[0.06]">
          {orders.slice(0, 6).map((order) => (
            <div
              key={order._id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/60 dark:hover:bg-white/[0.04] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-gray-100 dark:bg-white/[0.05] rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-gray-500 dark:text-[#9898b8]">
                    #{(order.orderNumber || order._id).slice(-4)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#DC2626] dark:group-hover:text-[#DC2626] transition-colors">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-[#8080a8]">{formatRelativeTime(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                <Badge color={statusColorMap[order.status] || 'gray'}>{order.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-14 px-6 text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-white/[0.04] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-gray-300 dark:text-[#6060a0]" />
          </div>
          <p className="text-sm font-semibold text-gray-500 dark:text-[#9898b8]">No orders yet</p>
          <p className="text-xs text-gray-400 dark:text-[#7070a0] mt-1">Orders will appear here once customers start buying.</p>
        </div>
      )}
    </div>
  );
}