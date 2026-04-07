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
  const discount = discountApplied ? Math.floor(subtotal * 0.05) : 0;
  const shippingCost = subtotal >= 500000 ? 0 : 5000;
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
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "80px 32px",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
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
            backgroundColor: "#F8FAFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <ShoppingCart size={48} style={{ color: "#94A3B8" }} />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#0F172A",
            margin: 0,
            marginBottom: "16px",
          }}
        >
          Сагс хоосон байна
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "1.1rem",
            color: "#64748B",
            marginBottom: "40px",
          }}
        >
          Та хүссэн бараагаа сонгон сагсандаа нэмэх боломжтой.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1.1rem",
              transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
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
            <Sparkles size={20} />
            Дэлгүүр хэсэх
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .cart-item-remove {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #64748B;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 0;
          transition: color 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cart-item-remove:hover {
          color: #EF4444;
        }
      `,
        }}
      />

      {/* Free Shipping Progress Bar */}
      {subtotal < 500000 && (
        <div
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            color: "#FFFFFF",
            padding: "16px 0",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <Truck size={18} />
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Үнэгүй хүргэлт авахын тулд {formatMoney(remainingForFreeShipping)} үлдлээ
              </span>
            </div>
            <div
              style={{
                height: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                  width: `${freeShippingProgress}%`,
                  transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Free Shipping Achieved */}
      {subtotal >= 500000 && (
        <div
          style={{
            backgroundColor: "#DCFCE7",
            padding: "16px",
            color: "#16A34A",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              maxWidth: "1280px",
              margin: "0 auto",
            }}
          >
            <CheckCircle2 size={20} />
            Та үнэгүй хүргэлтийн эрхтэй боллоо! 🎉
          </div>
        </div>
      )}

      {/* Header */}
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 32px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "8px",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "#0F172A",
            }}
          >
            Миний сагс
          </h1>
          <span
            style={{
              fontSize: "0.9rem",
              backgroundColor: "#F0F4FF",
              color: "#0F172A",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: 500,
            }}
          >
            {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} бүтээгдэхүүн
          </span>
        </div>
        <p
          style={{
            fontSize: "1rem",
            color: "#64748B",
            margin: 0,
          }}
        >
          Бүх бүтээгдэхүүн баталгаатай, үнэгүй хүргэлт
        </p>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* Cart Items List */}
        <div>
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
                style={{
                  padding: "24px 0",
                  borderBottom: index !== cartItems.length - 1 ? "1px solid #E2E8F0" : "none",
                  display: "grid",
                  gridTemplateColumns: "140px 1fr auto",
                  gap: "24px",
                  alignItems: "start",
                }}
              >
                {/* Product Image */}
                <Link
                  href={item.slug ? `/products/${item.slug}` : "/products"}
                  style={{
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      backgroundColor: "#F8FAFC",
                      borderRadius: "12px",
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(0, 0, 0, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Link
                    href={item.slug ? `/products/${item.slug}` : "/products"}
                    style={{ textDecoration: "none" }}
                  >
                    <h5
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#0F172A",
                        margin: "0 0 12px 0",
                        transition: "color 250ms",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#2563EB")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#0F172A")
                      }
                    >
                      {item.name}
                    </h5>
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span style={{ color: "#64748B" }}>Нэгж үнэ:</span>
                    <span style={{ fontWeight: 600, color: "#0F172A" }}>
                      {formatMoney(item.price)}
                    </span>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => handleRemove(item.id)}
                    style={{ width: "fit-content" }}
                  >
                    <Trash2 size={16} /> Устгах
                  </button>
                </div>

                {/* Quantity + Total */}
                <div>
                  {/* Quantity Control */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#F8FAFC",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      marginBottom: "16px",
                      transition: "border-color 250ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2563EB";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E2E8F0";
                    }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        padding: "10px 12px",
                        cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                        color: "#64748B",
                        transition: "color 250ms",
                        opacity: item.quantity <= 1 ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (item.quantity > 1) {
                          (e.target as HTMLElement).style.color = "#2563EB";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = "#64748B";
                      }}
                    >
                      <Minus size={16} />
                    </button>
                    <motion.div
                      key={item.quantity}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#F9FAFB",
                        fontWeight: 600,
                        color: "#0F172A",
                        minWidth: "50px",
                        textAlign: "center",
                        fontSize: "0.95rem",
                      }}
                    >
                      {item.quantity}
                    </motion.div>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        padding: "10px 12px",
                        cursor: "pointer",
                        color: "#64748B",
                        transition: "color 250ms",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = "#2563EB";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = "#64748B";
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <motion.div
                    key={item.quantity * item.price}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#2563EB",
                      letterSpacing: "-0.01em",
                      textAlign: "right",
                    }}
                  >
                    {formatMoney(item.price * item.quantity)}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cart Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "24px",
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <Link
              href="/products"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#2563EB",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
                transition: "opacity 250ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />
              Худалдан авалтаа үргэлжлүүлэх
            </Link>
            <button
              onClick={clearCart}
              style={{
                background: "none",
                border: "none",
                color: "#EF4444",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "opacity 250ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Сагсыг хоослох
            </button>
          </div>
        </div>

        {/* Checkout Summary Card */}
        <div
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "32px",
            position: "sticky",
            top: "24px",
            transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
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
              fontSize: "1.3rem",
              fontWeight: 700,
              marginBottom: "24px",
              color: "#0F172A",
              margin: 0,
            }}
          >
            Захиалгын тойм
          </h3>

          {/* Discount Code */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#0F172A",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "12px",
              }}
            >
              Хөнгөлөлтийн код
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Кодоо оруулна уу"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                disabled={discountApplied}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  color: "#0F172A",
                  backgroundColor: "#FFFFFF",
                  transition: "border-color 250ms",
                  outline: "none",
                }}
              />
              <button
                onClick={() => {
                  if (discountCode === "DEER5") {
                    setDiscountApplied(true);
                  }
                }}
                disabled={!discountCode || discountApplied}
                style={{
                  padding: "10px 20px",
                  backgroundColor: discountApplied ? "#10B981" : "#2563EB",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: !discountCode || discountApplied ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  opacity: !discountCode || discountApplied ? 0.6 : 1,
                  transition: "all 250ms",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {discountApplied ? (
                  <>
                    <CheckCircle2 size={16} /> Идэвхтэй
                  </>
                ) : (
                  "Нэмэх"
                )}
              </button>
            </div>
            {discountApplied && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.85rem",
                  color: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CheckCircle2 size={14} /> 5% хөнгөлөлт идэвхжлээ!
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                fontSize: "0.95rem",
                color: "#64748B",
              }}
            >
              <span>Нийт дүн</span>
              <span style={{ fontWeight: 600, color: "#0F172A" }}>
                {formatMoney(subtotal)}
              </span>
            </div>

            {discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "0.95rem",
                  color: "#10B981",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Gift size={16} /> Хөнгөлөлт (5%)
                </span>
                <span style={{ fontWeight: 600 }}>
                  -{formatMoney(discount)}
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                fontSize: "0.95rem",
                color: "#64748B",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Truck size={16} /> Хүргэлт
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: shippingCost === 0 ? "#10B981" : "#0F172A",
                }}
              >
                {shippingCost === 0 ? "Үнэгүй" : formatMoney(shippingCost)}
              </span>
            </div>

            <div
              style={{
                borderTop: "1px solid #E2E8F0",
                paddingTop: "12px",
                marginTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#0F172A",
                }}
              >
                Төлөх дүн
              </span>
              <span
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#2563EB",
                  letterSpacing: "-0.02em",
                }}
              >
                {formatMoney(total)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <Link
            href="/checkout"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1rem",
              marginBottom: "24px",
              transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
              border: "none",
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
            Тооцоо хийх <ArrowRight size={18} />
          </Link>

          {/* Trust Badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingTop: "24px",
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Truck size={20} style={{ color: "#0284C7" }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#0F172A",
                    marginBottom: "2px",
                  }}
                >
                  {shippingCost === 0 ? "Үнэгүй хүргэлт" : "Хурдан хүргэлт"}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                  }}
                >
                  {shippingCost === 0 ? "500K+ захиалгад" : "1-3 хоног"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#DCFCE7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Shield size={20} style={{ color: "#16A34A" }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#0F172A",
                    marginBottom: "2px",
                  }}
                >
                  1 жилийн баталгаа
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                  }}
                >
                  Үйлдвэрийн албан ёсны
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CreditCard size={20} style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#0F172A",
                    marginBottom: "2px",
                  }}
                >
                  Лизинг боломжтой
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                  }}
                >
                  Сард ~{formatMoney(Math.floor(total / 12))}
                </div>
              </div>
            </div>
          </div>

          {/* Security Message */}
          <div
            style={{
              marginTop: "24px",
              padding: "12px",
              backgroundColor: "#F0F4FF",
              borderRadius: "8px",
              fontSize: "0.75rem",
              color: "#2563EB",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            🔒 Төлбөр төлөгдсөний дараа таны захиалга баталгаажуулж, хүргэлтийн
            ажилтан тантай холбогдох болно.
          </div>
        </div>
      </div>
    </div>
  );
}
