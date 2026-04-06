import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, ShieldCheck, UserRound } from "lucide-react";
import { createClient } from "../../../../lib/supabase/server";
import { logout } from "../../actions";

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <p className="text-uppercase text-secondary small fw-bold mb-2">Account</p>
            <h1 className="fw-bold mb-0">Тохиргоо</h1>
          </div>
          <Link href="/account" className="btn btn-outline-primary rounded-pill px-4">
            Профайл руу буцах
          </Link>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <section className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-primary-subtle text-primary rounded-circle p-3">
                  <UserRound size={22} />
                </div>
                <div>
                  <h4 className="fw-bold mb-1">Нэвтрэх мэдээлэл</h4>
                  <p className="text-secondary mb-0">Таны бүртгэлтэй имэйл</p>
                </div>
              </div>
              <div className="bg-light rounded-4 p-3">
                <div className="text-secondary small mb-1">Email</div>
                <div className="fw-medium">{user.email}</div>
              </div>
            </section>
          </div>

          <div className="col-12 col-lg-6">
            <section className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-success-subtle text-success rounded-circle p-3">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="fw-bold mb-1">Аюулгүй байдал</h4>
                  <p className="text-secondary mb-0">
                    Админ болон хэрэглэгчийн сесс хамгаалалт идэвхтэй.
                  </p>
                </div>
              </div>
              <ul className="text-secondary mb-0">
                <li>Захиалгууд зөвхөн өөрийн бүртгэлд харагдана.</li>
                <li>Checkout үед нөөц үлдэгдэл шалгаж баталгаажуулна.</li>
                <li>Chatbot нь same-origin API-аар сервер талдаа холбогдоно.</li>
              </ul>
            </section>
          </div>

          <div className="col-12">
            <section className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-warning-subtle text-warning rounded-circle p-3">
                  <Bell size={22} />
                </div>
                <div>
                  <h4 className="fw-bold mb-1">Тусламж ба гарц</h4>
                  <p className="text-secondary mb-0">
                    Тохиргооны нэмэлт өөрчлөлт хэрэгтэй бол support багтай холбогдоно уу.
                  </p>
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row gap-3">
                <Link href="/products" className="btn btn-outline-primary rounded-pill px-4">
                  Дэлгүүр үзэх
                </Link>
                <form action={logout}>
                  <button type="submit" className="btn btn-danger rounded-pill px-4">
                    Системээс гарах
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
