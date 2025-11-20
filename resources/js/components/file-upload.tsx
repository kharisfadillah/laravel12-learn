import { File as FileIcon, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
    value?: File[];
    onChange: (files: File[]) => void;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    maxSize?: number;
    error?: string;
}

export default function FileUpload({
    value = [],
    onChange,
    accept = { 'image/*': [], 'application/pdf': [] },
    maxFiles = 10,
    maxSize = 5 * 1024 * 1024, // 5MB
    error,
}: FileUploadProps) {
    const [previews, setPreviews] = useState<string[]>([]);

    /** Generate object URLs for preview */
    useEffect(() => {
        const urls = value.map((file) => URL.createObjectURL(file));
        setPreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [value]);

    /** Handle drop files */
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (value.length + acceptedFiles.length > maxFiles) {
                return;
            }

            const validFiles = acceptedFiles.filter((f) => f.size <= maxSize);
            onChange([...value, ...validFiles]);
        },
        [value, maxFiles, maxSize, onChange],
    );

    /** Dropzone config */
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple: true,
    });

    /** Remove file */
    const removeFile = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index);
        onChange(newFiles);
    };

    const isImage = (file: File) => file.type.startsWith('image/');

    return (
        <div className="space-y-2">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${isDragActive ? 'border-black bg-gray-100' : 'bg-white'}`}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-2 h-6 w-6" />
                {isDragActive ? (
                    <p className="text-sm font-medium">Drop files here...</p>
                ) : (
                    <p className="text-sm text-gray-600">Drag & drop or click to browse</p>
                )}
            </div>

            {/* Error text */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* File list */}
            <div className="space-y-2">
                {value.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                        <div className="flex items-center space-x-3">
                            {/* Image preview */}
                            {isImage(file) ? (
                                <img src={previews[index]} alt={file.name} className="h-12 w-12 rounded object-cover" />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200">
                                    <FileIcon className="h-6 w-6 text-gray-600" />
                                </div>
                            )}

                            {/* File info */}
                            <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>

                        {/* Remove */}
                        <button type="button" onClick={() => removeFile(index)} className="rounded p-1 hover:bg-gray-100">
                            <X className="h-5 w-5 text-red-500" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Max files info */}
            {value.length >= maxFiles && <p className="text-xs text-gray-500">You have reached the maximum of {maxFiles} files.</p>}
        </div>
    );
}

// import React from "react"
// import { useDropzone } from "react-dropzone"
// import { X, Upload, File as FileIcon } from "lucide-react"

// interface FileUploadProps {
//     value: File[]
//     onChange: (files: File[]) => void
//     accept?: Record<string, string[]>
//     maxFiles?: number
//     maxSize?: number
//     error?: string
// }

// export default function FileUpload({
//     value = [],
//     onChange,
//     accept = { "image/*": [], "application/pdf": [] },
//     maxFiles = 10,
//     maxSize = 5 * 1024 * 1024, // 5MB
//     error,
// }: FileUploadProps) {

//     const onDrop = (acceptedFiles: File[]) => {
//         // Cek jumlah maksimal
//         if (value.length + acceptedFiles.length > maxFiles) return;

//         // Cek ukuran file
//         const validFiles = acceptedFiles.filter(f => f.size <= maxSize);

//         onChange([...value, ...validFiles]);
//     };

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept,
//         multiple: true,
//     });

//     const removeFile = (index: number) => {
//         const newFiles = value.filter((_, i) => i !== index);
//         onChange(newFiles);
//     };

//     const isImage = (file: File) => file.type.startsWith("image/");

//     return (
//         <div className="space-y-2">
//             {/* Dropzone */}
//             <div
//                 {...getRootProps()}
//                 className={`border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition
//                     ${isDragActive ? "bg-gray-100 border-black" : "bg-white"}`}
//             >
//                 <input {...getInputProps()} />
//                 <Upload className="w-6 h-6 mx-auto mb-2" />
//                 {isDragActive ? (
//                     <p className="text-sm font-medium">Drop files here...</p>
//                 ) : (
//                     <p className="text-sm text-gray-600">
//                         Drag & drop or click to browse
//                     </p>
//                 )}
//             </div>

//             {/* Error */}
//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             {/* File List */}
//             <div className="space-y-2">
//                 {value.map((file, index) => (
//                     <div
//                         key={index}
//                         className="flex items-center justify-between border rounded-lg p-3 bg-gray-50"
//                     >
//                         <div className="flex items-center space-x-3">
//                             {/* Thumbnail */}
//                             {isImage(file) ? (
//                                 <img
//                                     src={URL.createObjectURL(file)}
//                                     alt={file.name}
//                                     className="w-12 h-12 rounded object-cover"
//                                 />
//                             ) : (
//                                 <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
//                                     <FileIcon className="w-6 h-6 text-gray-600" />
//                                 </div>
//                             )}

//                             {/* File Info */}
//                             <div>
//                                 <p className="text-sm font-medium">{file.name}</p>
//                                 <p className="text-xs text-gray-500">
//                                     {(file.size / 1024).toFixed(2)} KB
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Remove Button */}
//                         <button
//                             type="button"
//                             onClick={() => removeFile(index)}
//                             className="p-1 hover:bg-gray-100 rounded"
//                         >
//                             <X className="w-5 h-5 text-red-500" />
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {/* Max Files Warning */}
//             {value.length >= maxFiles && (
//                 <p className="text-xs text-gray-500">
//                     You have reached the maximum of {maxFiles} files.
//                 </p>
//             )}
//         </div>
//     );
// }
