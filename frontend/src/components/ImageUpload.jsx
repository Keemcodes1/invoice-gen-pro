import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ label, onImageChange, currentImage }) => {
    const fileInputRef = useRef(null);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        e.stopPropagation();
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange(file, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onImageChange(null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm text-slate-400 mb-1">{label}</label>
            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all
                    ${currentImage ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800/50'}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {currentImage ? (
                    <div className="relative flex justify-center items-center h-32">
                        <img src={currentImage} alt="Preview" className="max-h-full max-w-full object-contain rounded" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={handleClick}
                        className="flex flex-col items-center justify-center h-24 text-slate-400"
                    >
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs">Click to upload</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
