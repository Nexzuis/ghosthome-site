import Hero from "../components/Hero.jsx";
import FeatureStripHome from "../components/FeatureStripHome.jsx";
import PackageCards from "../components/PackageCards.jsx";

export default function Home() {
  return (
    <div>
      <Hero />
      {/* Detections + integrations right below the hero, above the fold */}
      <FeatureStripHome />

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-3">Popular Packages</h2>
        <PackageCards />
      </div>
    </div>
  );
}
