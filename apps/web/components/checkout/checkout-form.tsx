"use client";

import { useState, useTransition } from "react";
import type { CheckoutPayload } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import Link from "next/link";
import { useStore } from "../../store/useStore";
import type { CartItem } from "../../store/useStore";
import { CheckCircle2, QrCode, Building2, Copy, Check, ArrowLeft, ArrowRight, User, MapPin, CreditCard, CheckCircle, Shield, Truck, Home, AlertCircle } from "lucide-react";
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
  <div
    style={{
      marginBottom: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    {steps.map((step, index) => {
      const StepIcon = step.icon;
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;

      return (
        <div
          key={step.id}
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isCompleted ? "#10B981" : isActive ? "#2563EB" : "#E2E8F0",
                color: isCompleted || isActive ? "#FFFFFF" : "#94A3B8",
                transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 2,
              }}
            >
              <StepIcon size={24} />
            </div>
            <span
              style={{
                marginTop: "12px",
                fontSize: "0.75rem",
                fontWeight: 600,
                textAlign: "center",
                color: isActive ? "#2563EB" : isCompleted ? "#10B981" : "#94A3B8",
                transition: "color 250ms",
              }}
            >
              {step.title}
            </span>
          </div>

          {index !== steps.length - 1 && (
            <div
              style={{
                height: "2px",
                flex: 1,
                backgroundColor: index < currentStep ? "#10B981" : "#E2E8F0",
                transition: "background-color 250ms",
                margin: "0 12px",
              }}
            />
          )}
        </div>
      );
    })}
  </div>
);

