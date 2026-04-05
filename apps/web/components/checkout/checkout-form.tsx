"use client";

import { useState, useTransition, useEffect } from "react";
import type { CheckoutPayload, CheckoutResponse } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import Link from "next/link";
import { useStore } from "../../store/useStore";
import type { CartItem } from "../../store/useStore";
import { CheckCircle2, ChevronRight, Truck, Wallet } from "lucide-react";

const defaultPayload = (): CheckoutPayload => ({
  contactName: "",
  contactPhone: "",
  paymentMethod: "qpay",
  shippingMethod: "ub",
  shippingAddress: {
    city: "Улаанбаатар",
    district: "",
    khoroo: "",
    line1: "",
  },
  notes: "",
  items: [],
});

export function CheckoutForm() {
  const { cartItems, clearCart } = useStore();
  const subtotal = cartItems.reduce((acc: number, current: CartItem) => acc + (current.price * current.quantity), 0);
  
  const [form, setForm] = useState<CheckoutPayload>(defaultPayload());
  const [response, setResponse] = useState<CheckoutResponse | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateField<Key extends keyof CheckoutPayload>(key: Key, value: CheckoutPayload[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateAddress(field: keyof CheckoutPayload["shippingAddress"], value: string) {
    setForm((current) => ({
      ...current,
      shippingAddress: {
        ...current.shippingAddress,
        [field]: value,
      },
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      // Mocking checkout behavior
      setTimeout(() => {
        setResponse({
          order: { id: "123", orderNumber: "ORD-" + Math.floor(Math.random() * 100000) } as any,
          payment: { method: form.paymentMethod, status: "pending" } as any,
        });
        clearCart();
      }, 1500);
    });
  }

  const shippingCost = form.shippingMethod === "ub" ? 5000 : 15000;
  const total = subtotal + shippingCost;

  if (response) {
    return (
      <div className="container py-5 text-center my-5 text-sans-serif">
        <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mb-4 mx-auto" style={{ width: "100px", height: "100px" }}>
           <CheckCircle2 size={48} />
        </div>
        <h1 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>Захиалга амжилттай</h1>
        <p className="text-secondary fs-5 mb-5 mx-auto" style={{ maxWidth: "500px" }}>
          Таны <strong>{response.order.orderNumber}</strong> дугаартай захиалга хүлээн авагдлаа. Бид удахгүй тантай холбогдох болно.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link href="/" className="btn btn-outline-dark px-5 py-3 rounded-pill fw-bold">
            Нүүр хуудас
          </Link>
          <Link href="/account" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow">
            Захиалга хянах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pb-5 text-sans-serif">
      <div className="container py-4">
        <div className="row g-5">
          {/* Form */}
          <div className="col-12 col-lg-7">
            <h1 className="fw-bold mb-5" style={{ fontSize: "2.5rem", letterSpacing: "-0.01em" }}>Тооцоо хийх</h1>
            
            <form onSubmit={handleSubmit}>
              {/* Contact Info */}
              <div className="mb-5">
                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">Холбогдох мэдээлэл</h4>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label text-secondary small fw-bold uppercase">ОВOГ НЭР</label>
                    <input
                      required
                      type="text"
                      className="form-control form-control-lg bg-light border-0"
                      placeholder="Жишээ: Батболд"
                      style={{ fontSize: "1rem" }}
                      value={form.contactName}
                      onChange={(e) => updateField("contactName", e.target.value)}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label text-secondary small fw-bold uppercase">УТАСНЫ ДУГААР</label>
                    <input
                      required
                      type="tel"
                      className="form-control form-control-lg bg-light border-0"
                      placeholder="99XX-XXXX"
                      style={{ fontSize: "1rem" }}
                      value={form.contactPhone}
                      onChange={(e) => updateField("contactPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-5">
                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">Хүргэлтийн хаяг</h4>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label text-secondary small fw-bold uppercase">БҮС</label>
                    <select
                      className="form-select form-select-lg bg-light border-0"
                      value={form.shippingMethod}
                      onChange={(e) => updateField("shippingMethod", e.target.value as "ub" | "rural")}
                    >
                      <option value="ub">Улаанбаатар</option>
                      <option value="rural">Орон нутаг</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label text-secondary small fw-bold uppercase">ХОТ / АЙМАГ</label>
                    <input
                      required
                      type="text"
                      className="form-control form-control-lg bg-light border-0"
                      value={form.shippingAddress.city}
                      onChange={(e) => updateAddress("city", e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-secondary small fw-bold uppercase">ДЭЛГЭРЭНГҮЙ ХАЯГ (БАЙР, ТООТ, ОРЦ)</label>
                    <textarea
                      required
                      rows={3}
                      className="form-control bg-light border-0"
                      placeholder="Орцны код орхиж болохгүй..."
                      value={form.shippingAddress.line1}
                      onChange={(e) => updateAddress("line1", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-5">
                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">Төлбөрийн хэлбэр</h4>
                <div className="row g-3">
                  <div className="col-6">
                    <input type="radio" className="btn-check" name="payment" id="qpay" checked={form.paymentMethod === "qpay"} onChange={() => updateField("paymentMethod", "qpay")} />
                    <label className="btn btn-outline-light border text-dark w-100 py-3 rounded-3 group" htmlFor="qpay">
                      <span className="d-block fw-bold mb-1">QPay</span>
                      <span className="small text-secondary">Шүүд төлөх</span>
                    </label>
                  </div>
                  <div className="col-6">
                    <input type="radio" className="btn-check" name="payment" id="bank" checked={form.paymentMethod === "bank_transfer"} onChange={() => updateField("paymentMethod", "bank_transfer")} />
                    <label className="btn btn-outline-light border text-dark w-100 py-3 rounded-3 group" htmlFor="bank">
                      <span className="d-block fw-bold mb-1">Дансаар</span>
                      <span className="small text-secondary">Шилжүүлэг</span>
                    </label>
                  </div>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 rounded-pill py-4 fw-bold shadow-lg mt-4 transition-all hover-scale" 
                disabled={isPending || cartItems.length === 0}
              >
                {isPending ? "Уншиж байна..." : "Захиалгыг баталгаажуулах"}
              </button>
            </form>
          </div>

          {/* Cart Summary Panel */}
          <div className="col-12 col-lg-5">
            <div className="bg-light p-4 p-xl-5 rounded-4 sticky-top" style={{ top: "120px" }}>
                <h4 className="fw-bold mb-4">Бүтээгдэхүүнүүд</h4>
                <div className="mb-5 overflow-auto" style={{ maxHeight: "400px" }}>
                  {mounted && cartItems.map((item: CartItem) => (
                    <div key={item.id} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-white border-opacity-50">
                      <div className="bg-white rounded-3 p-2 d-flex align-items-center justify-content-center overflow-hidden" style={{ width: "70px", height: "70px" }}>
                        <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-contain" />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold text-dark mb-1 small text-truncate" style={{ maxWidth: "200px" }}>{item.name}</h6>
                        <div className="small text-secondary">{item.quantity} ш</div>
                      </div>
                      <div className="fw-bold">{formatMoney(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2 text-secondary small fw-bold">
                    <span>НИЙТ ДҮН</span>
                    <span className="text-dark">{mounted ? formatMoney(subtotal) : formatMoney(0)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-4 text-secondary small fw-bold">
                    <span>ХҮРГЭЛТ</span>
                    <span className="text-dark">{formatMoney(shippingCost)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-end pt-3 border-top border-dark border-opacity-10">
                    <span className="fw-bold text-dark fs-5">ТӨЛӨХ ДҮН</span>
                    <span className="fw-bold text-primary fs-3">{mounted ? formatMoney(total) : formatMoney(0)}</span>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
