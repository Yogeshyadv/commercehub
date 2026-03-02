import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, PackageX } from 'lucide-react';
import Badge from '../common/Badge';

export default function LowStockAlert({ products = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full bg-gradient-to-br from-white to-red-50/10 dark:from-gray-800 dark:to-red-900/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Low Stock Alert</h3>
          {products.length > 0 && <Badge color="red" className="ml-1">{products.length}</Badge>}
        </div>
        <Link 
          to="/dashboard/inventory" 
          className="group flex items-center gap-1 text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold transition-colors"
        >
          View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar max-h-[300px]">
        {products.length > 0 ? products.map((product) => (
          <div 
            key={product._id} 
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/50 border border-red-100 dark:border-red-900/30 rounded-xl hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gray-50 dark:bg-gray-600 flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-600">
                {product.images?.[0]?.url ? (
                  <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-600">
                    <AlertCircle className="h-5 w-5 text-gray-300 dark:text-gray-500" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-[150px]">{product.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">SKU: {product.sku || 'N/A'}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                {product.stock} left
              </span>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
            <PackageX className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">All products well stocked 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}