export function CheckoutForm() {
  const { cartItems, clearCart } = useStore();
  const subtotal = cartItems.reduce((acc: number, current: CartItem) => acc + (current.price * current.quantity), 0);

  const [form, setForm] = useState<CheckoutPayload>(defaultPayload());
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

  // Order Confirmation Screen
  if (result) {
    return (
      <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh", paddingBottom: "60px" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "80px 32px",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
            }}
          >
            <CheckCircle2 size={56} style={{ color: "#16A34A" }} />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "2.8rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: 0,
              marginBottom: "16px",
              color: "#0F172A",
            }}
          >
            Захиалга амжилттай!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: "1.1rem",
              color: "#64748B",
              marginBottom: "8px",
            }}
          >
            Таны <strong>{result.order.orderNumber}</strong> дугаартай захиалга амжилттай хүлээн авагдлаа.
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: "1rem",
              color: "#64748B",
              marginBottom: "48px",
            }}
          >
            Нийт дүн: <strong style={{ color: "#2563EB", fontSize: "1.3rem" }}>{formatMoney(result.order.total)}</strong>
          </motion.p>

          {/* Payment Instructions */}
          {result.payment.method === "qpay" && result.payment.qrCode && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                maxWidth: "500px",
                margin: "0 auto 48px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <QrCode size={24} style={{ color: "#2563EB" }} />
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    margin: 0,
                    color: "#0F172A",
                  }}
                >
                  QPay Төлбөр
                </h3>
              </div>

              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <Image
                  src={result.payment.qrCode}
                  alt="QPay QR Code"
                  width={300}
                  height={300}
                  style={{ maxWidth: "100%", height: "auto" }}
                  unoptimized
                />
              </div>

              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#64748B",
                  marginBottom: "12px",
                  lineHeight: 1.6,
                }}
              >
                Дээрх QR кодыг ямар нэг банкны мобайл аппликейшнээрээ (XacBank, Khan Bank, Mongolian Trade Bank гэх мэт) уншуулж төлбөрөө хийнэ үү.
              </p>

              {result.payment.expiresAt && (
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#94A3B8",
                    padding: "12px",
                    backgroundColor: "#F0F4FF",
                    borderRadius: "6px",
                  }}
                >
                  Хүчинтэй хугацаа: {new Date(result.payment.expiresAt).toLocaleTimeString("mn-MN")} хүртэл
                </div>
              )}
            </motion.div>
          )}

          {result.payment.method === "bank_transfer" && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                maxWidth: "500px",
                margin: "0 auto 48px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <Building2 size={24} style={{ color: "#2563EB" }} />
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    margin: 0,
                    color: "#0F172A",
                  }}
                >
                  Дансаар шилжүүлэх
                </h3>
              </div>

              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  <span style={{ color: "#64748B", fontSize: "0.9rem" }}>Данс эзэмшигч:</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>{result.payment.accountName}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  <span style={{ color: "#64748B", fontSize: "0.9rem" }}>Дансны дугаар:</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>{result.payment.accountNumber}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#64748B", fontSize: "0.9rem" }}>Гүйлгээний утга:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontWeight: 600, color: "#2563EB" }}>
                      {result.payment.reference}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(result.payment.reference || "");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {copied ? (
                        <Check size={16} style={{ color: "#10B981" }} />
                      ) : (
                        <Copy size={16} style={{ color: "#94A3B8" }} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#64748B",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Гүйлгээний утгадаа захиалгын дугаараа (дээрхээс) бичнэ үү.
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              display: "flex",
              gap: "16px",
              maxWidth: "500px",
              margin: "0 auto",
              justifyContent: "center",
            }}
          >
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 28px",
                backgroundColor: "#F8FAFC",
                color: "#2563EB",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1rem",
                border: "1px solid #E2E8F0",
                transition: "all 250ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F0F4FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F8FAFC";
              }}
            >
              <Home size={18} />
              Нүүр хуудас
            </Link>
            <Link
              href="/products"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 28px",
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1rem",
                border: "none",
                transition: "all 250ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1D4ED8";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2563EB";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Дэлгүүр үргэлжлүүлэх
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Checkout Form Main View

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 32px" }}>
        <StepIndicator currentStep={currentStep} />

        {/* Main Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Form Column */}
          <div>
            <style
              dangerouslySetInnerHTML={{
                __html: `
              .checkout-input {
                display: block;
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #E2E8F0;
                border-radius: 8px;
                font-size: 1rem;
                color: #0F172A;
                background-color: #FFFFFF;
                transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
              }
              .checkout-input:focus {
                outline: none;
                border-color: #2563EB;
                background-color: #F0F4FF;
              }
              .checkout-input:disabled {
                background-color: #F8FAFC;
                cursor: not-allowed;
                opacity: 0.6;
              }
              .checkout-label {
                display: block;
                font-size: 0.85rem;
                font-weight: 600;
                color: #0F172A;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 12px;
              }
              .required {
                color: #EF4444;
              }
              .form-group {
                margin-bottom: 28px;
              }
              .checkout-textarea {
                display: block;
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #E2E8F0;
                border-radius: 8px;
                font-size: 1rem;
                font-family: inherit;
                color: #0F172A;
                background-color: #FFFFFF;
                transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
                resize: none;
              }
              .checkout-textarea:focus {
                outline: none;
                border-color: #2563EB;
                background-color: #F0F4FF;
              }
              .checkout-select {
                display: block;
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #E2E8F0;
                border-radius: 8px;
                font-size: 1rem;
                color: #0F172A;
                background-color: #FFFFFF;
                transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
              }
              .checkout-select:focus {
                outline: none;
                border-color: #2563EB;
                background-color: #F0F4FF;
              }
              .payment-option {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px;
                border: 2px solid #E2E8F0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
              }
              .payment-option:hover {
                border-color: #2563EB;
                background-color: #F0F4FF;
              }
              .payment-option input[type="radio"] {
                cursor: pointer;
                accent-color: #2563EB;
              }
              .review-item {
                display: flex;
                justify-content: space-between;
                padding: 16px 0;
                border-bottom: 1px solid #E2E8F0;
              }
              .review-item:last-child {
                border-bottom: none;
              }
            `,
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Contact Information */}
                  {currentStep === 0 && (
                    <div>
                      <h1
                        style={{
                          fontSize: "2rem",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          margin: "0 0 8px 0",
                          color: "#0F172A",
                        }}
                      >
                        Холбоо барих мэдээлэл
                      </h1>
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#64748B",
                          marginBottom: "32px",
                        }}
                      >
                        Танд захиалгын судалгаа илгээх холбоо барих утас шаардлагатай
                      </p>

                      <div className="form-group">
                        <label className="checkout-label">
                          Овог нэр <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="checkout-input"
                          placeholder="Жишээ: Батболд Нариндаа"
                          value={form.contactName}
                          onChange={(e) => updateField("contactName", e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="checkout-label">
                          Утасны дугаар <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          className="checkout-input"
                          placeholder="99XX-XXXX эсвэл +976..."
                          value={form.contactPhone}
                          onChange={(e) => updateField("contactPhone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Shipping Address */}
                  {currentStep === 1 && (
                    <div>
                      <h1
                        style={{
                          fontSize: "2rem",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          margin: "0 0 8px 0",
                          color: "#0F172A",
                        }}
                      >
                        Хүргэлтийн хаяг
                      </h1>
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#64748B",
                          marginBottom: "32px",
                        }}
                      >
                        Бүтээгдэхүүнийг хүргэх бүрэн хаягаа оруулна уу
                      </p>

                      <div className="form-group">
                        <label className="checkout-label">
                          Хүргэлтийн бүс <span className="required">*</span>
                        </label>
                        <select
                          className="checkout-select"
                          value={form.shippingMethod}
                          onChange={(e) => updateField("shippingMethod", e.target.value as "ub" | "rural")}
                        >
                          <option value="ub">Улаанбаатар хот - 5,000₮</option>
                          <option value="rural">Орон нутаг (аймаг) - 15,000₮</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="checkout-label">
                          Хот / Аймаг <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="checkout-input"
                          placeholder="Жишээ: Улаанбаатар"
                          value={form.shippingAddress.city}
                          onChange={(e) => updateAddress("city", e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="checkout-label">
                          Дэлгэрэнгүй хаяг <span className="required">*</span>
                        </label>
                        <textarea
                          className="checkout-textarea"
                          placeholder="Орцны код, байр, тоот, давхар, өрөөний дугаар"
                          rows={4}
                          value={form.shippingAddress.line1}
                          onChange={(e) => updateAddress("line1", e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="checkout-label">Нэмэлт дэмдэглэл</label>
                        <input
                          type="text"
                          className="checkout-input"
                          placeholder="Жишээ: Орой 6 цагаас хойш бүтээгдэхүүнийг хүргэнэ үү"
                          value={form.notes || ""}
                          onChange={(e) => updateField("notes", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment Method */}
                  {currentStep === 2 && (
                    <div>
                      <h1
                        style={{
                          fontSize: "2rem",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          margin: "0 0 8px 0",
                          color: "#0F172A",
                        }}
                      >
                        Төлбөрийн хэлбэр
                      </h1>
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#64748B",
                          marginBottom: "32px",
                        }}
                      >
                        Төлбөрийн аргаа сонгоно уу
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <label
                          className="payment-option"
                          style={{
                            borderColor: form.paymentMethod === "qpay" ? "#2563EB" : undefined,
                            backgroundColor: form.paymentMethod === "qpay" ? "#F0F4FF" : undefined,
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={form.paymentMethod === "qpay"}
                            onChange={() => updateField("paymentMethod", "qpay")}
                          />
                          <QrCode
                            size={32}
                            style={{
                              color: form.paymentMethod === "qpay" ? "#2563EB" : "#94A3B8",
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#0F172A",
                                fontSize: "1rem",
                                marginBottom: "4px",
                              }}
                            >
                              QPay
                            </div>
                            <div
                              style={{
                                fontSize: "0.9rem",
                                color: "#64748B",
                              }}
                            >
                              QR кодоор мобайл банкаар төлөх
                            </div>
                          </div>
                        </label>

                        <label
                          className="payment-option"
                          style={{
                            borderColor: form.paymentMethod === "bank_transfer" ? "#2563EB" : undefined,
                            backgroundColor: form.paymentMethod === "bank_transfer" ? "#F0F4FF" : undefined,
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={form.paymentMethod === "bank_transfer"}
                            onChange={() => updateField("paymentMethod", "bank_transfer")}
                          />
                          <Building2
                            size={32}
                            style={{
                              color: form.paymentMethod === "bank_transfer" ? "#2563EB" : "#94A3B8",
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#0F172A",
                                fontSize: "1rem",
                                marginBottom: "4px",
                              }}
                            >
                              Дансаар шилжүүлэх
                            </div>
                            <div
                              style={{
                                fontSize: "0.9rem",
                                color: "#64748B",
                              }}
                            >
                              Банкны данс рүү төлбөр шилжүүлэх
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 3 && (
                    <div>
                      <h1
                        style={{
                          fontSize: "2rem",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          margin: "0 0 8px 0",
                          color: "#0F172A",
                        }}
                      >
                        Захиалгыг баталгаажуулах
                      </h1>
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#64748B",
                          marginBottom: "32px",
                        }}
                      >
                        Захиалгынхаа мэдээллийг шалгаад баталгаажуулна уу
                      </p>

                      {/* Contact Review */}
                      <div
                        style={{
                          backgroundColor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                          padding: "20px",
                          marginBottom: "24px",
                        }}
                      >
                        <h5
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#0F172A",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            margin: "0 0 16px 0",
                          }}
                        >
                          <User size={18} style={{ color: "#2563EB" }} /> Холбоо барих
                        </h5>
                        <div className="review-item">
                          <span style={{ color: "#64748B" }}>Овог нэр:</span>
                          <span style={{ fontWeight: 600 }}>{form.contactName}</span>
                        </div>
                        <div className="review-item">
                          <span style={{ color: "#64748B" }}>Утас:</span>
                          <span style={{ fontWeight: 600 }}>{form.contactPhone}</span>
                        </div>
                      </div>

                      {/* Shipping Review */}
                      <div
                        style={{
                          backgroundColor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                          padding: "20px",
                          marginBottom: "24px",
                        }}
                      >
                        <h5
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#0F172A",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            margin: "0 0 16px 0",
                          }}
                        >
                          <MapPin size={18} style={{ color: "#2563EB" }} /> Хүргэлт
                        </h5>
                        <div className="review-item">
                          <span style={{ color: "#64748B" }}>Бүс:</span>
                          <span style={{ fontWeight: 600 }}>
                            {form.shippingMethod === "ub" ? "Улаанбаатар" : "Орон нутаг"}
                          </span>
                        </div>
                        <div className="review-item">
                          <span style={{ color: "#64748B" }}>Хаяг:</span>
                          <span style={{ fontWeight: 600 }}>{form.shippingAddress.line1}</span>
                        </div>
                      </div>

                      {/* Payment Review */}
                      <div
                        style={{
                          backgroundColor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                          padding: "20px",
                        }}
                      >
                        <h5
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#0F172A",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            margin: "0 0 16px 0",
                          }}
                        >
                          <CreditCard size={18} style={{ color: "#2563EB" }} /> Төлбөр
                        </h5>
                        <div className="review-item">
                          <span style={{ color: "#64748B" }}>Төлбөрийн хэлбэр:</span>
                          <span style={{ fontWeight: 600 }}>
                            {form.paymentMethod === "qpay" ? "QPay" : "Дансаар шилжүүлэх"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div
                      style={{
                        backgroundColor: "#FEE2E2",
                        border: "1px solid #FECACA",
                        borderRadius: "8px",
                        padding: "16px",
                        marginTop: "24px",
                        color: "#991B1B",
                        display: "flex",
                        gap: "12px",
                      }}
                    >
                      <AlertCircle size={18} style={{ flexShrink: 0 }} />
                      <div>{error}</div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: currentStep > 0 ? "space-between" : "flex-end",
                      gap: "16px",
                      marginTop: "48px",
                    }}
                  >
                    {currentStep > 0 && (
                      <button
                        type="button"
                        onClick={handlePrevious}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px 28px",
                          backgroundColor: "#F8FAFC",
                          color: "#2563EB",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "1rem",
                          cursor: "pointer",
                          transition: "all 250ms",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#F0F4FF";
                          e.currentTarget.style.borderColor = "#2563EB";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#F8FAFC";
                          e.currentTarget.style.borderColor = "#E2E8F0";
                        }}
                      >
                        <ArrowLeft size={18} /> Буцах
                      </button>
                    )}

                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!validateStep()}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          padding: "12px 28px",
                          backgroundColor: "#2563EB",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "1rem",
                          cursor: !validateStep() ? "not-allowed" : "pointer",
                          opacity: !validateStep() ? 0.5 : 1,
                          transition: "all 250ms",
                        }}
                        onMouseEnter={(e) => {
                          if (validateStep()) {
                            e.currentTarget.style.backgroundColor = "#1D4ED8";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#2563EB";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        Дараагийн <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          padding: "12px 28px",
                          backgroundColor: "#2563EB",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "1rem",
                          cursor: isPending || cartItems.length === 0 ? "not-allowed" : "pointer",
                          opacity: isPending || cartItems.length === 0 ? 0.5 : 1,
                          transition: "all 250ms",
                        }}
                        onMouseEnter={(e) => {
                          if (!isPending && cartItems.length > 0) {
                            e.currentTarget.style.backgroundColor = "#1D4ED8";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#2563EB";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                        disabled={isPending || cartItems.length === 0}
                      >
                        {isPending ? "Захиалга үүсгэж байна..." : `Захиалгыг баталгаажуулах`}
                        <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky Order Summary Sidebar */}
          <div
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "28px",
              position: "sticky",
              top: "24px",
              height: "fit-content",
              transition: "all 250ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2563EB";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(37, 99, 235, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "20px",
                color: "#0F172A",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Shield size={18} style={{ color: "#2563EB" }} /> Захиалгын тойм
            </h3>

            {/* Items List */}
            <div
              style={{
                marginBottom: "20px",
                maxHeight: "350px",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              {mounted && cartItems.length > 0 ? (
                cartItems.map((item: CartItem) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "16px",
                      paddingBottom: "16px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    <div
                      style={{
                        width: "70px",
                        height: "70px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        padding: "8px",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: "contain", padding: "8px" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h6
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#0F172A",
                          margin: "0 0 6px 0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </h6>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#64748B",
                          marginBottom: "4px",
                        }}
                      >
                        {item.quantity} ш × {formatMoney(item.price)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#2563EB",
                        }}
                      >
                        {formatMoney(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#64748B",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Сагс хоосон байна
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div style={{ paddingTop: "16px", borderTop: "1px solid #E2E8F0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ color: "#64748B" }}>Нийт дүн:</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>
                  {mounted ? formatMoney(subtotal) : "₮0"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  fontSize: "0.9rem",
                }}
              >
                <span
                  style={{
                    color: "#64748B",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Truck size={14} /> Хүргэлт:
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: "#0F172A",
                  }}
                >
                  {formatMoney(shippingCost)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "16px",
                  borderTop: "1px solid #E2E8F0",
                  fontSize: "1.1rem",
                }}
              >
                <span style={{ fontWeight: 600, color: "#0F172A" }}>Төлөх дүн:</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: "#2563EB",
                    fontSize: "1.5rem",
                  }}
                >
                  {mounted ? formatMoney(total) : "₮0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
