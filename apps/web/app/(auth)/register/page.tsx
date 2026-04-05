"use client";

import Link from "next/link";
import { loginWithFacebook } from "../actions";

export default function RegisterPage() {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-5">
                  <h1 className="fw-bold mb-2" style={{ fontFamily: "serif" }}>Бүртгүүлэх</h1>
                  <p className="text-secondary mb-5">Та зөвхөн Facebook-ээр бүртгүүлэх боломжтой</p>
                </div>

                <form action={loginWithFacebook}>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill py-3 fw-bold fs-5 d-flex justify-content-center align-items-center gap-3 shadow-sm"
                    style={{ backgroundColor: "#1877F2", borderColor: "#1877F2" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                    </svg>
                    Facebook-ээр бүртгүүлэх
                  </button>
                </form>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <Link href="/" className="text-secondary text-decoration-none small">
                &larr; Нүүр хуудас руу буцах
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
