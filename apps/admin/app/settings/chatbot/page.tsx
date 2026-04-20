import { AdminPageHeader } from "@/components/admin-page-header";
import { createAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

type ChatbotSettings = {
  page_id?: string;
  page_access_token?: string;
  verify_token?: string;
  system_prompt?: string;
  is_enabled?: boolean;
};

export default async function ChatbotSettingsPage() {
  const supabase = createAdminClient();

  // Try to fetch existing
  // We'll store system_prompt in system_settings and Messenger in messenger_config
  const { data: mc } = await supabase.from("messenger_config").select("*").eq("id", 1).single();
  const { data: ss } = await supabase.from("system_settings").select("*").eq("setting_key", "system_prompt").single();

  const settings: ChatbotSettings = {
    page_id: mc?.page_id || "",
    page_access_token: mc?.page_access_token || "",
    verify_token: mc?.verify_token || "",
    is_enabled: mc?.is_enabled ?? true,
    system_prompt: ss?.setting_value || "",
  };

  async function saveSettings(formData: FormData) {
    "use server";
    const sub = createAdminClient();

    const page_id = formData.get("page_id") as string;
    const page_access_token = formData.get("page_access_token") as string;
    const verify_token = formData.get("verify_token") as string;
    const system_prompt = formData.get("system_prompt") as string;
    const is_enabled = formData.get("is_enabled") === "on";

    // Upsert Messenger Config
    await sub.from("messenger_config").upsert({
      id: 1, 
      page_id,
      page_access_token,
      verify_token,
      is_enabled,
      updated_at: new Date().toISOString()
    });

    // Upsert System Prompt
    await sub.from("system_settings").upsert({
      setting_key: "system_prompt",
      setting_value: system_prompt,
      updated_at: new Date().toISOString()
    }, { onConflict: 'setting_key' });

    revalidatePath("/settings/chatbot");
  }

  return (
    <section>
      <AdminPageHeader
        kicker="Settings / Chatbot & AI"
        title="Messenger болон AI тохиргоо"
        description="Facebook хуудасны холболт болон Хиймэл Оюуны системийн зааварчилгааг удирдах."
      />

      <form action={saveSettings} className="admin-panel mt-6" style={{ maxWidth: 800 }}>
        
        <div style={{ padding: "0 0 1.5rem 0", borderBottom: "1px solid var(--admin-border-subtle)", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>Facebook Messenger Тохиргоо</h2>
          
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--admin-text-secondary)" }}>
                Идэвхтэй эсэх (Chatbot ажиллах)
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input 
                  type="checkbox" 
                  name="is_enabled" 
                  defaultChecked={settings.is_enabled}
                  style={{ width: "20px", height: "20px" }}
                />
                <span style={{ color: "var(--admin-text)" }}>Тийм</span>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--admin-text-secondary)" }}>
                Facebook Page ID
              </label>
              <input
                name="page_id"
                defaultValue={settings.page_id}
                placeholder="Жишээ нь: 1234567890"
                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--admin-border)", background: "transparent", color: "var(--admin-text)" }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--admin-text-secondary)" }}>
                Page Access Token
              </label>
              <input
                name="page_access_token"
                defaultValue={settings.page_access_token}
                placeholder="EAAGm0PZ..."
                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--admin-border)", background: "transparent", color: "var(--admin-text)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--admin-text-secondary)" }}>
                Webhook Verify Token
              </label>
              <input
                name="verify_token"
                defaultValue={settings.verify_token}
                placeholder="my_super_secret_token"
                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--admin-border)", background: "transparent", color: "var(--admin-text)" }}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>AI Тохиргоо (System Prompt)</h2>
          
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--admin-text-secondary)" }}>
              AI Assistant удирдамж (System Prompt)
            </label>
            <p className="admin-muted" style={{ marginBottom: "0.5rem" }}>
              Энэхүү бичвэр нь AI-г хэрхэн хэрэглэгчтэй харилцах, ямар өнгө аясаар ярихыг зааж өгөх үндсэн удирдамж юм.
            </p>
            <textarea
              name="system_prompt"
              defaultValue={settings.system_prompt}
              rows={12}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--admin-border)", background: "transparent", color: "var(--admin-text)", fontFamily: "monospace", resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--admin-border-subtle)", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="admin-primary-btn">
            Хадгалах
          </button>
        </div>
      </form>
    </section>
  );
}
