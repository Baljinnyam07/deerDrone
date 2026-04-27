import { createAdminClient } from "../../lib/supabase";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ChatbotDashboardClient } from "./ChatbotDashboardClient";

async function getLeads() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100); // Fetch more for better metrics
  return data || [];
}

async function getMessengerConfig() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("messenger_config")
    .select("*")
    .limit(1)
    .single();
  return data || { id: 1, is_enabled: true };
}

export default async function ChatbotPage() {
  const leads = await getLeads();
  const messengerConfig = await getMessengerConfig();

  return (
    <section>
      <AdminPageHeader
        kicker="Chatbot CRM"
        title="Chatbot & Lead Command Center"
        description="Monitor incoming leads, manage AI intent conversions, and configure bot settings."
      />

      <div style={{ marginTop: "2rem" }}>
        <ChatbotDashboardClient leads={leads} messengerConfig={messengerConfig} />
      </div>
    </section>
  );
}
