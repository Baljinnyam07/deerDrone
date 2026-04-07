import Link from "next/link";
import { redirect } from "next/navigation";
import { User, Package, Settings, LogOut, ChevronRight, TrendingUp, ShoppingBag, MapPin, Calendar, Clock, CreditCard, CheckCircle, Truck, ArrowRight } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import { logout } from "../actions";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const name = user.user_metadata?.full_name || user.user_metadata?.name || "Хэрэглэгч";
  const email = user.email;

  // Fetch real order history
  const { data: rawOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = rawOrders || [];

  // Calculate stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("mn-MN", {
      style: "currency",
      currency: "MNT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container py-4">
        {/* Header */}
        <div className="mb-5">
          <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}>
            Миний бүртгэл
          </h1>
          <p className="text-secondary fs-5 mb-0">
            Захиалга, мэдээлэл, тохиргоогоо удирдана уу
          </p>
        </div>

        <div className="row g-5">
          {/* Left Sidebar */}
          <div className="col-12 col-md-4 col-lg-3">
            {/* Profile Card */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="card-body p-4 text-center">
                <div className="position-relative d-inline-block mb-3">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px", background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}>
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="avatar" className="rounded-circle w-100 h-100 object-fit-cover" />
                    ) : (
                      <User size={48} className="text-white" />
                    )}
                  </div>
                </div>
                <h5 className="fw-bold text-dark mb-1">{name}</h5>
                <p className="text-secondary small mb-0">{email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item p-0 border-0">
                  <Link href="/account" className="d-flex align-items-center gap-3 px-4 py-3 text-decoration-none bg-primary bg-opacity-10 fw-medium" style={{ color: "#7c3aed" }}>
                    <User size={18} /> Хувийн мэдээлэл
                    <ChevronRight size={16} className="ms-auto" />
                  </Link>
                </li>
                <li className="list-group-item p-0 border-0">
                  <Link href="/account/orders" className="d-flex align-items-center gap-3 px-4 py-3 text-secondary text-decoration-none hover-bg-light">
                    <Package size={18} /> Захиалгын түүх
                    <ChevronRight size={16} className="ms-auto" />
                  </Link>
                </li>
                <li className="list-group-item p-0 border-0">
                  <Link href="/account/settings" className="d-flex align-items-center gap-3 px-4 py-3 text-secondary text-decoration-none hover-bg-light">
                    <Settings size={18} /> Тохиргоо
                    <ChevronRight size={16} className="ms-auto" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Logout */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <form action={logout}>
                <button type="submit" className="btn btn-link text-danger text-decoration-none d-flex align-items-center gap-3 px-4 py-3 w-100 text-start">
                  <LogOut size={18} /> Гарах
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-12 col-md-8 col-lg-9">
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-sm-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", backgroundColor: "#ede9fe" }}>
                        <ShoppingBag size={24} style={{ color: "#7c3aed" }} />
                      </div>
                    </div>
                    <h3 className="fw-bold mb-1" style={{ fontSize: "2rem" }}>{totalOrders}</h3>
                    <p className="text-secondary small mb-0">Нийт захиалга</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", backgroundColor: "#d1fae5" }}>
                        <TrendingUp size={24} style={{ color: "#10b981" }} />
                      </div>
                    </div>
                    <h3 className="fw-bold mb-1" style={{ fontSize: "2rem" }}>{formatCurrency(totalSpent)}</h3>
                    <p className="text-secondary small mb-0">Нийт зарцуулалт</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", backgroundColor: "#fef3c7" }}>
                        <Clock size={24} style={{ color: "#f59e0b" }} />
                      </div>
                    </div>
                    <h3 className="fw-bold mb-1" style={{ fontSize: "2rem" }}>{pendingOrders}</h3>
                    <p className="text-secondary small mb-0">Хүлээгдэж буй</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0">Сүүлийн захиалгууд</h4>
                <Link href="/account/orders" className="btn btn-link text-decoration-none small d-flex align-items-center gap-1" style={{ color: "#7c3aed" }}>
                  Бүгдийг харах <ArrowRight size={14} />
                </Link>
              </div>
              <div className="card-body p-4">
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" style={{ width: "80px", height: "80px" }}>
                      <Package size={32} className="text-secondary" />
                    </div>
                    <h6 className="fw-medium text-dark mb-2">Танд одоогоор ямар нэгэн захиалга байхгүй байна</h6>
                    <p className="text-secondary small mb-4">Та шинэ худалдан авалт хийж манай үйлчилгээтэй танилцана уу</p>
                    <Link href="/products" className="btn rounded-pill px-4 py-3 text-white fw-semibold" style={{ backgroundColor: "#7c3aed" }}>
                      Дэлгүүр хэсэх
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="order-card rounded-4 p-4 transition-all"
                      >

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                              <span className="fw-bold" style={{ fontSize: "1.1rem" }}>{order.order_number}</span>
                              <span className={`badge rounded-pill px-3 py-2 ${
                                order.status === "paid" || order.status === "delivered" ? "bg-success" :
                                order.status === "pending" ? "bg-warning text-dark" :
                                order.status === "cancelled" ? "bg-danger" : "bg-info"
                              }`}>
                                {order.status === "paid" && <CheckCircle size={12} className="me-1" />}
                                {order.status === "shipped" && <Truck size={12} className="me-1" />}
                                {order.status}
                              </span>
                            </div>
                            <div className="d-flex flex-wrap gap-3 text-secondary small">
                              <span className="d-flex align-items-center gap-1">
                                <Calendar size={14} />
                                {new Date(order.created_at).toLocaleDateString("mn-MN")}
                              </span>
                              <span className="d-flex align-items-center gap-1">
                                <CreditCard size={14} />
                                {order.payment_method === "qpay" ? "QPay" : "Дансаар"}
                              </span>
                              <span className="d-flex align-items-center gap-1">
                                <MapPin size={14} />
                                {order.shipping_method === "ub" ? "Улаанбаатар" : "Орон нутаг"}
                              </span>
                            </div>
                          </div>
                          <div className="text-md-end">
                            <div className="fw-bold fs-5 mb-1" style={{ color: "#7c3aed" }}>
                              {formatCurrency(order.total)}
                            </div>
                            <Link href={`/account/orders/${order.id}`} className="btn btn-link text-decoration-none small p-0" style={{ color: "#7c3aed" }}>
                              Дэлгэрэнгүй харах →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
