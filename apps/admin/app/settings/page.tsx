import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Video, Settings as SettingsIcon, Globe, Bell, Shield, MessageSquare } from "lucide-react";

const settingsCategories = [
  {
    id: "general",
    label: "Ерөнхий тохиргоо",
    desc: "Вэбсайтын нэр, лого, холбоо барих мэдээлэл",
    icon: Globe,
    href: "/settings/general",
    status: "Soon",
  },
  {
    id: "videos",
    label: "Видео удирдлага",
    desc: "Нүүр хуудасны 5 видеог солих, удирдах",
    icon: Video,
    href: "/settings/videos",
    status: "Ready",
  },
  {
    id: "notifications",
    label: "Мэдэгдэл",
    desc: "Шинэ захиалга, lead-ийн мэдэгдэл тохируулах",
    icon: Bell,
    href: "/settings/notifications",
    status: "Soon",
  },
  {
    id: "security",
    label: "Аюулгүй байдал",
    desc: "Админ нууц үг, хандалтын удирдлага",
    icon: Shield,
    href: "/settings/security",
    status: "Soon",
  },
  {
    id: "chatbot",
    label: "Messenger болон AI",
    desc: "Facebook холболт, хиймэл оюуны тохиргоо",
    icon: MessageSquare,
    href: "/settings/chatbot",
    status: "Ready",
  },
];

export default function SettingsHubPage() {
  return (
    <section>
      <AdminPageHeader
        kicker="Settings"
        title="Системийн тохиргоо"
        description="Вэбсайт болон админ самбарын ерөнхий тохиргоонууд."
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
                    <span className={`settings-badge ${cat.status === "Ready" ? "ready" : "soon"}`}>
                      {cat.status === "Ready" ? "IDEAL" : "SOON"}
                    </span>
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
