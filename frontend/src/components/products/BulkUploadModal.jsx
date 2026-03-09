import { useState } from 'react';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

export default function BulkUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.csv')) {
      setFile(selected);
      setResult(null);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await productService.bulkUpload(file);
      setResult(response);
      toast.success(response.message);
      if (response.success && response.errors.length === 0) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      setResult({ success: false, errors: [error.message] });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = ['name,sku,price,stock,category,description,shortDescription,brand'];
    const example = ['Sample Product,SKU123,99.99,100,Electronics,Full description here,Short desc,Samsung'];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join("\n") + "\n" + example.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bulk Upload Products</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {!result ? (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
                <FileText className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Instructions</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 opacity-90">
                    <li>Use CSV format only.</li>
                    <li>Required columns: name, sku, price.</li>
                    <li>Optional: stock, category, description, brand.</li>
                  </ul>
                  <button 
                    onClick={downloadTemplate}
                    className="mt-2 text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs"
                  >
                    Download Template
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3 text-red-600 dark:text-red-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">CSV files only (max 5MB)</p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${result.success ? 'bg-red-50 dark:bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                        <Check className="w-5 h-5 text-red-600" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {result.message || 'Upload Complete'}
                    </h4>
                </div>
                {result.errors && result.errors.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto text-sm text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 p-2 rounded border border-red-100 dark:border-red-800">
                        {result.errors.map((err, idx) => (
                            <div key={idx} className="mb-1">• {err}</div>
                        ))}
                    </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {!result && (
            <Button 
                onClick={handleUpload} 
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                disabled={!file || uploading}
            >
                {uploading ? <Loader size="sm" color="white" /> : 'Upload Products'}
            </Button>
          )}
          {result && (
              <Button onClick={() => { setResult(null); setFile(null); }} variant="outline">
                  Upload Another
              </Button>
          )}
        </div>
      </div>
    </div>
  );
}
