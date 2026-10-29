import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Video, MessageSquare } from "lucide-react";

const settingsCategories = [
  {
    id: "videos",
    label: "Видео удирдлага",
    desc: "Нүүр хуудасны 5 видеог солих, удирдах",
    icon: Video,
    href: "/settings/videos",
    status: "Ready",
  },
  {
    id: "chatbot",
    label: "Messenger болон AI",
    desc: "Facebook холболт, хиймэл оюуны тохиргоо",
    icon: MessageSquare,
    href: "/chatbot",
    status: "Ready",
  },
];

export default function SettingsHubPage() {
  return (
    <section>
      <AdminPageHeader
        kicker="Тохиргоо"
        title="Системийн тохиргоо"
      />

      <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {settingsCategories.map((cat) => (
          <Link href={cat.href} key={cat.id} style={{ textDecoration: "none" }}>
            <article className="admin-panel interactive-card" style={{ height: "100%", cursor: "pointer" }}>
              <div className="settings-card">
                <div className={`settings-icon ${cat.status === "Ready" ? "ready" : "soon"}`}>
                  <cat.icon size={24} />
                </div>
                <div className="settings-content">
                  <div className="settings-header">
                    <h2>{cat.label}</h2>
                  </div>
                  <p className="settings-desc">{cat.desc}</p>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
