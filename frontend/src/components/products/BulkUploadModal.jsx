import { useState } from 'react';
import { X, Upload, FileText, Check, AlertCircle, Eye } from 'lucide-react';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

function parseCsvPreview(text) {
  const rows = text.split('\n').filter(Boolean).slice(0, 7);
  if (rows.length < 2) return null;
  const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const data = rows.slice(1, 6).map(row => {
    const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    return headers.reduce((obj, h, i) => { obj[h] = values[i] || ''; return obj; }, {});
  });
  return { headers, data };
}

export default function BulkUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    const name = selected.name.toLowerCase();
    if (!name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }
    setFile(selected);
    setResult(null);
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target.result;
      const parsed = parseCsvPreview(text);
      setPreview(parsed);
    };
    reader.readAsText(selected);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-white/[0.08] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.08] flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bulk Upload Products</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {!result ? (
            <>
              <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 p-4 rounded-xl text-sm flex gap-3 border border-blue-100 dark:border-blue-500/20">
                <FileText className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-bold">Instructions</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 opacity-90 text-[13px]">
                    <li>Use CSV format only.</li>
                    <li>Required columns: name, sku, price.</li>
                    <li>Optional: stock, category, description, brand.</li>
                  </ul>
                  <button 
                    onClick={downloadTemplate}
                    className="mt-2 text-[#dc2626] font-bold hover:opacity-80 transition-opacity text-xs"
                  >
                    Download Template
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-3 text-[#dc2626] group-hover:scale-110 transition-transform shadow-sm">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-[#5a5a7a] mt-1.5">CSV files (max 5MB)</p>
                </div>
              </div>

              {/* CSV Preview */}
              {preview && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-xs font-bold text-gray-400 dark:text-[#5a5a7a] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <Eye className="w-3.5 h-3.5" /> Preview (first 5 rows)
                  </p>
                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.01]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50/80 dark:bg-white/[0.03]">
                          <tr>{preview.headers.map(h => <th key={h} className="px-3 py-2.5 text-left font-bold text-gray-600 dark:text-[#8888a8] whitespace-nowrap">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                          {preview.data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-100/50 dark:hover:bg-white/[0.02]">
                              {preview.headers.map(h => <td key={h} className="px-3 py-2 text-gray-600 dark:text-[#a8a8c8] whitespace-nowrap max-w-[120px] truncate">{row[h] || '—'}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className={`p-5 rounded-2xl border ${result.success ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20'}`}>
                <div className="flex items-center gap-3 mb-2">
                    {result.success ? (
                        <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                    <h4 className="font-bold text-gray-900 dark:text-white">
                        {result.message || 'Upload Complete'}
                    </h4>
                </div>
                {result.errors && result.errors.length > 0 && (
                    <div className="mt-3 max-h-40 overflow-y-auto text-[13px] text-red-600 dark:text-red-400 bg-white dark:bg-black/20 p-3 rounded-xl border border-red-100 dark:border-red-800/30">
                        {result.errors.map((err, idx) => (
                            <div key={idx} className="mb-1 flex gap-2"><span>•</span> {err}</div>
                        ))}
                    </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={uploading}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {!result && (
            <Button 
                onClick={handleUpload} 
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                disabled={!file || uploading}
                loading={uploading}
            >
                Upload Products
            </Button>
          )}
          {result && (
              <Button onClick={() => { setResult(null); setFile(null); }} variant="secondary">
                  Upload Another
              </Button>
          )}
        </div>
      </div>
    </div>
  );
}
