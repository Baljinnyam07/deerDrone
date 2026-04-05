const brandLabels: Record<string, string> = {
  DJI: "DJI",
  Autel: "AUTEL",
  Skydio: "SKYDIO",
};

function toBrandClass(brand: string): string {
  return brand.toLowerCase().replace(/\s+/g, "-");
}

export function BrandBadge({
  brand,
  variant = "overlay",
}: {
  brand: string;
  variant?: "overlay" | "inline" | "detail";
}) {
  const label = brandLabels[brand] ?? brand;

  return (
    <span className={`brand-badge brand-badge-${variant} brand-badge-${toBrandClass(brand)}`}>{label}</span>
  );
}
