import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_PHOTOS = 3;

interface PhotoStepProps {
  photos: File[];
  onChangePhotos: (photos: File[]) => void;
}

export function PhotoStep({ photos, onChangePhotos }: PhotoStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = photos.map((photo) => URL.createObjectURL(photo));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  function handleCapture(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onChangePhotos([...photos, file].slice(0, MAX_PHOTOS));
    }
    event.target.value = "";
  }

  function handleRemove(index: number) {
    onChangePhotos(photos.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3 px-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCapture}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={photos.length >= MAX_PHOTOS}
      >
        <Camera className="h-4 w-4" />
        Adicionar foto
      </Button>

      {previewUrls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border">
              <img src={url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label="Remover foto"
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Apenas fotos tiradas na hora. Opcional, até {MAX_PHOTOS} fotos.
      </p>
    </div>
  );
}
