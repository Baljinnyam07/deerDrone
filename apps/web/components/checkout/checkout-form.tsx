"use client";

import { useState, useTransition, useEffect } from "react";
import type { CheckoutPayload } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import Link from "next/link";
import { useStore } from "../../store/useStore";
import type { CartItem } from "../../store/useStore";
import { CheckCircle2, QrCode, Building2, Copy, Check, ArrowLeft, ArrowRight, User, MapPin, CreditCard, CheckCircle, Shield, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

interface OrderResult {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
  };
  payment: {
    method: string;
    invoiceUrl?: string;
    qrCode?: string;
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
  { id: "review", title: "Баталгаажуулах", icon: CheckCircle },
];

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="mb-5">
    <div className="d-flex align-items-center justify-content-between position-relative">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={step.id} className="d-flex align-items-center flex-fill">
            <div className="d-flex flex-column align-items-center position-relative" style={{ flex: 1 }}>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: isCompleted ? "#10b981" : isActive ? "#7c3aed" : "#e5e7eb",
                  color: isCompleted || isActive ? "white" : "#9ca3af",
                  transition: "all 0.3s ease",
                  zIndex: 2,
                }}
              >
                <StepIcon size={24} />
              </div>
              <span
                className="mt-2 small fw-semibold text-center"
                style={{
                  color: isActive ? "#7c3aed" : isCompleted ? "#10b981" : "#9ca3af",
                  fontSize: "0.75rem",
                }}
              >
                {step.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
    <div className="d-flex mt-3" style={{ gap: "0" }}>
      {steps.map((_, index) => (
        <div
          key={index}
          className="flex-fill"
          style={{
            height: "3px",
            backgroundColor: index < currentStep ? "#10b981" : "#e5e7eb",
            transition: "background-color 0.3s ease",
            marginLeft: index === 0 ? "28px" : "0",
            marginRight: index === steps.length - 1 ? "28px" : "0",
          }}
        />
      ))}
    </div>
  </div>
);

