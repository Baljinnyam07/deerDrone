import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { createClient } from "../../../../lib/supabase/server";

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        product_name,
        quantity,
        line_total
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <p className="text-uppercase text-secondary small fw-bold mb-2">Account</p>
            <h1 className="fw-bold mb-0">Захиалгын түүх</h1>
          </div>
          <Link href="/account" className="btn btn-outline-primary rounded-pill px-4">
            Профайл руу буцах
          </Link>
        </div>

        {!orders?.length ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
            <div
              className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ height: "72px", width: "72px" }}
            >
              <Package className="text-secondary" size={28} />
            </div>
            <h4 className="fw-bold mb-2">Захиалга хараахан байхгүй байна</h4>
            <p className="text-secondary mb-4">
              Худалдан авалт хийсний дараа таны захиалгын төлөв энд харагдана.
            </p>
            <div>
              <Link href="/products" className="btn btn-primary rounded-pill px-4">
                Дэлгүүр үзэх
              </Link>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => (
              <article key={order.id} className="card border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                      <strong>{order.order_number}</strong>
                      <span className="badge bg-light text-dark border">
                        {new Date(order.created_at).toLocaleDateString("mn-MN")}
                      </span>
                      <span className="badge bg-primary-subtle text-primary text-uppercase">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-secondary mb-0">
                      Төлбөр: {order.payment_method === "qpay" ? "QPay" : "Дансаар"} ·
                      Хүргэлт: {order.shipping_method === "ub" ? "Улаанбаатар" : "Орон нутаг"}
                    </p>
                  </div>
                  <div className="text-lg-end">
                    <div className="text-secondary small">Нийт дүн</div>
                    <div className="fw-bold fs-4 text-primary">
                      {new Intl.NumberFormat("mn-MN", {
                        currency: "MNT",
                        style: "currency",
                      }).format(order.total)}
                    </div>
                  </div>
                </div>

                {order.items?.length ? (
                  <div className="border-top pt-3 d-flex flex-column gap-2">
                    {order.items.map((item: any, index: number) => (
                      <div
                        key={`${order.id}-${index}`}
                        className="d-flex justify-content-between align-items-center gap-3"
                      >
                        <div>
                          <strong>{item.product_name}</strong>
                          <div className="text-secondary small">{item.quantity} ширхэг</div>
                        </div>
                        <div className="fw-medium">
                          {new Intl.NumberFormat("mn-MN", {
                            currency: "MNT",
                            style: "currency",
                          }).format(item.line_total)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
