const IMAGES = [
  { src: "https://images.unsplash.com/photo-1508898578281-774ac4893bd0", alt: "Camera install" },
  { src: "https://images.unsplash.com/photo-1521133573892-e44906baee46", alt: "Smart lights" },
  { src: "https://images.unsplash.com/photo-1489769002049-ccd828976a6c", alt: "Networking" },
  { src: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0", alt: "Cables" },
];

export default function GalleryGrid() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {IMAGES.map((img) => (
        <img key={img.src} src={img.src} alt={img.alt} className="rounded-xl border border-neutral-200" />
      ))}
    </div>
  );
}
