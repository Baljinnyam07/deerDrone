"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../lib/supabase";

export async function updateMessengerConfig(data: {
  is_enabled: boolean;
  page_access_token: string;
  verify_token: string;
  page_id: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("messenger_config")
    .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });

  if (error) {
    console.error("updateMessengerConfig error:", error);
    throw new Error("Алдаа гарлаа: " + error.message);
  }

  revalidatePath("/chatbot");
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("updateLeadStatus error:", error);
    throw new Error("Алдаа гарлаа: " + error.message);
  }

  revalidatePath("/chatbot");
}

export async function deleteLead(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    console.error("deleteLead error:", error);
    throw new Error("Алдаа гарлаа: " + error.message);
  }

  revalidatePath("/chatbot");
}

export async function updateLeadNotes(id: string, notes: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("leads")
    .update({ notes } as any)
    .eq("id", id);

  if (error) {
    console.error("updateLeadNotes error:", error);
    throw new Error("Алдаа гарлаа: " + error.message);
  }

  revalidatePath("/chatbot");
}

export async function getConversationHistory(senderId: string) {
  if (!senderId) return [];
  const supabase = createAdminClient();
  const { data: config } = await supabase.from("messenger_config").select("*").limit(1).single();
  
  if (!config || !config.page_access_token || !config.page_id) {
    return [];
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${config.page_id}/conversations?user_id=${senderId}&fields=messages{message,from,created_time}&access_token=${config.page_access_token}`;
    const res = await fetch(url);
    const json = await res.json();
    
    if (json.data && json.data.length > 0 && json.data[0].messages) {
      // FB returns messages in paginated format. We take the latest 20.
      return json.data[0].messages.data.slice(0, 20).reverse();
    }
    return [];
  } catch (err) {
    console.error("getConversationHistory err:", err);
    return [];
  }
}

export async function sendMessengerReply(senderId: string, text: string) {
  if (!senderId) throw new Error("Хэрэглэгчийн ID байхгүй тул хариулах боломжгүй.");
  const supabase = createAdminClient();
  const { data: config } = await supabase.from("messenger_config").select("*").limit(1).single();
  
  if (!config || !config.page_access_token) {
    throw new Error("Messenger тохиргоо бүрэн бус байна.");
  }

  const url = `https://graph.facebook.com/v20.0/me/messages?access_token=${config.page_access_token}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: senderId },
      message: { text }
    })
  });
  
  if (!res.ok) {
     const err = await res.json();
     throw new Error(err.error?.message || "Илгээхэд алдаа гарлаа.");
  }
  
  return true;
}
