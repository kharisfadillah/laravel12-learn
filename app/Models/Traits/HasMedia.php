<?php

namespace App\Models\Traits;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HasMedia
{
    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }

    public function mediaCollection($collection)
    {
        return $this->media()->where('collection', $collection);
    }

    public function addMedia(UploadedFile $file, $collection = 'default')
    {
        $disk = 'public';
        $storedName = $file->store("uploads/{$collection}", $disk);

        return $this->media()->create([
            'collection' => $collection,
            'name' => $file->getClientOriginalName(),
            'file_name' => $storedName,
            'mime_type' => $file->getClientMimeType(),
            'disk' => $disk,
            'size' => $file->getSize(),
            'url' => Storage::disk($disk)->url($storedName),
        ]);
    }

    public function addMultipleMedia(array $files, $collection = 'default')
    {
        $saved = [];
        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $saved[] = $this->addMedia($file, $collection);
            }
        }
        return $saved;
    }

    public function deleteMedia($mediaId)
    {
        $media = $this->media()->findOrFail($mediaId);

        Storage::disk($media->disk)->delete($media->file_name);

        return $media->delete();
    }
}
