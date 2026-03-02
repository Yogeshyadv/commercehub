import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Star, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUpload({ images = [], onChange, maxImages = 10 }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages = [];

    // Process sequentially to maintain order and prevent overwhelming
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'products');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Upload failed');
        }

        newImages.push({
          public_id: data.public_id,
          url: data.secure_url,
          alt: file.name.replace(/\.[^/.]+$/, ''),
        });

      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    if (newImages.length > 0) {
        onChange([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded`);
    }
  }, [images, maxImages, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const setPrimary = (index) => {
    if (index === 0) return;
    const newImages = [...images];
    const [primary] = newImages.splice(index, 1);
    newImages.unshift(primary);
    onChange(newImages);
    toast.success('Main image updated');
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            relative group cursor-pointer
            border-2 border-dashed rounded-xl p-8
            transition-all duration-200 ease-in-out
            flex flex-col items-center justify-center text-center
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform">
             {uploading ? (
                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
             ) : (
                 <Upload className="w-8 h-8 text-blue-500" />
             )}
          </div>
          {uploading ? (
             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Uploading...</p>
          ) : (
              <>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Drag & drop images here, or click to select
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (max. 5MB)
                </p>
              </>
          )}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, index) => (
            <div 
                key={img.public_id || index} 
                className={`
                    group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border
                    ${index === 0 ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200 dark:border-gray-700'}
                `}
            >
              <img
                src={img.url}
                alt={img.alt || 'Product image'}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                  </div>
                  
                  <div className="flex justify-center">
                    {index !== 0 && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPrimary(index); }}
                            className="px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm transition-colors flex items-center gap-1"
                        >
                            <Star className="w-3 h-3" />
                            Set Main
                        </button>
                    )}
                     {index === 0 && (
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full shadow-sm">
                            Main Image
                        </span>
                    )}
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
