import { cn } from "@/lib/utils";

const TILE_SIZE = 128;
const TILE_ZOOM = 17;
const THUMBNAIL_WIDTH = 96;
const THUMBNAIL_HEIGHT = 72;
const TILE_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile";

interface VisibleTile {
  x: number;
  y: number;
  left: number;
  top: number;
}

function projectToPixels(lat: number, lng: number) {
  const worldSize = TILE_SIZE * 2 ** TILE_ZOOM;
  const latRadians = (lat * Math.PI) / 180;
  return {
    x: ((lng + 180) / 360) * worldSize,
    y: ((1 - Math.asinh(Math.tan(latRadians)) / Math.PI) / 2) * worldSize,
  };
}

function getVisibleTiles(lat: number, lng: number): VisibleTile[] {
  const center = projectToPixels(lat, lng);
  const originX = center.x - THUMBNAIL_WIDTH / 2;
  const originY = center.y - THUMBNAIL_HEIGHT / 2;
  const tiles: VisibleTile[] = [];

  for (let x = Math.floor(originX / TILE_SIZE); x * TILE_SIZE < originX + THUMBNAIL_WIDTH; x += 1) {
    for (let y = Math.floor(originY / TILE_SIZE); y * TILE_SIZE < originY + THUMBNAIL_HEIGHT; y += 1) {
      tiles.push({ x, y, left: x * TILE_SIZE - originX, top: y * TILE_SIZE - originY });
    }
  }
  return tiles;
}

interface CameraMapThumbnailProps {
  lat: number;
  lng: number;
  active: boolean;
  dimmed: boolean;
}

export function CameraMapThumbnail({ lat, lng, active, dimmed }: CameraMapThumbnailProps) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl bg-muted"
      style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}
      aria-hidden="true"
    >
      <div className={cn("absolute inset-0", dimmed && "opacity-50 grayscale")}>
        {getVisibleTiles(lat, lng).map((tile) => (
          <img
            key={`${tile.x}-${tile.y}`}
            src={`${TILE_URL}/${TILE_ZOOM}/${tile.y}/${tile.x}`}
            alt=""
            loading="lazy"
            draggable={false}
            className="absolute max-w-none"
            style={{ left: tile.left, top: tile.top, width: TILE_SIZE, height: TILE_SIZE }}
          />
        ))}
      </div>
      <span
        className={cn(
          "absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
          active ? "bg-live-indicator motion-safe:animate-pulse" : "bg-primary",
          dimmed && "bg-muted-foreground",
        )}
      />
    </div>
  );
}
