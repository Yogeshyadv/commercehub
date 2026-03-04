import { useState, useEffect } from 'react';
import { X, Save, ArrowRight, Home } from 'lucide-react';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { inventoryService } from '../../services/inventoryService';
import toast from 'react-hot-toast';

export default function StockDetailsModal({ isOpen, onClose, product, onUpdate }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', quantity: 0 });

  useEffect(() => {
    if (isOpen && product) {
      loadInventory();
    }
  }, [isOpen, product]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await inventoryService.getProductInventory(product._id);
      setLocations(res.data || []);
    } catch {
      toast.error('Failed to load inventory details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.name) return toast.error('Location name required');
    try {
      await inventoryService.addLocation({
        productId: product._id,
        locationName: newLocation.name,
        quantity: parseInt(newLocation.quantity) || 0
      });
      toast.success('Location added');
      setShowAdd(false);
      setNewLocation({ name: '', quantity: 0 });
      loadInventory();
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add location');
    }
  };

  const updateQuantity = async (invId, newQty) => {
    try {
      await inventoryService.updateStock(invId, {
        type: 'adjustment',
        quantity: parseInt(newQty) || 0,
        notes: 'Manual adjustment via dashboard'
      });
      toast.success('Stock updated');
      loadInventory();
      onUpdate();
    } catch {
      toast.error('Update failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inventory Management</h3>
            <p className="text-sm text-gray-500">{product?.name}</p>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-4">
          {loading ? <Loader /> : (
            <div className="space-y-4">
              {locations.map((loc) => (
                <div key={loc._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-700/30 rounded-lg border border-gray-100 dark:border-zinc-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{loc.location?.name || 'Default'}</p>
                      <p className="text-xs text-gray-500">Last updated: {new Date(loc.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      className="w-20 px-2 py-1 text-sm border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                      defaultValue={loc.quantity}
                      onBlur={(e) => {
                        if (parseInt(e.target.value) !== loc.quantity) {
                           updateQuantity(loc._id, e.target.value);
                        }
                      }}
                    />
                    <span className="text-sm text-gray-500">units</span>
                  </div>
                </div>
              ))}

              {showAdd ? (
                <div className="p-4 border border-dashed border-blue-300 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                  <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">New Location</h4>
                  <div className="flex gap-2 mb-2">
                    <input 
                      placeholder="Warehouse B, Store Front..." 
                      className="flex-1 px-3 py-2 text-sm border rounded dark:bg-zinc-800 dark:text-white"
                      value={newLocation.name}
                      onChange={e => setNewLocation({...newLocation, name: e.target.value})}
                    />
                    <input 
                      type="number" 
                      placeholder="Qty" 
                      className="w-20 px-3 py-2 text-sm border rounded dark:bg-zinc-800 dark:text-white"
                      value={newLocation.quantity}
                      onChange={e => setNewLocation({...newLocation, quantity: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleAddLocation}>Save Location</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full dashed" onClick={() => setShowAdd(true)}>
                  + Add New Location
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
