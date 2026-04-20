import { createAdminClient } from "@/lib/supabase";
import { VideoSlot } from "./video-slot";
import { HeroProductSelector } from "./hero-product-selector";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ChevronLeft, Info } from "lucide-react";

async function getVideoSettings() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .filter("key", "like", "home_%")
    .order("key", { ascending: true });

  return data || [];
}

async function getProductsForSettings() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("products").select("id, name, slug").order("created_at", { ascending: false });
  return data || [];
}

export default async function VideoSettingsPage() {
  const settings = await getVideoSettings();
  const productOptions = await getProductsForSettings();
  const heroProductSlug = settings.find(s => s.key === "home_hero_product_slug")?.value || null;
  const videoSettings = settings.filter(s => s.key !== "home_hero_product_slug");

  return (
    <section>
      <AdminPageHeader
        kicker="Settings / Videos & Hero"
        title="Нүүр хуудасны удирдлага"
        description="Нүүр хуудасны дээр байрлах видео болон онцлох барааг удирдах хэсэг."
      />

      <div className="alert alert-info">
        <Info size={20} className="alert-icon" />
        <div>
          <p>Зөвлөмж:</p>
          <ul>
            <li>Видео бүрийг <b>50MB-аас ихгүй</b> байлгахыг зөвлөж байна.</li>
            <li>Зөвхөн <b>.mp4</b> формат дэмжигдэнэ.</li>
            <li>Хэрэв видео оруулахгүй (устгавал) бол систем автоматаар DJI-ийн видеог (fallback) харуулна.</li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <HeroProductSelector initialSlug={heroProductSlug} products={productOptions} />

        {videoSettings.map((s) => (
          <VideoSlot
            key={s.key}
            slotKey={s.key}
            label={s.label}
            description={s.description}
            initialUrl={s.value}
          />
        ))}

        {videoSettings.length === 0 && (
          <div className="admin-panel" style={{ textAlign: "center", padding: "40px" }}>
            <p className="admin-muted">Видеоны тохиргоо олдсонгүй. Мэдээллийн санд `site_settings` хүснэгтийг зөв үүсгэсэн эсэхээ шалгана уу.</p>
          </div>
        )}
      </div>
    </section>
  );
}