export function CheckoutForm() {
  const { cartItems, clearCart } = useStore();
  const subtotal = cartItems.reduce((acc: number, current: CartItem) => acc + (current.price * current.quantity), 0);

  const [form, setForm] = useState<CheckoutPayload>(defaultPayload());
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return form.contactName.trim() && form.contactPhone.trim();
      case 1:
        return form.shippingAddress.line1.trim() && form.shippingAddress.city.trim();
      case 2:
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Сагс хоосон байна.");
      return;
    }

    startTransition(async () => {
      try {
        const payload: CheckoutPayload = {
          ...form,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        };

        const response = await fetch("/api/v1/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Алдаа гарлаа. Дахин оролдоно уу.");
          return;
        }

        setResult(data as OrderResult);
        clearCart();
      } catch {
        setError("Сүлжээний алдаа. Холболтоо шалгаад дахин оролдоно уу.");
      }
    });
  }

  const shippingCost = form.shippingMethod === "ub" ? 5000 : 15000;
  const total = subtotal + shippingCost;

  if (result) {
    return (
      <div className="bg-white pb-5 text-sans-serif">
        <div className="container py-5 my-3">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mb-4 mx-auto"
                style={{ width: "100px", height: "100px" }}
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="fw-bold mb-3"
                style={{ fontSize: "2.2rem" }}
              >
                Захиалга амжилттай!
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-secondary fs-5 mb-2"
              >
                Таны <strong>{result.order.orderNumber}</strong> дугаартай захиалга хүлээн авагдлаа.
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-secondary mb-5"
              >
                Нийт дүн: <strong className="text-primary">{formatMoney(result.order.total)}</strong>
              </motion.p>

              {result.payment.method === "qpay" && result.payment.qrCode && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="card border-0 shadow-sm rounded-4 p-4 mb-4 mx-auto"
                  style={{ maxWidth: "400px" }}
                >
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <QrCode size={20} className="text-primary" />
                    <h5 className="fw-bold mb-0">QPay Төлбөр</h5>
                  </div>
                  <div className="bg-light rounded-3 p-4 mb-3">
                    <Image
                      src={result.payment.qrCode}
                      alt="QPay QR Code"
                      width={260}
                      height={260}
                      className="w-100 h-auto"
                      unoptimized
                    />
                  </div>
                  <p className="text-secondary small mb-2">
                    Дээрх QR кодыг банкны аппликейшнээрээ уншуулж төлбөрөө хийнэ үү.
                  </p>
                  {result.payment.expiresAt && (
                    <p className="text-muted small">
                      Хүчинтэй хугацаа: {new Date(result.payment.expiresAt).toLocaleTimeString("mn-MN")} хүртэл
                    </p>
                  )}
                </motion.div>
              )}

              {result.payment.method === "bank_transfer" && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="card border-0 shadow-sm rounded-4 p-4 mb-4 mx-auto"
                  style={{ maxWidth: "400px" }}
                >
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Building2 size={20} className="text-primary" />
                    <h5 className="fw-bold mb-0">Дансаар шилжүүлэх</h5>
                  </div>
                  <div className="bg-light rounded-3 p-3 mb-2">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary small">Данс эзэмшигч:</span>
                      <span className="fw-bold">{result.payment.accountName}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary small">Дансны дугаар:</span>
                      <span className="fw-bold">{result.payment.accountNumber}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary small">Гүйлгээний утга:</span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-primary">{result.payment.reference}</span>
                        <button
                          className="btn btn-link p-0 text-secondary"
                          onClick={() => {
                            navigator.clipboard.writeText(result.payment.reference || "");
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary small mb-0">
                    Гүйлгээний утгадаа захиалгын дугаараа бичнэ үү.
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="d-flex justify-content-center gap-3 mt-4"
              >
                <Link href="/" className="btn btn-outline-dark px-5 py-3 rounded-pill fw-bold">
                  Нүүр хуудас
                </Link>
                <Link href="/products" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow">
                  Дэлгүүр үргэлжлүүлэх
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pb-5 text-sans-serif">
      <div className="container py-4">
        <StepIndicator currentStep={currentStep} />

        <div className="row g-5">
          <div className="col-12 col-lg-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit}>
                  {currentStep === 0 && (
                    <div className="mb-5">
                      <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem", letterSpacing: "-0.01em" }}>
                        Холбоо барих мэдээлэл
                      </h1>
                      <p className="text-secondary mb-4">Танд захиалгын мэдээллийг хүргэх холбоо барих утас шаардлагатай</p>

                      <div className="mb-4">
                        <label className="form-label fw-semibold small text-uppercase" style={{ letterSpacing: "0.05em" }}>
                          ОВОГ НЭР <span className="text-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Жишээ: Батболд"
                          style={{ fontSize: "1rem", borderRadius: "12px", border: "2px solid #e5e7eb", padding: "14px 18px" }}
                          value={form.contactName}
                          onChange={(e) => updateField("contactName", e.target.value)}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold small text-uppercase" style={{ letterSpacing: "0.05em" }}>
                          УТАСНЫ ДУГААР <span className="text-danger">*</span>
                        </label>
                        <input
                          required
                          type="tel"
                          className="form-control form-control-lg"
                          placeholder="99XX-XXXX"
                          style={{ fontSize: "1rem", borderRadius: "12px", border: "2px solid #e5e7eb", padding: "14px 18px" }}
                          value={form.contactPhone}
                          onChange={(e) => updateField("contactPhone", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="mb-5">
                      <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem", letterSpacing: "-0.01em" }}>
                        Хүргэлтийн хаяг
                      </h1>
                      <p className="text-secondary mb-4">Бүтээгдэхүүнийг хүргэх хаягаа оруулна уу</p>

                      <div className="mb-4">
                        <label className="form-label fw-semibold small text-uppercase" style={{ letterSpacing: "0.05em" }}>
                          БҮС <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select form-select-lg"
                          value={form.shippingMethod}
                          onChange={(e) => updateField("shippingMethod", e.target.value as "ub" | "rural")}
                          style={{ borderRadius: "12px", border: "2px solid #e5e7eb", padding: "14px 18px", fontSize: "1rem" }}
                        >
                          <option value="ub">Улаанбаатар - {formatMoney(5000)}</option>
                          <option value="rural">Орон нутаг - {formatMoney(15000)}</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold small text-uppercase" style={{ letterSpacing: "0.05em" }}>
                          ХОТ / АЙМАГ <span className="text-danger">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          className="form-control form-control-lg"
                          style={{ borderRadius: "12px", border: "2px solid #e5e7eb", padding: "14px 18px", fontSize: "1rem" }}
                          value={form.shippingAddress.city}
                          onChange={(e) => updateAddress("city", e.target.value)}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold small text-uppercase" style={{ letterSpacing: "0.05em" }}>
                          ДЭЛГЭРЭНГҮЙ ХАЯГ <span className="text-danger">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          className="form-control"
                          placeholder="Орцны код, байр, тоот..."
                          style={{ borderRadius: "12px", border: "2px solid #e5e7eb", padding: "14px 18px", fontSize: "1rem" }}
                          value={form.shippingAddress.line1}
                          onChange={(e) => updateAddress("line1", e.target.value)}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold small text-uppercase" style={{ letterSpacing: "0.05em" }}>
                          НЭМЭЛТ ТЭМДЭГЛЭЛ
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Жишээ: Орой 18:00-аас хойш"
                          style={{ borderRadius: "12px", border: "2px solid #e5e7eb", padding: "14px 18px", fontSize: "1rem" }}
                          value={form.notes || ""}
                          onChange={(e) => updateField("notes", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="mb-5">
                      <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem", letterSpacing: "-0.01em" }}>
                        Төлбөрийн хэлбэр
                      </h1>
                      <p className="text-secondary mb-4">Төлдөг аргаа сонгоно уу</p>

                      <div className="d-flex flex-column gap-3">
                        <label
                          className={`d-flex align-items-center gap-3 p-4 rounded-4 border-2 cursor-pointer transition-all ${
                            form.paymentMethod === "qpay" ? "border-primary bg-light" : "border"
                          }`}
                          style={{ transition: "all 0.2s ease" }}
                        >
                          <input
                            type="radio"
                            className="btn-check"
                            name="payment"
                            checked={form.paymentMethod === "qpay"}
                            onChange={() => updateField("paymentMethod", "qpay")}
                          />
                          <QrCode size={32} className={form.paymentMethod === "qpay" ? "text-primary" : "text-secondary"} />
                          <div className="flex-fill">
                            <div className="fw-bold text-dark">QPay</div>
                            <div className="small text-secondary">QR кодоор шууд төлөх</div>
                          </div>
                          {form.paymentMethod === "qpay" && <CheckCircle size={20} className="text-primary" />}
                        </label>

                        <label
                          className={`d-flex align-items-center gap-3 p-4 rounded-4 border-2 cursor-pointer transition-all ${
                            form.paymentMethod === "bank_transfer" ? "border-primary bg-light" : "border"
                          }`}
                          style={{ transition: "all 0.2s ease" }}
                        >
                          <input
                            type="radio"
                            className="btn-check"
                            name="payment"
                            checked={form.paymentMethod === "bank_transfer"}
                            onChange={() => updateField("paymentMethod", "bank_transfer")}
                          />
                          <Building2 size={32} className={form.paymentMethod === "bank_transfer" ? "text-primary" : "text-secondary"} />
                          <div className="flex-fill">
                            <div className="fw-bold text-dark">Дансаар шилжүүлэх</div>
                            <div className="small text-secondary">Банкны дансаар төлөх</div>
                          </div>
                          {form.paymentMethod === "bank_transfer" && <CheckCircle size={20} className="text-primary" />}
                        </label>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="mb-5">
                      <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem", letterSpacing: "-0.01em" }}>
                        Захиалгыг баталгаажуулах
                      </h1>
                      <p className="text-secondary mb-4">Захиалгынхаа мэдээллийг шалгаад баталгаажуулна уу</p>

                      <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: "#f9fafb", border: "2px solid #e5e7eb" }}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                          <User size={18} className="text-primary" /> Холбоо барих
                        </h5>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-secondary">Нэр:</span>
                          <span className="fw-bold">{form.contactName}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-secondary">Утас:</span>
                          <span className="fw-bold">{form.contactPhone}</span>
                        </div>
                      </div>

                      <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: "#f9fafb", border: "2px solid #e5e7eb" }}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                          <MapPin size={18} className="text-primary" /> Хүргэлт
                        </h5>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-secondary">Бүс:</span>
                          <span className="fw-bold">{form.shippingMethod === "ub" ? "Улаанбаатар" : "Орон нутаг"}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-secondary">Хаяг:</span>
                          <span className="fw-bold">{form.shippingAddress.line1}</span>
                        </div>
                      </div>

                      <div className="rounded-4 p-4 mb-4" style={{ backgroundColor: "#f9fafb", border: "2px solid #e5e7eb" }}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                          <CreditCard size={18} className="text-primary" /> Төлбөр
                        </h5>
                        <div className="d-flex justify-content-between">
                          <span className="text-secondary">Төлбөрийн хэлбэр:</span>
                          <span className="fw-bold">{form.paymentMethod === "qpay" ? "QPay" : "Дансаар"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="d-flex justify-content-between mt-5">
                    {currentStep > 0 ? (
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="btn btn-outline-secondary rounded-pill px-4 py-3 fw-semibold d-flex align-items-center gap-2"
                      >
                        <ArrowLeft size={18} /> Буцах
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!validateStep()}
                        className="btn text-white rounded-pill px-4 py-3 fw-semibold d-flex align-items-center gap-2"
                        style={{ backgroundColor: "#7c3aed", opacity: !validateStep() ? 0.5 : 1 }}
                      >
                        Дараагийн <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn text-white rounded-pill px-4 py-3 fw-semibold d-flex align-items-center gap-2 shadow-lg"
                        style={{ backgroundColor: "#7c3aed" }}
                        disabled={isPending || cartItems.length === 0}
                      >
                        {isPending ? "Захиалга үүсгэж байна..." : `Захиалгыг баталгаажуулах — ${mounted ? formatMoney(total) : ""}`}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="col-12 col-lg-5">
            <div
              className="rounded-4 p-4"
              style={{ backgroundColor: "#f9fafb", border: "2px solid #e5e7eb", position: "sticky", top: "120px" }}
            >
              <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <Shield size={20} className="text-primary" /> Бүтээгдэхүүнүүд
              </h4>
              <div className="mb-4 overflow-auto" style={{ maxHeight: "400px" }}>
                {mounted && cartItems.map((item: CartItem) => (
                  <div key={item.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <div className="bg-white rounded-3 p-2 d-flex align-items-center justify-content-center overflow-hidden" style={{ width: "70px", height: "70px", flexShrink: 0, position: "relative" }}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-fit-contain p-2"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-dark mb-1 small text-truncate" style={{ maxWidth: "200px" }}>{item.name}</h6>
                      <div className="small text-secondary">{item.quantity} ш × {formatMoney(item.price)}</div>
                    </div>
                    <div className="fw-bold">{formatMoney(item.price * item.quantity)}</div>
                  </div>
                ))}
                {mounted && cartItems.length === 0 && (
                  <p className="text-secondary text-center py-4">Сагс хоосон байна</p>
                )}
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-3 text-secondary small fw-medium">
                  <span>НИЙТ ДҮН</span>
                  <span className="text-dark">{mounted ? formatMoney(subtotal) : formatMoney(0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4 text-secondary small fw-medium">
                  <span className="d-flex align-items-center gap-1"><Truck size={14} /> ХҮРГЭЛТ</span>
                  <span className="text-dark">{formatMoney(shippingCost)}</span>
                </div>
                <hr style={{ borderColor: "#e5e7eb" }} />
                <div className="d-flex justify-content-between align-items-end pt-3">
                  <span className="fw-bold text-dark fs-5">ТӨЛӨХ ДҮН</span>
                  <span className="fw-bold fs-3" style={{ color: "#7c3aed" }}>{mounted ? formatMoney(total) : formatMoney(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
