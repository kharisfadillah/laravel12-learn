import { useState } from 'react';
// import { Link } from "@/components/ui/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Media } from '@/types';
import { ExternalLink, File } from 'lucide-react';

interface Props {
    attachments: Media[];
}

export function AttachmentList({ attachments }: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewName, setPreviewName] = useState<string>('');

    const openPreview = (att: Media) => {
        setPreviewUrl(att.url_public);
        setPreviewName(att.name ?? 'Preview');
    };

    const isPreviewable = (mime: string | null) => {
        if (!mime) return false;
        return mime.startsWith('image/') || mime === 'application/pdf';
    };

    return (
        <>
            <ul className="list-disc space-y-1">
                {attachments.map((att, i) => (
                    <li key={att.id} className="flex items-center gap-2">
                        {/* Ikon File */}
                        <File className="h-4 w-4 text-gray-600" />

                        {/* Link */}
                        {/* <Link
                            href={att.url_public ?? ''}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                            {att.name ?? `Lampiran ${i + 1}`}
                        </Link> */}

                        <a
                            href={att.url_public}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                            {att.name ?? `Lampiran ${i + 1}`}
                        </a>

                        {/* Icon External Link */}
                        <a href={att.url_public ?? ''}>
                            <ExternalLink className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </a>

                        {/* Tombol Preview */}
                        {isPreviewable(att.mime_type) && (
                            <button onClick={() => openPreview(att)} className="ml-2 text-xs text-green-600 hover:underline">
                                Preview
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {/* Modal Preview */}
            <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
                <DialogContent className="sm:max-h-[90vh] sm:max-w-[90vw] overflow-hidden p-0">
                    <DialogHeader className="p-4 pb-2">
                        <DialogTitle>{previewName}</DialogTitle>
                    </DialogHeader>

                    {previewUrl && (
                        <div className="flex h-[80vh] w-full justify-center overflow-auto bg-gray-50 p-4">
                            {previewUrl.endsWith('.pdf') ? (
                                <iframe src={previewUrl} className="h-full w-full rounded"></iframe>
                            ) : (
                                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full rounded object-contain" />
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
