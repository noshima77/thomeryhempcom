import { useState } from "react";

export default function PhotoGallery({ photos, getPhotoUrl, onDelete }) {
  const [preview, setPreview] = useState(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 text-sm">
        <p>Aucune photo — utilise le bouton ci-dessus pour en ajouter</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map(photo => (
          <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
            <img
              src={getPhotoUrl(photo)}
              alt={photo.legende || "Photo"}
              className="w-full h-full object-cover cursor-pointer block"
              onClick={() => setPreview(photo)}
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-1.5 py-1.5 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[0.65rem] text-white">{new Date(photo.created).toLocaleDateString("fr-FR")}</span>
              <button className="text-white text-lg leading-none" onClick={() => onDelete(photo.id)}>×</button>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[1000] p-5" onClick={() => setPreview(null)}>
          <div className="bg-neutral-0 rounded-2xl max-w-[500px] w-full p-4" onClick={e => e.stopPropagation()}>
            <img src={getPhotoUrl(preview)} alt={preview.legende} className="w-full rounded-lg mb-2.5" />
            {preview.legende && <p className="font-semibold mb-1">{preview.legende}</p>}
            <p className="text-xs text-neutral-500 mb-3">
              {new Date(preview.created).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <button
              className="w-full min-h-touch px-4 rounded-lg font-medium text-sm bg-neutral-100 hover:bg-neutral-200 transition-colors"
              onClick={() => setPreview(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}