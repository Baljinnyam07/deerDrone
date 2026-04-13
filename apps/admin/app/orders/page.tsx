import { createAdminClient } from "../../lib/supabase";
import { OrdersClient } from "./orders-client";
import { AdminPageHeader } from "@/components/admin-page-header";

async function getOrders() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Orders fetch error:", error);
    return [];
  }
  return data || [];
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <section>
      <AdminPageHeader
        kicker="Orders / Захиалга"
        title="Захиалгын удирдлага"
        description="Бүх захиалгыг харах, төлөв шинэчлэх, дэлгэрэнгүй мэдээлэл хянах."
      />

      <OrdersClient initialOrders={orders} />
    </section>
  );
}
