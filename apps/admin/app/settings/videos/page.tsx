import { createAdminClient } from "@/lib/supabase";
import { VideoSlot } from "./video-slot";
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

export default async function VideoSettingsPage() {
  const settings = await getVideoSettings();

  return (
    <section>
      <AdminPageHeader
        kicker="Settings / Videos"
        title="Видео удирдлага"
        description="Нүүр хуудасны 5 стратегийн байршлын видеог удирдах хэсэг."
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
        {settings.map((s) => (
          <VideoSlot
            key={s.key}
            slotKey={s.key}
            label={s.label}
            description={s.description}
            initialUrl={s.value}
          />
        ))}

        {settings.length === 0 && (
          <div className="admin-panel" style={{ textAlign: "center", padding: "40px" }}>
            <p className="admin-muted">Видеоны тохиргоо олдсонгүй. Мэдээллийн санд `site_settings` хүснэгтийг зөв үүсгэсэн эсэхээ шалгана уу.</p>
          </div>
        )}
      </div>
    </section>
  );
}
