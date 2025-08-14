import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { validateFileSize, validateFileType } from '../../utils/validation';

interface ImageUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles: number;
  required?: boolean;
  label: string;
  description?: string;
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  files,
  onChange,
  maxFiles,
  required = false,
  label,
  description,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif']
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});
  const [loadingPreviews, setLoadingPreviews] = useState<{ [key: number]: boolean }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if file is HEIC/HEIF
  const isHeicFile = (file: File) => {
    return file.type.toLowerCase().includes('heic') || 
           file.type.toLowerCase().includes('heif') || 
           file.name.toLowerCase().endsWith('.heic') || 
           file.name.toLowerCase().endsWith('.heif');
  };

  // Generate placeholder for HEIC files
  const generateHeicPlaceholder = (fileName: string): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 200, 200);
      
      // Icon background
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(60, 60, 80, 80);
      
      // Upload icon (simplified)
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(90, 80, 20, 40);
      ctx.fillRect(80, 90, 40, 20);
      
      // Text
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('HEIC', 100, 160);
      ctx.font = '12px sans-serif';
      ctx.fillText('Image', 100, 175);
      
      // File name (truncated)
      const truncatedName = fileName.length > 15 ? fileName.substring(0, 12) + '...' : fileName;
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(truncatedName, 100, 190);
    }
    
    return canvas.toDataURL('image/png');
  };

  // Convert file to preview URL
  const convertToPreview = async (file: File, index: number): Promise<string> => {
    setLoadingPreviews(prev => ({ ...prev, [index]: true }));
    
    try {
      if (isHeicFile(file)) {
        // For HEIC files, use placeholder since browsers don't support HEIC natively
        // In production, you would use a library like heic2any here
        const placeholder = generateHeicPlaceholder(file.name);
        setLoadingPreviews(prev => ({ ...prev, [index]: false }));
        return placeholder;
      } else {
        // For regular images, create object URL
        const url = URL.createObjectURL(file);
        
        // Verify the image can be loaded
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setLoadingPreviews(prev => ({ ...prev, [index]: false }));
            resolve(url);
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            setLoadingPreviews(prev => ({ ...prev, [index]: false }));
            reject(new Error('Failed to load image'));
          };
          img.src = url;
        });
      }
    } catch (error) {
      setLoadingPreviews(prev => ({ ...prev, [index]: false }));
      throw error;
    }
  };

  // Generate previews for all files
  useEffect(() => {
    const generatePreviews = async () => {
      const newPreviewUrls: { [key: number]: string } = {};
      
      // Clean up old URLs
      Object.values(previewUrls).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const previewUrl = await convertToPreview(file, i);
          newPreviewUrls[i] = previewUrl;
        } catch (error) {
          console.error('Failed to generate preview for file:', file.name, error);
          // Generate error placeholder
          newPreviewUrls[i] = generateHeicPlaceholder(file.name);
        }
      }
      
      setPreviewUrls(newPreviewUrls);
    };

    if (files.length > 0) {
      generatePreviews();
    } else {
      // Clean up when no files
      Object.values(previewUrls).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      setPreviewUrls({});
      setLoadingPreviews({});
    }

    // Cleanup function
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [files]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    selectedFiles.forEach(file => {
      if (!validateFileType(file, acceptedFormats)) {
        newErrors.push(`${file.name}: Invalid file type. Please use JPG, PNG, or HEIC formats.`);
        return;
      }
      
      if (!validateFileSize(file, 5)) {
        newErrors.push(`${file.name}: File size must be less than 5MB.`);
        return;
      }
      
      validFiles.push(file);
    });

    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      newErrors.push(`You can only upload up to ${maxFiles} files.`);
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);
    if (newErrors.length === 0) {
      onChange([...files, ...validFiles]);
    }
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    // Clean up preview URL
    if (previewUrls[index] && previewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
    
    // Clear errors when files are removed
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${label.replace(/\s+/g, '-')}`}
        />
        <label
          htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
          className="cursor-pointer"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload images
            </span>
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG up to 5MB ({files.length}/{maxFiles} files)
          </p>
        </label>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {loadingPreviews[index] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                      <p className="text-xs text-gray-500">Loading...</p>
                    </div>
                  </div>
                ) : previewUrls[index] ? (
                  <img
                    src={previewUrls[index]}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => {
                      // Fallback if image fails to load
                      const newUrls = { ...previewUrls };
                      newUrls[index] = generateHeicPlaceholder(file.name);
                      setPreviewUrls(newUrls);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Preview Error</p>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="mt-1 text-xs text-gray-500 truncate" title={file.name}>
                {file.name}
              </p>
              {isHeicFile(file) && (
                <p className="text-xs text-blue-500 font-medium">HEIC</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Upload Error{errors.length > 1 ? 's' : ''}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={clearErrors}
                className="mt-2 text-sm text-red-800 underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;