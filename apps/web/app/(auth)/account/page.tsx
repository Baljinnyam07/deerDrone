import Link from "next/link";
import { redirect } from "next/navigation";
import { User, Package, Settings, LogOut, ChevronRight } from "lucide-react";
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

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container py-4">
        <h2 className="fw-bold mb-5" style={{ fontFamily: "var(--font-ui), sans-serif", fontSize: "2rem" }}>Миний бүртгэл</h2>
        
        <div className="row g-5">
          <div className="col-12 col-md-4 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="card-body p-4 text-center border-bottom">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mt-2" style={{ width: "80px", height: "80px" }}>
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="avatar" className="rounded-circle w-100 h-100 object-fit-cover" />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <h5 className="fw-bold text-dark mb-1">{name}</h5>
                <p className="text-secondary small mb-0">{email}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item p-0 border-0">
                  <Link href="/account" className="d-flex align-items-center gap-3 px-4 py-3 text-primary text-decoration-none bg-primary bg-opacity-10 fw-medium">
                    <User size={18} /> Хувийн мэдээлэл
                  </Link>
                </li>
                <li className="list-group-item p-0 border-0">
                  <Link href="/account/orders" className="d-flex align-items-center gap-3 px-4 py-3 text-secondary text-decoration-none hover-bg-light">
                    <Package size={18} /> Захиалгын түүх
                  </Link>
                </li>
                <li className="list-group-item p-0 border-0">
                  <Link href="/account/settings" className="d-flex align-items-center gap-3 px-4 py-3 text-secondary text-decoration-none hover-bg-light">
                    <Settings size={18} /> Тохиргоо
                  </Link>
                </li>
                <li className="list-group-item p-0 border-0 border-top mt-2">
                   <form action={logout}>
                      <button type="submit" className="btn btn-link text-danger text-decoration-none d-flex align-items-center gap-3 px-4 py-3 w-100 text-start">
                        <LogOut size={18} /> Гарах
                      </button>
                   </form>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="col-12 col-md-8 col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
                <h4 className="fw-bold">Сүүлийн захиалгууд</h4>
              </div>
              <div className="card-body p-4">
                <div className="text-center py-5">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px" }}>
                    <Package size={24} className="text-secondary" />
                  </div>
                  <h6 className="fw-medium text-dark">Танд одоогоор хийгдсэн захиалга байхгүй байна.</h6>
                  <p className="text-secondary small mb-4">Та шинэ худалдан авалт хийж манай үйлчилгээтэй танилцана уу.</p>
                  <Link href="/" className="btn btn-outline-primary rounded-pill px-4">
                    Дрон үзэх
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
