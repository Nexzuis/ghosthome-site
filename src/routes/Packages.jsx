import PackageCards from "../components/PackageCards.jsx";

export default function Packages() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Packages</h1>
      <p className="text-white/70 mt-2">Transparent pricing. Final quote after quick site check.</p>
      <PackageCards />
    </div>
  );
}