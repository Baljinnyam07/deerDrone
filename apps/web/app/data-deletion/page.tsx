import { ShieldAlert, Trash2, Settings, Mail } from "lucide-react";

export const metadata = {
  title: "Мэдээлэл устгах заавар | Deer Drone",
  description: "Хэрэглэгчийн мэдээлэл болон бүртгэл устгах заавар",
};

export default function DataDeletion() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: '800px' }}>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-dark mb-3">
            Хэрэглэгчийн мэдээлэл устгах
          </h1>
          <p className="text-secondary fs-5">
            Та манай системээс өөрийн бүртгэл болон холбогдох бүх мэдээллээ бүрмөсөн устгах эрхтэй. Дараах зааврын дагуу устгах үйлдлийг хийнэ үү.
          </p>
        </div>

        {/* Website Deletion Steps */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="h4 fw-bold text-dark d-flex align-items-center gap-2 mb-4">
              <ShieldAlert className="text-primary" size={24} />
              1. Вэбсайт дээрээс бүртгэлээ устгах
            </h2>
            <div className="d-flex flex-column gap-3">
              {[
                "Өөрийн бүртгэлээр манай вэбсайт руу нэвтрэн орно.",
                "Баруун дээд буланд байрлах Профайл (Profile) цэс рүү орно.",
                "Бүртгэл устгах (Delete Account) товчийг дарж баталгаажуулна.",
                "Таны мэдээлэл манай мэдээллийн сангаас шууд болон бүрмөсөн устах болно."
              ].map((step, idx) => (
                <div key={idx} className="d-flex gap-3 align-items-start">
                  <div className="flex-shrink-0 d-flex align-items-center justify-content-center bg-light text-dark fw-bold rounded-circle" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                    {idx + 1}
                  </div>
                  <p className="text-secondary mt-1 mb-0 lh-base">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facebook App Removal Steps */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="h4 fw-bold text-dark d-flex align-items-center gap-2 mb-4">
              <Settings className="text-primary" size={24} />
              2. Facebook дээрээс хандах эрхийг салгах
            </h2>
            <div className="d-flex flex-column gap-3">
              {[
                "Өөрийн Facebook хаягаар нэвтрэнэ.",
                "Баруун дээд булангийн цэснээс Settings & Privacy > Settings рүү орно.",
                "Зүүн талын цэснээс Apps and Websites сонголтыг дарна.",
                "Жагсаалтаас Deer Drone апп-г олоод Remove товчийг дарна уу."
              ].map((step, idx) => (
                <div key={idx} className="d-flex gap-3 align-items-start">
                  <div className="flex-shrink-0 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fw-bold rounded-circle" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                    {idx + 1}
                  </div>
                  <p className="text-secondary mt-1 mb-0 lh-base">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="card bg-light border-0 rounded-4 text-center">
          <div className="card-body p-4 p-md-5">
            <Mail className="text-secondary mb-3" size={32} />
            <h3 className="h5 fw-bold text-dark mb-2">Тусламж хэрэгтэй юу?</h3>
            <p className="text-secondary small mb-0">
              Хэрэв танд бүртгэлээ устгахтай холбоотой асуудал гарвал манай <a href="mailto:Deer.Drone.Shop@gmail.com" className="text-primary text-decoration-none fw-medium">Deer.Drone.Shop@gmail.com</a> и-мэйл хаягаар холбогдож устгуулах хүсэлтээ илгээж болно. Бид ажлын 1-3 хоногт багтаан таны мэдээллийг бүрмөсөн устгах болно.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
