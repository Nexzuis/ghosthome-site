import GalleryGrid from "../components/GalleryGrid.jsx";

export default function Gallery() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Gallery</h1>
      <p className="text-white/70 mt-2">A few recent installs and kit shots. More coming soon.</p>
      <div className="mt-4">
        <GalleryGrid />
      </div>
    </div>
  );
}