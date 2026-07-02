import { useState } from "react";

export default function PhotoGallery({ photos, getPhotoUrl, onDelete }) {
  const [preview, setPreview] = useState(null);

  if (photos.length === 0) {
    return <div className="empty-photos"><p>Aucune photo — utilise le bouton ci-dessus pour en ajouter</p></div>;
  }

  return (
    <>
      <div className="photo-grid">
        {photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <img
              src={getPhotoUrl(photo)}
              alt={photo.legende || "Photo"}
              className="photo-thumb"
              onClick={() => setPreview(photo)}
              loading="lazy"
            />
            <div className="photo-overlay">
              <span className="photo-date">{new Date(photo.created).toLocaleDateString("fr-FR")}</span>
              <button className="photo-delete" onClick={() => onDelete(photo.id)}>×</button>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div className="photo-modal" onClick={() => setPreview(null)}>
          <div className="photo-modal-inner" onClick={e => e.stopPropagation()}>
            <img src={getPhotoUrl(preview)} alt={preview.legende} className="photo-full" />
            {preview.legende && <p className="photo-legende">{preview.legende}</p>}
            <p className="photo-modal-date">{new Date(preview.created).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
            <button className="modal-close" onClick={() => setPreview(null)}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}
