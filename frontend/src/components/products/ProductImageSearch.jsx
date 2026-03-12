import { useState, useRef, useEffect } from 'react';
import { Search, X, Download, Loader2, Upload, Camera } from 'lucide-react';
import { aiService } from '../../services/aiService';

export default function ProductImageSearch({ onSelectImage, maxResults = 20 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isReverseSearch, setIsReverseSearch] = useState(false);
  const [uploading, setUploading] = useState(false);
  const searchInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    // Handle different event structures
    const files = event.target.files || event.dataTransfer?.files;
    if (!files || files.length === 0) {
      console.error('No files found in event');
      return;
    }
    
    const file = files[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        try {
          setLoading(true);
          const response = await aiService.searchByImage({
            image: base64,
            limit: maxResults
          });
          setResults(response.similarProducts || []);
          setIsReverseSearch(true);
          setUploadedImage(base64);
        } catch (error) {
          console.error('Reverse image search failed:', error);
          setResults([]);
        } finally {
          setLoading(false);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const searchByText = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setIsReverseSearch(false);
      return;
    }

    try {
      setLoading(true);
      const response = await aiService.searchProductImages({
        query: query.trim(),
        limit: maxResults,
        safe_search: true
      });
      
      setResults(response.images || []);
      setIsReverseSearch(false);
    } catch (error) {
      console.error('Text search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    onSelectImage(image);
  };

  const handleDownload = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setSelectedImage(null);
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchByText(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex gap-3 mb-3">
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setIsReverseSearch(false)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                !isReverseSearch 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Text Search
            </button>
            <button
              onClick={() => setIsReverseSearch(true)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isReverseSearch 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Camera className="w-4 h-4 mr-2" />
              Image Search
            </button>
          </div>
        </div>

        {!isReverseSearch ? (
          <form onSubmit={(e) => { e.preventDefault(); searchByText(searchQuery); }} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for product images..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!searchQuery.trim() || loading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white file:mr-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {uploadedImage && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded image" 
                    className="w-8 h-8 rounded border-2 border-gray-300 object-cover"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => {
                if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
                  handleImageUpload({ target: { files: fileInputRef.current.files } });
                }
              }}
              disabled={uploading}
              className="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {uploadedImage ? 'Search Similar' : 'Upload & Search'}
                </>
              )}
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {results.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImageSelect(image)}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage?.url === image.url
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.thumbnail || image.url}
                      alt={image.description || `Product image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  
                    <div className="absolute inset-0 bg-black/0 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image.url, image.description || `product-image-${index}`);
                          }}
                          className="p-2 bg-white/90 hover:bg-white rounded-full text-gray-800 hover:text-gray-900 transition-all"
                          title="Download image"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageSelect(image);
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all"
                          title="Select this image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17h10" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-xs truncate">
                        {isReverseSearch 
                          ? `Similar products found for uploaded image` 
                          : image.description || `Product image ${index + 1}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && searchQuery && results.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No images found</p>
              <p className="text-sm">Try different keywords or check your spelling</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Searching for images...</p>
          </div>
        )}

        {!loading && !searchQuery && results.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                {isReverseSearch ? 'Search for product images' : 'Search for product images'}
              </p>
              <p className="text-sm">
                {isReverseSearch 
                  ? 'Enter keywords to find relevant product photos' 
                  : 'Enter keywords or upload an image to find similar products'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
