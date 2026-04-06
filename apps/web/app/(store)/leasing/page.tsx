import Link from "next/link";
import { Calculator } from "lucide-react";

export default function LeasingPage() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container py-5 text-center">
        <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: "80px", height: "80px" }}>
          <Calculator size={32} className="text-primary" />
        </div>
        
        <h1 className="fw-bold mb-3" style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}>
          Лизинг Тооцоологч
        </h1>
        <p className="text-secondary fs-5 mb-5 mx-auto" style={{ maxWidth: "600px" }}>
          Энэхүү систем одоогоор хөгжүүлэлтийн шатанд байна. Та удахгүй банкны апп-уудыг ашиглан шууд лизинг тооцоолох боломжтой болно.
        </p>

        <div className="card border-0 shadow-sm rounded-4 mx-auto mb-5 text-start" style={{ maxWidth: "500px" }}>
          <div className="card-body p-4 p-md-5">
             <h4 className="fw-bold mb-4">Жишээ тооцоолол</h4>
             <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Зээлийн хэмжээ:</span>
                <span className="fw-bold">5,000,000 ₮</span>
             </div>
             <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Урьдчилгаа (0-20%):</span>
                <span className="fw-bold">0 ₮</span>
             </div>
             <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Хугацаа:</span>
                <span className="fw-bold">12 сар</span>
             </div>
             <div className="d-flex justify-content-between mb-4">
                <span className="text-secondary">Хүү:</span>
                <span className="fw-bold">1.2% - 1.8%</span>
             </div>
             <hr />
             <div className="d-flex justify-content-between mt-4">
                <span className="text-dark fw-medium">Сарын төлөлт:</span>
                <span className="fw-bold text-primary fs-5">~450,000 ₮</span>
             </div>
          </div>
        </div>

        <Link href="/products" className="dji-solid-btn px-5 py-3 rounded-pill text-decoration-none">
          Буцах
        </Link>
      </div>
    </div>
  );
}
