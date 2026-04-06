import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "../../../../lib/supabase";
import { requireAdminApi } from "../../../../lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) {
      return auth.response;
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status required" }, { status: 400 });
    }

    const validStatuses = ["pending", "paid", "confirmed", "packing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
