import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineClipboardList, HiOutlineEye, HiOutlineSearch,
  HiOutlineTruck, HiOutlineCheck, HiOutlineX,
} from 'react-icons/hi';
import { orderService } from '../services/orderService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'yellow', confirmed: 'blue', processing: 'indigo',
  shipped: 'purple', delivered: 'green', cancelled: 'red',
  refunded: 'gray', returned: 'orange',
};

const paymentColors = {
  pending: 'yellow', completed: 'green', failed: 'red', refunded: 'gray',
};

export default function Orders() {
  const { user } = useAuth();
  const isVendor = user?.role === 'vendor' || user?.role === 'vendor_staff' || user?.role === 'super_admin';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pg, setPg] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const ds = useDebounce(search, 400);

  const fetchOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const r = await orderService.getOrders(params);
      setOrders(r.data || []);
      setPg(r.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async () => {
    if (!statusModal || !newStatus) return;
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(statusModal._id, { status: newStatus, note: statusNote });
      toast.success(`Order status updated to ${newStatus}`);
      setStatusModal(null);
      setNewStatus('');
      setStatusNote('');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update status'); }
    finally { setUpdating(false); }
  };

  const getNextStatuses = (currentStatus) => {
    const transitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: ['returned', 'refunded'],
    };
    return transitions[currentStatus] || [];
  };

  const viewOrder = async (orderId) => {
    try {
      const r = await orderService.getOrder(orderId);
      setSelectedOrder(r.data);
    } catch { toast.error('Failed to load order details'); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isVendor ? 'Orders' : 'My Orders'}</h1>
          <p className="text-gray-500 mt-1">{pg.total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1" />
          <select className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? <Loader /> : orders.length === 0 ? (
        <EmptyState icon={HiOutlineClipboardList} title="No orders found" description="Orders will appear here once customers start ordering." />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                    {isVendor && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-sm text-gray-900">{order.orderNumber}</span>
                        <p className="text-xs text-gray-400">{order.source}</p>
                      </td>
                      {isVendor && (
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {order.customer?.firstName} {order.customer?.lastName}
                          <p className="text-xs text-gray-400">{order.customer?.email}</p>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-700">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4 font-semibold text-sm">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4">
                        <Badge color={statusColors[order.status] || 'gray'}>{order.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={paymentColors[order.paymentStatus] || 'gray'}>{order.paymentStatus}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => viewOrder(order._id)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          {isVendor && getNextStatuses(order.status).length > 0 && (
                            <button onClick={() => { setStatusModal(order); setNewStatus(''); }}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                              <HiOutlineTruck className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination page={pg.page} totalPages={pg.pages} total={pg.total} limit={pg.limit} onPageChange={p => fetchOrders(p)} />
        </>
      )}

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.orderNumber}`} size="lg">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><p className="text-xs text-gray-400">Status</p><Badge color={statusColors[selectedOrder.status]}>{selectedOrder.status}</Badge></div>
              <div><p className="text-xs text-gray-400">Payment</p><Badge color={paymentColors[selectedOrder.paymentStatus]}>{selectedOrder.paymentStatus}</Badge></div>
              <div><p className="text-xs text-gray-400">Method</p><p className="text-sm font-medium">{selectedOrder.paymentMethod}</p></div>
              <div><p className="text-xs text-gray-400">Date</p><p className="text-sm">{formatDateTime(selectedOrder.createdAt)}</p></div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />}
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">{formatCurrency(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(selectedOrder.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatCurrency(selectedOrder.taxAmount)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatCurrency(selectedOrder.shippingCost)}</span></div>
              {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(selectedOrder.discount)}</span></div>}
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatCurrency(selectedOrder.total)}</span></div>
            </div>

            {selectedOrder.shippingAddress && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.name}<br />
                  {selectedOrder.shippingAddress.street}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                </p>
              </div>
            )}

            {selectedOrder.statusHistory?.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Status History</h4>
                <div className="space-y-2">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Badge color={statusColors[h.status]}>{h.status}</Badge>
                      <span className="text-gray-500">{h.note}</span>
                      <span className="text-xs text-gray-400 ml-auto">{formatDateTime(h.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4 flex gap-3">
              <button
                onClick={() => {
                  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
                  const token = localStorage.getItem('token');
                  window.open(`${baseUrl}/invoices/${selectedOrder._id}?token=${token}`, '_blank');
                }}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-center text-sm"
              >
                📄 View Invoice
              </button>
              <button
                onClick={() => {
                  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
                  const token = localStorage.getItem('token');
                  window.open(`${baseUrl}/invoices/${selectedOrder._id}/download?token=${token}`, '_blank');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center text-sm"
              >
                ⬇️ Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal isOpen={!!statusModal} onClose={() => setStatusModal(null)} title="Update Order Status" size="sm">
        {statusModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Order: <span className="font-medium">{statusModal.orderNumber}</span></p>
            <p className="text-sm text-gray-600">Current: <Badge color={statusColors[statusModal.status]}>{statusModal.status}</Badge></p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="">Select status</option>
                {getNextStatuses(statusModal.status).map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="2" value={statusNote} onChange={e => setStatusNote(e.target.value)} placeholder="Add a note..." />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setStatusModal(null)}>Cancel</Button>
              <Button onClick={handleStatusUpdate} loading={updating} disabled={!newStatus}>Update Status</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}