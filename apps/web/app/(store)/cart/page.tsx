"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, CreditCard, Truck, Shield, Gift, Sparkles, CheckCircle2 } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { formatMoney } from "@deer-drone/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useStore();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = discountApplied ? Math.floor(subtotal * 0.05) : 0; // 5% discount
  const shippingCost = subtotal >= 500000 ? 0 : 5000; // Free shipping over 500K
  const total = subtotal - discount + shippingCost;

  const freeShippingProgress = Math.min((subtotal / 500000) * 100, 100);
  const remainingForFreeShipping = Math.max(500000 - subtotal, 0);

  const handleRemove = async (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    await new Promise(resolve => setTimeout(resolve, 300));
    removeFromCart(itemId);
    setRemovingItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 my-5 text-center text-sans-serif">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-light mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4"
          style={{ width: "120px", height: "120px" }}
        >
          <ShoppingCart size={48} className="text-secondary" />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="fw-bold mb-3"
          style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}
        >
          Сагс хоосон байна
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-secondary mb-5 fs-5"
        >
          Та хүссэн бараагаа сонгон сагсандаа нэмэх боломжтой.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/products" className="dji-solid-btn d-inline-flex align-items-center gap-2" style={{ fontSize: "1.1rem", padding: "16px 36px" }}>
            <Sparkles size={20} />
            Дэлгүүр хэсэх
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white pb-5 text-sans-serif" style={{ minHeight: "100vh" }}>
      {/* Free Shipping Progress Bar */}
      {subtotal < 500000 && (
        <div className="bg-gradient-to-r from-primary to-primary-light text-white py-3 px-4">
          <div className="container">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Truck size={18} />
              <span className="fw-semibold small">
                Үнэгүй хүргэлт авахын тулд {formatMoney(remainingForFreeShipping)} үлдлээ
              </span>
            </div>
            <div className="progress" style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.3)" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${freeShippingProgress}%`,
                  backgroundColor: "white",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {subtotal >= 500000 && (
        <div className="py-3 px-4 text-white" style={{ backgroundColor: "#10b981" }}>
          <div className="container d-flex align-items-center justify-content-center gap-2">
            <CheckCircle2 size={20} />
            <span className="fw-semibold">Та үнэгүй хүргэлтийн эрхтэй боллоо! 🎉</span>
          </div>
        </div>
      )}

      <div className="container py-4">
        {/* Header */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-2">
            <h1 className="fw-bold mb-0" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}>
              Миний сагс
            </h1>
            <span
              className="badge rounded-pill text-dark"
              style={{ backgroundColor: "#f3f4f6", fontSize: "0.9rem", padding: "8px 16px" }}
            >
              {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} бүтээгдэхүүн
            </span>
          </div>
          <p className="text-secondary" style={{ fontSize: "1.1rem" }}>
            Бүх бүтээгдэхүүн баталгаатай, үнэгүй хүргэлт
          </p>
        </div>

        <div className="row g-5">
          {/* Cart Items List */}
          <div className="col-12 col-lg-8">
            <div className="mb-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: removingItems.has(item.id) ? 0 : 1,
                      x: removingItems.has(item.id) ? 100 : 0,
                    }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="py-4"
                    style={{
                      borderBottom: index !== cartItems.length - 1 ? "1px solid #e5e7eb" : "none",
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="col-12 col-sm-6 d-flex align-items-center gap-4 mb-3 mb-sm-0">
                        <Link
                          href={item.slug ? `/products/${item.slug}` : "/products"}
                          className="text-decoration-none flex-shrink-0"
                          style={{
                            width: "140px",
                            height: "140px",
                          }}
                        >
                          <div
                            className="bg-light rounded-4 p-3 d-flex align-items-center justify-content-center w-100 h-100"
                            style={{ transition: "all 0.3s ease" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-100 h-100 object-fit-contain"
                              style={{ transition: "transform 0.3s ease" }}
                            />
                          </div>
                        </Link>
                        <div className="flex-grow-1">
                          <Link
                            href={item.slug ? `/products/${item.slug}` : "/products"}
                            className="text-decoration-none"
                          >
                            <h5
                              className="fw-bold mb-2 text-dark transition-all"
                              style={{ fontSize: "1.2rem", letterSpacing: "-0.01em" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#7c3aed")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "#0f172a")}
                            >
                              {item.name}
                            </h5>
                          </Link>
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="text-secondary small">Нэгж үнэ:</span>
                            <span className="text-dark fw-bold">{formatMoney(item.price)}</span>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-link text-secondary p-0 text-decoration-none small d-flex align-items-center gap-1"
                              onClick={() => handleRemove(item.id)}
                              style={{ transition: "color 0.2s ease" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#ef4444";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "";
                              }}
                            >
                              <Trash2 size={14} /> Устгах
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-sm-3 d-flex justify-content-center">
                        <div
                          className="d-inline-flex align-items-center gap-0"
                          style={{
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            overflow: "hidden",
                            transition: "border-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#7c3aed";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                          }}
                        >
                          <button
                            className="btn btn-link text-dark p-3 border-0"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            style={{
                              minWidth: "44px",
                              minHeight: "44px",
                              opacity: item.quantity <= 1 ? 0.3 : 1,
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              if (item.quantity > 1) {
                                e.currentTarget.style.backgroundColor = "#f3f4f6";
                                e.currentTarget.style.color = "#7c3aed";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "";
                              e.currentTarget.style.color = "";
                            }}
                          >
                            <Minus size={16} />
                          </button>
                          <motion.div
                            className="text-center fw-bold"
                            key={item.quantity}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                              minWidth: "50px",
                              padding: "10px 16px",
                              backgroundColor: "#f9fafb",
                              fontSize: "1.1rem",
                            }}
                          >
                            {item.quantity}
                          </motion.div>
                          <button
                            className="btn btn-link text-dark p-3 border-0"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{
                              minWidth: "44px",
                              minHeight: "44px",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#f3f4f6";
                              e.currentTarget.style.color = "#7c3aed";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "";
                              e.currentTarget.style.color = "";
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="col-6 col-sm-3 text-end d-flex flex-column align-items-end justify-content-center">
                        <motion.h5
                          className="fw-bold text-dark mb-0"
                          key={item.quantity * item.price}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          style={{ fontSize: "1.4rem", letterSpacing: "-0.01em" }}
                        >
                          {formatMoney(item.price * item.quantity)}
                        </motion.h5>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4 pt-4" style={{ borderTop: "1px solid #e5e7eb" }}>
              <Link
                href="/products"
                className="text-decoration-none fw-medium small d-inline-flex align-items-center gap-2"
                style={{ color: "#7c3aed", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.gap = "12px";
                  e.currentTarget.style.opacity = "0.7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.gap = "8px";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <ArrowRight size={16} className="rotate-180" /> Худалдан авалтаа үргэлжлүүлэх
              </Link>
              <button
                className="btn btn-link text-danger btn-sm text-decoration-none small"
                onClick={clearCart}
                style={{ transition: "opacity 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Сагсыг хоослох
              </button>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="col-12 col-lg-4">
            <div
              className="rounded-4 p-4"
              style={{
                backgroundColor: "#f9fafb",
                border: "2px solid #e5e7eb",
                position: "sticky",
                top: "80px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#7c3aed";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(124, 58, 237, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3 className="fw-bold mb-4" style={{ fontSize: "1.5rem", letterSpacing: "-0.01em" }}>
                Захиалгын тойм
              </h3>

              {/* Discount Code */}
              <div className="mb-4">
                <label className="form-label fw-semibold small text-uppercase" style={{ letterSpacing: "0.05em" }}>
                  Хөнгөлөлтийн код
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Кодоо оруулна уу"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    disabled={discountApplied}
                    style={{
                      borderRadius: "10px",
                      border: "2px solid #e5e7eb",
                      padding: "10px 16px",
                      fontSize: "0.9rem",
                    }}
                  />
                  <button
                    onClick={() => {
                      if (discountCode === "DEER5") {
                        setDiscountApplied(true);
                      }
                    }}
                    disabled={!discountCode || discountApplied}
                    className="btn text-white px-4"
                    style={{
                      backgroundColor: "#7c3aed",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      opacity: !discountCode || discountApplied ? 0.5 : 1,
                    }}
                  >
                    {discountApplied ? <CheckCircle2 size={18} /> : "Apply"}
                  </button>
                </div>
                {discountApplied && (
                  <div className="mt-2 small text-success d-flex align-items-center gap-1">
                    <CheckCircle2 size={14} /> 5% хөнгөлөлт идэвхжлээ!
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-3 text-secondary small fw-medium">
                  <span>НИЙТ ДҮН</span>
                  <span className="text-dark fw-bold">{formatMoney(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-3 text-success small fw-medium">
                    <span className="d-flex align-items-center gap-1">
                      <Gift size={14} /> ХӨНГӨЛӨЛТ (5%)
                    </span>
                    <span className="fw-bold">-{formatMoney(discount)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-3 text-secondary small fw-medium">
                  <span className="d-flex align-items-center gap-1">
                    <Truck size={14} /> ХҮРГЭЛТ
                  </span>
                  <span className={shippingCost === 0 ? "text-success fw-bold" : "text-dark fw-bold"}>
                    {shippingCost === 0 ? "ҮНЭГҮЙ" : formatMoney(shippingCost)}
                  </span>
                </div>
                <hr style={{ borderColor: "#e5e7eb" }} />
                <div className="d-flex justify-content-between align-items-end">
                  <span className="fw-bold text-dark fs-5">ТӨЛӨХ ДҮН</span>
                  <span
                    className="fw-bold"
                    style={{ fontSize: "2.2rem", letterSpacing: "-0.02em", color: "#7c3aed" }}
                  >
                    {formatMoney(total)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="dji-solid-btn w-100 d-flex align-items-center justify-content-center gap-2"
                style={{
                  fontSize: "1.1rem",
                  padding: "16px 24px",
                  marginBottom: "24px",
                  backgroundColor: "#7c3aed",
                  borderColor: "#7c3aed",
                }}
              >
                Тооцоо хийх <ArrowRight size={18} />
              </Link>

              <div className="d-flex flex-column gap-3 pt-4" style={{ borderTop: "1px solid #e5e7eb" }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: "40px", height: "40px", backgroundColor: "#e0f2fe" }}>
                    <Truck size={18} style={{ color: "#7c3aed" }} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark mb-1" style={{ fontSize: "0.85rem" }}>
                      {shippingCost === 0 ? "Үнэгүй хүргэлт" : "Хурдан хүргэлт"}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
                      {shippingCost === 0 ? "500K+ захиалгад" : "1-3 хоног"}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: "40px", height: "40px", backgroundColor: "#e0f2fe" }}>
                    <Shield size={18} style={{ color: "#7c3aed" }} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark mb-1" style={{ fontSize: "0.85rem" }}>1 жилийн баталгаа</div>
                    <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
                      Үйлдвэрийн албан ёсны
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: "40px", height: "40px", backgroundColor: "#e0f2fe" }}>
                    <CreditCard size={18} style={{ color: "#7c3aed" }} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark mb-1" style={{ fontSize: "0.85rem" }}>Лизинг боломжтой</div>
                    <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
                      Сард ~{formatMoney(Math.floor(total / 12))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center text-muted" style={{ fontSize: "0.7rem", lineHeight: "1.6" }}>
                🔒 Төлбөр төлөгдсөний дараа таны захиалга баталгаажуулж, хүргэлтийн ажилтан тантай холбогдох болно.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
