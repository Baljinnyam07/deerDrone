"use client";

import { useEffect } from "react";

export default function AuthSuccessPage() {
  useEffect(() => {
    // Хэрэв popup цонхонд нээгдсэн бол өөрийгөө хаана
    if (window.opener) {
      window.close();
    } else {
      // Хэрэв шууд хуудсан дээр нээгдсэн бол нүүр рүү шилжүүлнэ
      window.location.href = "/";
    }
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#f8fafc" }}>
      <h3 style={{ color: "#0f172a", fontWeight: 600 }}>Нэвтрэх үйлдэл амжилттай. Түр хүлээнэ үү...</h3>
    </div>
  );
}
