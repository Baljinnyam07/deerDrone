"use client";

import { useState, useTransition, useRef } from "react";
import type { CheckoutPayload } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import Link from "next/link";
import { useStore } from "../../store/useStore";
import type { CartItem } from "../../store/useStore";
import {
  CheckCircle2, QrCode, Building2, Copy, Check,
  ArrowLeft, ArrowRight, User, MapPin, CreditCard,
  CheckCircle, Shield, Truck, Home, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const defaultPayload = (): CheckoutPayload => ({
  contactName: "",
  contactPhone: "",
  paymentMethod: "qpay",
  shippingMethod: "ub",
  shippingAddress: { city: "Улаанбаатар", district: "", khoroo: "", line1: "" },
  notes: "",
  items: [],
});

interface OrderResult {
  order: { id: string; orderNumber: string; status: string; total: number; createdAt: string };
  payment: {
    method: string;
    invoiceId?: string;
    qrCode?: string;
    deeplinks?: { name: string; description: string; logo: string; link: string }[];
    expiresAt?: string;
    accountName?: string;
    accountNumber?: string;
    reference?: string;
  };
}

const steps = [
  { id: "contact", title: "Холбоо барих", icon: User },
  { id: "shipping", title: "Хүргэлт", icon: MapPin },
  { id: "payment", title: "Төлбөр", icon: CreditCard },
  { id: "review", title: "Батлах", icon: CheckCircle },
];

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .co-page {
    background: #fff;
    min-height: 100vh;
    padding-bottom: 40px;
    overflow-x: hidden;
    width: 100%;
  }

  /* ── Success screen ── */
  .co-success {
    max-width: 560px;
    margin: 0 auto;
    padding: 60px 16px 40px;
    text-align: center;
  }
  .co-success-icon {
    width: 96px; height: 96px;
    border-radius: 50%;
    background: #DCFCE7;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
  }
  .co-success-title {
    font-size: 2rem; font-weight: 700;
    letter-spacing: -0.02em;
    color: #0F172A; margin-bottom: 12px;
  }
  .co-success-btns {
    display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
    margin-top: 32px;
  }
  .co-success-btns a {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px;
    border-radius: 8px; font-weight: 600; font-size: 0.95rem;
    text-decoration: none; transition: all 200ms;
  }
  .co-btn-outline {
    background: #F8FAFC; color: #2563EB; border: 1px solid #E2E8F0;
  }
  .co-btn-outline:hover { background: #EEF2FF; }
  .co-btn-primary {
    background: #2563EB; color: #fff; border: 1px solid #2563EB;
  }
  .co-btn-primary:hover { background: #1D4ED8; }

  /* ── Step indicator ── */
  .co-steps {
    width: 100%;
    margin-bottom: 40px;
  }
  .co-steps-icons {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .co-steps-labels {
    display: flex;
    width: 100%;
    margin-top: 10px;
  }
  .co-step-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .co-step-icon {
    width: 48px; height: 48px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: #E2E8F0; color: #94A3B8;
    border: 3px solid #E2E8F0;
    transition: all 250ms;
    flex-shrink: 0;
  }
  .co-step-icon.active {
    background: #2563EB; color: #fff;
    border-color: #2563EB;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
  }
  .co-step-icon.done {
    background: #10B981; color: #fff;
    border-color: #10B981;
  }
  .co-step-line {
    flex: 1; height: 2px; background: #E2E8F0;
    transition: background 250ms;
  }
  .co-step-line.done { background: #10B981; }
  .co-step-label-wrap {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .co-step-label {
    font-size: 0.72rem; font-weight: 600;
    color: #94A3B8; text-align: center;
    white-space: nowrap;
    margin-top: 8px;
    display: block;
  }
  .co-step-label.active { color: #2563EB; }
  .co-step-label.done   { color: #10B981; }

  /* ── Layout ── */
  .co-wrap {
    max-width: 1200px; margin: 0 auto;
    padding: 32px 16px;
  }
  .co-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 32px;
    align-items: start;
  }

  /* ── Sidebar ── */
  .co-sidebar {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 24px;
    position: sticky;
    top: 88px;
  }
  .co-sidebar-title {
    font-size: 1rem; font-weight: 700;
    color: #0F172A; margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .co-cart-item {
    display: flex; gap: 12px;
    padding-bottom: 16px; margin-bottom: 16px;
    border-bottom: 1px solid #E2E8F0;
  }
  .co-cart-item:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
  .co-cart-img {
    width: 56px; height: 56px; min-width: 56px;
    border-radius: 8px; border: 1px solid #E2E8F0;
    background: #fff; position: relative; overflow: hidden;
  }
  .co-cart-info h6 {
    font-size: 0.85rem; font-weight: 600; color: #0F172A;
    margin-bottom: 4px;
    overflow: hidden; text-overflow: ellipsis;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .co-cart-info .qty { font-size: 0.78rem; color: #64748B; }
  .co-cart-info .price { font-size: 0.9rem; font-weight: 600; color: #2563EB; }
  .co-totals { border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 16px; }
  .co-total-row {
    display: flex; justify-content: space-between;
    font-size: 0.9rem; margin-bottom: 10px;
    color: #64748B;
  }
  .co-total-row span:last-child { font-weight: 600; color: #0F172A; }
  .co-total-final {
    display: flex; justify-content: space-between;
    align-items: center;
    padding-top: 12px; border-top: 1px solid #E2E8F0;
    margin-top: 4px;
  }
  .co-total-final span:first-child { font-weight: 700; color: #0F172A; font-size: 1rem; }
  .co-total-final span:last-child  { font-size: 1.4rem; font-weight: 800; color: #2563EB; }

  /* ── Form ── */
  .co-form-title {
    font-size: 1.6rem; font-weight: 700;
    letter-spacing: -0.02em; color: #0F172A;
    margin-bottom: 6px;
  }
  .co-form-subtitle { font-size: 0.95rem; color: #64748B; margin-bottom: 28px; }
  .co-field { margin-bottom: 20px; }
  .co-label {
    display: block; font-size: 0.78rem; font-weight: 700;
    color: #0F172A; text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: 8px;
  }
  .co-req { color: #EF4444; }
  .co-input, .co-select, .co-textarea {
    display: block; width: 100%;
    padding: 12px 14px;
    border: 1.5px solid #E2E8F0; border-radius: 8px;
    font-size: 1rem; color: #0F172A;
    background: #fff;
    transition: border-color 200ms, background 200ms;
    appearance: auto;
  }
  .co-textarea { resize: vertical; font-family: inherit; min-height: 96px; }
  .co-input:focus, .co-select:focus, .co-textarea:focus {
    outline: none; border-color: #2563EB; background: #EEF2FF;
  }

  /* ── Payment options ── */
  .co-pay-option {
    display: flex; align-items: center; gap: 14px;
    padding: 16px; border: 2px solid #E2E8F0; border-radius: 10px;
    cursor: pointer; margin-bottom: 12px; transition: all 200ms;
  }
  .co-pay-option.selected { border-color: #2563EB; background: #EEF2FF; }
  .co-pay-option input { accent-color: #2563EB; }
  .co-pay-name { font-weight: 600; color: #0F172A; font-size: 0.95rem; margin-bottom: 2px; }
  .co-pay-desc { font-size: 0.82rem; color: #64748B; }

  /* ── Review ── */
  .co-review-card {
    background: #F8FAFC; border: 1px solid #E2E8F0;
    border-radius: 10px; padding: 18px; margin-bottom: 16px;
  }
  .co-review-card h5 {
    font-size: 0.9rem; font-weight: 700; color: #0F172A;
    display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
  }
  .co-review-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 8px 0; border-bottom: 1px solid #E2E8F0;
    gap: 12px;
  }
  .co-review-row:last-child { border-bottom: none; }
  .co-review-row .lbl { color: #64748B; font-size: 0.85rem; white-space: nowrap; flex-shrink: 0; }
  .co-review-row .val { font-weight: 600; color: #0F172A; font-size: 0.85rem; text-align: right; word-break: break-word; }

  /* ── Nav buttons ── */
  .co-actions {
    display: flex; justify-content: space-between; align-items: center;
    gap: 12px; margin-top: 36px;
  }
  .co-btn-back, .co-btn-next, .co-btn-submit {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px; padding: 13px 28px;
    border-radius: 8px; font-weight: 600; font-size: 1rem;
    cursor: pointer; border: none; transition: all 200ms;
    text-decoration: none;
  }
  .co-btn-back {
    background: #F8FAFC; color: #64748B; border: 1.5px solid #E2E8F0;
  }
  .co-btn-back:hover { background: #F1F5F9; border-color: #CBD5E1; color: #0F172A; }
  .co-btn-next {
    background: #2563EB; color: #fff; margin-left: auto;
  }
  .co-btn-next:hover:not(:disabled) { background: #1D4ED8; transform: translateY(-1px); }
  .co-btn-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .co-btn-submit { background: #10B981; color: #fff; margin-left: auto; }
  .co-btn-submit:hover:not(:disabled) { background: #059669; transform: translateY(-1px); }
  .co-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Field error ── */
  .co-field-error {
    color: #EF4444; font-size: 0.8rem;
    margin-top: 6px; display: flex; align-items: center; gap: 4px;
  }
  .co-input.err, .co-select.err, .co-textarea.err {
    border-color: #FCA5A5; background: #FFF5F5;
  }

  /* ── Clickable done step ── */
  .co-step-icon.done { cursor: pointer; }
  .co-step-icon.done:hover { background: #059669; border-color: #059669; }

  /* ── Error ── */
  .co-error {
    display: flex; align-items: flex-start; gap: 10px;
    background: #FEE2E2; border: 1px solid #FECACA;
    border-radius: 8px; padding: 14px; margin-top: 20px;
    color: #991B1B; font-size: 0.9rem;
  }

  /* ── QPay Success Card ── */
  .co-qpay-card {
    background: #ffffff;
    border: 1px solid #E2E8F0;
    border-radius: 20px;
    padding: 36px 24px;
    margin: 32px auto;
    text-align: center;
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
    max-width: 100%;
  }
  .co-qpay-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 5px;
    background: linear-gradient(90deg, #2563EB, #60A5FA);
  }
  .co-qpay-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .co-qpay-header h3 {
    font-size: 1.3rem;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.02em;
  }
  .co-qpay-qr-wrap {
    background: #fff;
    padding: 16px;
    border-radius: 20px;
    border: 2px solid #F1F5F9;
    display: inline-block;
    box-shadow: 0 8px 24px rgba(0,0,0,0.04);
    margin-bottom: 24px;
    transition: transform 300ms ease;
  }
  .co-qpay-qr-wrap:hover {
    transform: scale(1.02);
  }
  .co-qpay-desc {
    font-size: 0.95rem;
    color: #475569;
    margin-bottom: 20px;
    font-weight: 500;
  }
  .co-qpay-banks {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
    margin-top: 24px;
  }
  .co-qpay-bank-btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #0F172A;
    text-decoration: none;
    transition: all 200ms ease;
  }
  .co-qpay-bank-btn:hover {
    background: #fff;
    border-color: #3B82F6;
    box-shadow: 0 4px 12px rgba(37,99,235,0.1);
    transform: translateY(-2px);
  }
  .co-qpay-bank-btn img {
    border-radius: 6px;
    flex-shrink: 0;
  }
  .co-qpay-timer {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #EEF2FF;
    color: #3730A3;
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 28px;
  }

  /* ─────── TABLET ≤ 1024px ─────── */
  @media (max-width: 1024px) {
    .co-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .co-sidebar {
      position: static;
      order: -1;
    }
  }

  /* ─────── MOBILE ≤ 640px ─────── */
  @media (max-width: 640px) {
    .co-wrap { padding: 20px 14px; }
    .co-success { padding: 40px 14px 32px; }
    .co-success-title { font-size: 1.6rem; }
    .co-success-icon { width: 72px; height: 72px; }

    .co-step-icon { width: 36px; height: 36px; min-width: 36px; border-width: 2px; }
    .co-step-icon svg { width: 15px; height: 15px; }
    .co-step-label { font-size: 0.62rem; margin-top: 6px; }
    .co-steps { margin-bottom: 28px; }

    .co-form-title { font-size: 1.3rem; }
    .co-form-subtitle { font-size: 0.88rem; margin-bottom: 20px; }

    .co-actions { flex; column-reverse; }
    .co-btn-back, .co-btn-next, .co-btn-submit {
      width: 100%; padding: 14px;
      margin-left: 0;
    }

    .co-sidebar { padding: 16px; }
    .co-sidebar-title { font-size: 0.9rem; margin-bottom: 14px; }

    .co-total-final span:last-child { font-size: 1.2rem; }

    .co-success-btns { flex-direction: column; }
    .co-success-btns a { justify-content: center; }

    .co-qpay-banks {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .co-qpay-bank-btn {
      padding: 10px;
      font-size: 0.78rem;
    }
  }
`;

function StepIndicator({ currentStep, onStepClick }: { currentStep: number; onStepClick: (i: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%", marginBottom: 40 }}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isDone = index < currentStep;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "flex-start", flex: index < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 48 }}>
              <div
                className={`co-step-icon${isDone ? " done" : isActive ? " active" : ""}`}
                onClick={() => isDone && onStepClick(index)}
                title={isDone ? `${step.title} руу буцах` : undefined}
              >
                <Icon size={18} />
              </div>
              <span className={`co-step-label${isDone ? " done" : isActive ? " active" : ""}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`co-step-line${isDone ? " done" : ""}`}
                style={{ marginTop: 24 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CheckoutForm() {
  const { cartItems, clearCart } = useStore();
  const subtotal = cartItems.reduce(
    (acc: number, cur: CartItem) => acc + cur.price * cur.quantity, 0
  );

  const [form, setForm] = useState<CheckoutPayload>(defaultPayload());
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [dir, setDir] = useState(1);

  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentCheckError, setPaymentCheckError] = useState("");

  const checkPayment = async () => {
    if (!result?.order?.id) return;
    setCheckingPayment(true);
    setPaymentCheckError("");
    try {
      const res = await fetch(`/api/v1/qpay/callback?order_id=${result.order.id}`, { method: "POST" });
      const data = await res.json();
      if (data.paid) {
        setIsPaid(true);
      } else {
        setPaymentCheckError("Төлбөр хараахан хийгдээгүй эсвэл баталгаажаагүй байна.");
      }
    } catch (err) {
      setPaymentCheckError("Шалгах үед алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setCheckingPayment(false);
    }
  };

  function updateField<K extends keyof CheckoutPayload>(k: K, v: CheckoutPayload[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function updateAddress(f: keyof CheckoutPayload["shippingAddress"], v: string) {
    setForm((cur) => ({ ...cur, shippingAddress: { ...cur.shippingAddress, [f]: v } }));
  }

  const validateStep = (step = currentStep) => {
    if (step === 0) return !!(form.contactName.trim() && form.contactPhone.trim());
    if (step === 1) return !!(form.shippingAddress.line1.trim() && form.shippingAddress.city.trim());
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) { setShowErrors(true); return; }
    setShowErrors(false);
    setDir(1);
    setCurrentStep(s => s + 1);
  };
  const handlePrev = () => {
    setShowErrors(false);
    setDir(-1);
    setCurrentStep(s => s - 1);
  };
  const goToStep = (idx: number) => {
    if (idx < currentStep) {
      setShowErrors(false);
      setDir(-1);
      setCurrentStep(idx);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (cartItems.length === 0) { setError("Сагс хоосон байна."); return; }
    startTransition(async () => {
      try {
        const payload: CheckoutPayload = {
          ...form,
          items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity })),
        };
        const res = await fetch("/api/v1/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Алдаа гарлаа."); return; }
        setResult(data as OrderResult);
        clearCart();
      } catch {
        setError("Сүлжээний алдаа. Холболтоо шалгаад дахин оролдоно уу.");
      }
    });
  }

  const shippingCost = form.shippingMethod === "ub" ? 5000 : 15000;
  const total = subtotal + shippingCost;

  /* ─── Success screen ─── */
  if (result) {
    return (
      <div className="co-page">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="co-success">


          {result.payment.method === "qpay" && result.payment.qrCode && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="co-qpay-card">
              <div className="co-qpay-header">
                <QrCode size={26} style={{ color: "#2563EB" }} />
                <h3>QPay Төлбөр</h3>
              </div>

              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 8 }}>
                Таны <strong>{result.order.orderNumber}</strong> дугаартай захиалга хүлээн авагдлаа.
              </motion.p>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: 32 }}>
                Нийт дүн: <strong style={{ color: "#2563EB", fontSize: "1.2rem" }}>{formatMoney(result.order.total)}</strong>
              </motion.p>
              {isPaid ? (
                <div style={{ padding: "32px 16px", color: "#059669" }}>
                  <CheckCircle2 size={56} style={{ margin: "0 auto 16px" }} />
                  <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8, color: "#0F172A" }}>
                    Төлбөр амжилттай хийгдлээ
                  </h4>
                  <p style={{ fontSize: "0.95rem", color: "#64748B" }}>
                    Таны захиалга баталгаажсан бөгөөд удахгүй хүргэлтэд гарах болно. Баярлалаа!
                  </p>
                </div>
              ) : (
                <>

                  <div className="co-qpay-qr-wrap">
                    <Image src={result.payment.qrCode} alt="QPay QR" width={260} height={260}
                      style={{ maxWidth: "100%", height: "auto" }} unoptimized />
                  </div>
                  <p className="co-qpay-desc">
                    Банкны мобайл аппаараа доорх QR кодыг уншуулж төлбөрөө хийнэ үү.
                  </p>


                  {result.payment.deeplinks && result.payment.deeplinks.length > 0 && (
                    <div className="co-qpay-banks">
                      {result.payment.deeplinks.map(dl => (
                        <a key={dl.name} href={dl.link} target="_blank" rel="noopener noreferrer" className="co-qpay-bank-btn">
                          {dl.logo && <Image src={dl.logo} alt={dl.name} width={20} height={20} unoptimized />}
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dl.name}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {result.payment.expiresAt && (
                    <div className="co-qpay-timer">
                      Хүчинтэй хугацаа: {new Date(result.payment.expiresAt).toLocaleTimeString("mn-MN")} хүртэл
                    </div>
                  )}

                  <AnimatePresence>
                    {paymentCheckError && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="co-error" style={{ textAlign: "left", marginTop: 24, marginBottom: -8 }}>
                        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>{paymentCheckError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={checkPayment}
                    disabled={checkingPayment}
                    style={{
                      width: "100%", marginTop: 24, padding: "14px",
                      background: "#2563EB", color: "#fff", borderRadius: 12,
                      fontSize: "1rem", fontWeight: 600, border: "none", cursor: checkingPayment ? "not-allowed" : "pointer",
                      display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
                      opacity: checkingPayment ? 0.7 : 1, transition: "background 200ms"
                    }}
                  >
                    {checkingPayment ? "Шалгаж байна..." : "Төлбөр шалгах"}
                  </button>
                </>
              )}
            </motion.div>
          )}

          {result.payment.method === "bank_transfer" && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 24, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Building2 size={22} style={{ color: "#2563EB" }} />
                <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Дансаар шилжүүлэх</h3>
              </div>
              {[
                { label: "Данс эзэмшигч", value: result.payment.accountName },
                { label: "Дансны дугаар", value: result.payment.accountNumber },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #E2E8F0", gap: 12 }}>
                  <span style={{ color: "#64748B", fontSize: "0.88rem" }}>{row.label}:</span>
                  <span style={{ fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", gap: 12 }}>
                <span style={{ color: "#64748B", fontSize: "0.88rem" }}>Гүйлгээний утга:</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: "#2563EB" }}>{result.payment.reference}</span>
                  <button onClick={() => { navigator.clipboard.writeText(result.payment.reference || ""); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                    {copied ? <Check size={15} style={{ color: "#10B981" }} /> : <Copy size={15} style={{ color: "#94A3B8" }} />}
                  </button>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: 12 }}>
                Гүйлгээний утгадаа захиалгын дугаараа бичнэ үү.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  /* ─── Sidebar summary ─── */
  const Sidebar = (
    <div className="co-sidebar">
      <div className="co-sidebar-title">
        <Shield size={16} style={{ color: "#2563EB" }} /> Захиалгын тойм
      </div>
      <div style={{ maxHeight: 280, overflowY: "auto" }}>
        {mounted && cartItems.length > 0 ? cartItems.map((item: CartItem) => (
          <div key={item.id} className="co-cart-item">
            <div className="co-cart-img">
              <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: 4 }} />
            </div>
            <div className="co-cart-info" style={{ flex: 1, minWidth: 0 }}>
              <h6>{item.name}</h6>
              <div className="qty">{item.quantity} ш × {formatMoney(item.price)}</div>
            </div>
          </div>
        )) : (
          <p style={{ color: "#64748B", fontSize: "0.88rem", textAlign: "center", padding: "16px 0" }}>Сагс хоосон байна</p>
        )}
      </div>
      <div className="co-totals">
        <div className="co-total-row">
          <span>Нийт дүн:</span>
          <span>{mounted ? formatMoney(subtotal) : "₮0"}</span>
        </div>
        <div className="co-total-row">
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Truck size={13} /> Хүргэлт:</span>
          <span>{formatMoney(shippingCost)}</span>
        </div>
        <div className="co-total-final">
          <span>Төлөх дүн:</span>
          <span>{mounted ? formatMoney(total) : "₮0"}</span>
        </div>
      </div>
    </div>
  );

  /* ─── Main form ─── */
  return (
    <div className="co-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="co-wrap">
        <StepIndicator currentStep={currentStep} onStepClick={goToStep} />
        <div className="co-grid">
          {/* Form column */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: dir * 28, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: dir * -28, opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <form onSubmit={handleSubmit}>

                  {/* Step 1 — Contact */}
                  {currentStep === 0 && (
                    <div>
                      <h1 className="co-form-title">Холбоо барих мэдээлэл</h1>
                      <p className="co-form-subtitle">Захиалгын мэдэгдэл илгээх холбоо барих мэдээлэл</p>
                      <div className="co-field">
                        <label className="co-label">Овог нэр <span className="co-req">*</span></label>
                        <input
                          className={`co-input${showErrors && !form.contactName.trim() ? " err" : ""}`}
                          type="text" placeholder="Жишээ: Батболд Нариндаа"
                          value={form.contactName}
                          onChange={e => { updateField("contactName", e.target.value); setShowErrors(false); }} />
                        {showErrors && !form.contactName.trim() && (
                          <p className="co-field-error"><AlertCircle size={12} /> Овог нэрийг оруулна уу</p>
                        )}
                      </div>
                      <div className="co-field">
                        <label className="co-label">Утасны дугаар <span className="co-req">*</span></label>
                        <input
                          className={`co-input${showErrors && !form.contactPhone.trim() ? " err" : ""}`}
                          type="tel" placeholder="99XX-XXXX эсвэл +976..."
                          value={form.contactPhone}
                          onChange={e => { updateField("contactPhone", e.target.value); setShowErrors(false); }} />
                        {showErrors && !form.contactPhone.trim() && (
                          <p className="co-field-error"><AlertCircle size={12} /> Утасны дугаар оруулна уу</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2 — Shipping */}
                  {currentStep === 1 && (
                    <div>
                      <h1 className="co-form-title">Хүргэлтийн хаяг</h1>
                      <p className="co-form-subtitle">Бүтээгдэхүүнийг хүргэх бүрэн хаягаа оруулна уу</p>
                      <div className="co-field">
                        <label className="co-label">Хүргэлтийн бүс <span className="co-req">*</span></label>
                        <select className="co-select" value={form.shippingMethod}
                          onChange={e => updateField("shippingMethod", e.target.value as "ub" | "rural")}>
                          <option value="ub">Улаанбаатар хот — 5,000₮</option>
                          <option value="rural">Орон нутаг (аймаг) — 15,000₮</option>
                        </select>
                      </div>
                      <div className="co-field">
                        <label className="co-label">Хот / Аймаг <span className="co-req">*</span></label>
                        <input
                          className={`co-input${showErrors && !form.shippingAddress.city.trim() ? " err" : ""}`}
                          type="text" placeholder="Жишээ: Улаанбаатар"
                          value={form.shippingAddress.city}
                          onChange={e => { updateAddress("city", e.target.value); setShowErrors(false); }} />
                        {showErrors && !form.shippingAddress.city.trim() && (
                          <p className="co-field-error"><AlertCircle size={12} /> Хот / аймгийг оруулна уу</p>
                        )}
                      </div>
                      <div className="co-field">
                        <label className="co-label">Дэлгэрэнгүй хаяг <span className="co-req">*</span></label>
                        <textarea
                          className={`co-textarea${showErrors && !form.shippingAddress.line1.trim() ? " err" : ""}`}
                          placeholder="Байр, орц, тоот, давхар..."
                          value={form.shippingAddress.line1}
                          onChange={e => { updateAddress("line1", e.target.value); setShowErrors(false); }} />
                        {showErrors && !form.shippingAddress.line1.trim() && (
                          <p className="co-field-error"><AlertCircle size={12} /> Дэлгэрэнгүй хаягийг оруулна уу</p>
                        )}
                      </div>
                      <div className="co-field">
                        <label className="co-label">Нэмэлт тэмдэглэл</label>
                        <input className="co-input" type="text" placeholder="Жишээ: Орой 6 цагаас хойш хүргэнэ үү"
                          value={form.notes || ""} onChange={e => updateField("notes", e.target.value)} />
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Payment */}
                  {currentStep === 2 && (
                    <div>
                      <h1 className="co-form-title">Төлбөрийн хэлбэр</h1>
                      {[
                        { id: "qpay", icon: <QrCode size={28} />, name: "QPay", desc: "QR кодоор мобайл банкаар төлөх" },
                      ].map(opt => (
                        <label key={opt.id}
                          className={`co-pay-option${form.paymentMethod === opt.id ? " selected" : ""}`}>
                          <input type="radio" name="payment"
                            checked={form.paymentMethod === opt.id}
                            onChange={() => updateField("paymentMethod", opt.id as "qpay" | "bank_transfer")} />
                          <span style={{ color: form.paymentMethod === opt.id ? "#2563EB" : "#94A3B8" }}>{opt.icon}</span>
                          <div>
                            <div className="co-pay-name">{opt.name}</div>
                            <div className="co-pay-desc">{opt.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Step 4 — Review */}
                  {currentStep === 3 && (
                    <div>
                      <h1 className="co-form-title">Захиалгыг баталгаажуулах</h1>
                      <p className="co-form-subtitle">Захиалгынхаа мэдээллийг шалгаад баталгаажуулна уу</p>
                      <div className="co-review-card">
                        <h5><User size={15} style={{ color: "#2563EB" }} /> Холбоо барих</h5>
                        <div className="co-review-row">
                          <span className="lbl">Овог нэр:</span>
                          <span className="val">{form.contactName}</span>
                        </div>
                        <div className="co-review-row">
                          <span className="lbl">Утас:</span>
                          <span className="val">{form.contactPhone}</span>
                        </div>
                      </div>
                      <div className="co-review-card">
                        <h5><MapPin size={15} style={{ color: "#2563EB" }} /> Хүргэлт</h5>
                        <div className="co-review-row">
                          <span className="lbl">Бүс:</span>
                          <span className="val">{form.shippingMethod === "ub" ? "Улаанбаатар" : "Орон нутаг"}</span>
                        </div>
                        <div className="co-review-row">
                          <span className="lbl">Хаяг:</span>
                          <span className="val">{form.shippingAddress.city}{form.shippingAddress.line1 ? `, ${form.shippingAddress.line1}` : ""}</span>
                        </div>
                      </div>
                      <div className="co-review-card">
                        <h5><CreditCard size={15} style={{ color: "#2563EB" }} /> Төлбөр</h5>
                        <div className="co-review-row">
                          <span className="lbl">Хэлбэр:</span>
                          <span className="val">{form.paymentMethod === "qpay" ? "QPay" : "Дансаар шилжүүлэх"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="co-error">
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="co-actions">
                    {currentStep === 0 ? (
                      <Link href="/cart" className="co-btn-back">
                        <ArrowLeft size={16} /> Сагс руу буцах
                      </Link>
                    ) : (
                      <button type="button" className="co-btn-back" onClick={handlePrev}>
                        <ArrowLeft size={16} /> Буцах
                      </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                      <button type="button" className="co-btn-next" onClick={handleNext}>
                        Үргэлжлүүлэх <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button type="submit" className="co-btn-submit"
                        disabled={isPending || cartItems.length === 0}>
                        {isPending ? "Үүсгэж байна..." : "Захиалгыг баталгаажуулах"}
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>

                </form>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          {Sidebar}
        </div>
      </div>
    </div>
  );
}
