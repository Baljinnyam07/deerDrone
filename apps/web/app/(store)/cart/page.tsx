"use client";

import Link from "next/link";
import {
  Trash2, Plus, Minus, ArrowRight, ShoppingCart,
  CreditCard, Truck, Shield, Gift, Sparkles, CheckCircle2,
} from "lucide-react";
import { useStore } from "../../../store/useStore";
import { formatMoney } from "@deer-drone/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  .cart-page {
    background: #fff;
    min-height: 100vh;
    padding-bottom: 80px;
    overflow-x: hidden;
    margin-top: 40px;
  }

  /* ── Free shipping banner ── */
  .cart-banner {
    padding: 14px 16px;
    color: #fff;
  }
  .cart-banner-inner {
    max-width: 1200px; margin: 0 auto;
  }
  .cart-banner-text {
    display: flex; align-items: center; gap: 10px;
    font-weight: 600; font-size: 0.9rem; margin-bottom: 10px;
  }
  .cart-banner-bar {
    height: 5px; background: rgba(255,255,255,0.3);
    border-radius: 99px; overflow: hidden;
  }
  .cart-banner-fill {
    height: 100%; background: #fff;
    border-radius: 99px; transition: width 500ms ease;
  }
  .cart-free-badge {
    background: #DCFCE7; color: #16A34A;
    padding: 12px 16px;
    display: flex; align-items: center; justify-content: center;
    gap: 8px; font-weight: 600; font-size: 0.9rem;
  }

  /* ── Page wrap ── */
  .cart-wrap {
    max-width: 1200px; margin: 0 auto;
    padding: 32px 16px 0;
  }

  /* ── Page header ── */
  .cart-header {
    display: flex; align-items: center;
    gap: 12px; margin-bottom: 6px; flex-wrap: wrap;
  }
  .cart-title {
    font-size: 1.8rem; font-weight: 700;
    letter-spacing: -0.02em; color: #0F172A; margin: 0;
  }
  .cart-badge {
    background: #EEF2FF; color: #2563EB;
    font-size: 0.82rem; font-weight: 600;
    padding: 4px 14px; border-radius: 99px;
    white-space: nowrap;
  }
  .cart-subtitle {
    font-size: 0.9rem; color: #64748B;
    margin: 0 0 28px 0;
  }

  /* ── Grid ── */
  .cart-grid {
    display: block;
    width: 100%;
  }

  .checkout-btn-small {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 20px;
    background: #2563EB; color: #fff;
    border-radius: 8px; font-weight: 600; font-size: 0.95rem;
    text-decoration: none;
    transition: all 200ms;
  }
  .checkout-btn-small:hover { background: #1D4ED8; }

  /* ── Item list ── */
  .cart-item {
    display: grid;
    grid-template-columns: 100px 1fr auto;
    gap: 16px;
    align-items: start;
    padding: 20px 0;
    border-bottom: 1px solid #F1F5F9;
  }
  .cart-item:last-of-type { border-bottom: none; }

  .cart-item-img {
    width: 100px; height: 100px;
    background: #F8FAFC; border-radius: 10px;
    border: 1px solid #E2E8F0;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; text-decoration: none;
    transition: transform 200ms, box-shadow 200ms;
    flex-shrink: 0;
  }
  .cart-item-img:hover {
    transform: scale(1.04);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
  .cart-item-img img {
    width: 100%; height: 100%; object-fit: contain; padding: 8px;
  }

  .cart-item-name {
    font-size: 1rem; font-weight: 600; color: #0F172A;
    margin: 0 0 6px 0; transition: color 200ms;
    text-decoration: none; display: block;
  }
  .cart-item-name:hover { color: #2563EB; }
  .cart-item-unit {
    font-size: 0.82rem; color: #64748B; margin-bottom: 10px;
  }
  .cart-remove {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.8rem; color: #EF4444;
    background: #FFF1F0; border: 1px solid #FEE2E2;
    border-radius: 6px; cursor: pointer;
    padding: 5px 10px; transition: all 200ms;
  }
  .cart-remove:hover { background: #FEE2E2; color: #DC2626; border-color: #FCA5A5; }

  /* Qty control */
  .cart-qty {
    display: inline-flex; align-items: center;
    border: 1.5px solid #E2E8F0; border-radius: 8px;
    background: #F8FAFC; overflow: hidden;
    transition: border-color 200ms;
  }
  .cart-qty:hover { border-color: #2563EB; }
  .cart-qty-btn {
    border: none; background: transparent;
    padding: 8px 11px; cursor: pointer;
    color: #64748B; transition: color 200ms;
    display: flex; align-items: center;
  }
  .cart-qty-btn:hover { color: #2563EB; }
  .cart-qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .cart-qty-val {
    min-width: 36px; text-align: center;
    font-weight: 700; font-size: 0.95rem; color: #0F172A;
    padding: 8px 0;
  }
  .cart-item-total {
    font-size: 1.1rem; font-weight: 700; color: #2563EB;
    text-align: right; white-space: nowrap;
    margin-top: 8px;
  }

  /* right col of item */
  .cart-item-right {
    display: flex; flex-direction: column;
    align-items: flex-end; gap: 8px;
  }

  .cart-header-actions {
    display: flex; align-items: center; gap: 16px;
  }

  /* ── Bottom nav ── */
  .cart-nav {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 20px; flex-wrap: wrap; gap: 12px;
  }
  .cart-continue {
    display: inline-flex; align-items: center; gap: 8px;
    color: #2563EB; text-decoration: none;
    font-weight: 600; font-size: 0.9rem;
    border: 1.5px solid #2563EB; border-radius: 8px;
    padding: 6px 16px; background: #EEF2FF;
    transition: all 200ms;
  }
  .cart-continue:hover { background: #DBEAFE; }
  .cart-clear {
    background: none; border: 1.5px solid #EF4444;
    color: #EF4444; font-weight: 600; font-size: 0.9rem;
    cursor: pointer; border-radius: 8px;
    padding: 6px 16px; transition: all 200ms;
  }
  .cart-clear:hover { background: #FFF1F0; }

  /* ── Sidebar ── */
  .cart-summary {
    position: sticky; top: 90px;
    padding: 12px 0 0 0;
  }
  .cart-summary-title {
    display: none;
  }

  /* Discount */
  .discount-label {
    font-size: 0.75rem; font-weight: 700; color: #0F172A;
    text-transform: uppercase; letter-spacing: 0.06em;
    display: block; margin-bottom: 8px;
  }
  .discount-row {
    display: flex; gap: 8px; margin-bottom: 8px;
  }
  .discount-input {
    flex: 1; padding: 10px 14px;
    border: 1.5px solid #E2E8F0; border-radius: 8px;
    font-size: 0.9rem; color: #0F172A;
    background: #fff; outline: none; min-width: 0;
    transition: border-color 200ms;
  }
  .discount-input:focus { border-color: #2563EB; }
  .discount-btn {
    padding: 10px 16px; border-radius: 8px; border: none;
    font-weight: 600; font-size: 0.88rem;
    cursor: pointer; transition: all 200ms;
    white-space: nowrap;
    display: flex; align-items: center; gap: 6px;
  }

  /* Totals */
  .summary-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.9rem; color: #64748B; margin-bottom: 10px;
  }
  .summary-row span:last-child { font-weight: 600; color: #0F172A; }
  .summary-divider {
    display: none;
  }
  .summary-total {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 24px;
  }
  .summary-total-label { font-size: 1.1rem; font-weight: 500; color: #64748B; }
  .summary-total-amount {
    font-size: 2rem; font-weight: 700; color: #0F172A;
    letter-spacing: -0.03em;
  }
  .checkout-btn {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 18px 24px;
    background: #2563EB;
    color: #fff;
    border-radius: 99px;
    font-weight: 700; font-size: 1.05rem; letter-spacing: 0.02em;
    text-decoration: none; margin-bottom: 20px;
    position: relative; overflow: hidden;
    box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
    transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .checkout-btn::after {
    content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: skewX(-20deg); transition: all 500ms;
  }
  .checkout-btn:hover { 
    background: #1D4ED8;
    transform: translateY(-3px); 
    box-shadow: 0 15px 35px rgba(37, 99, 235, 0.35);
  }
  .checkout-btn:hover::after { left: 150%; }
  .checkout-btn .btn-arrow { transition: transform 300ms; }
  .checkout-btn:hover .btn-arrow { transform: translateX(5px); }

  /* Trust badges */
  .trust-list {
    display: flex; flex-direction: column;
    gap: 14px; border-top: 1px solid #E2E8F0; padding-top: 20px;
  }
  .trust-item {
    display: flex; align-items: center; gap: 12px;
  }
  .trust-icon {
    width: 38px; height: 38px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .trust-name { font-size: 0.85rem; font-weight: 600; color: #0F172A; }
  .trust-desc { font-size: 0.75rem; color: #64748B; }
  .security-note {
    margin-top: 16px; padding: 10px 14px;
    background: #EEF2FF; border-radius: 8px;
    font-size: 0.75rem; color: #3730A3;
    text-align: center; line-height: 1.6;
  }

  /* ── Empty state ── */
  .cart-empty {
    min-height: 70vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 40px 16px;
  }
  .cart-empty-icon {
    width: 100px; height: 100px; border-radius: 50%;
    background: #F1F5F9; display: flex;
    align-items: center; justify-content: center;
    margin: 0 auto 24px;
  }
  .cart-empty h2 {
    font-size: 2rem; font-weight: 800; color: #0F172A;
    letter-spacing: -0.02em; margin: 0 0 12px 0;
  }
  .cart-empty p { font-size: 1rem; color: #64748B; margin: 0 0 32px 0; }
  .cart-empty-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; background: #2563EB; color: #fff;
    border-radius: 10px; font-weight: 700; font-size: 1rem;
    text-decoration: none; transition: all 200ms;
  }
    .cart-empty-btn:hover { background: #1D4ED8; transform: translateY(-2px); }

  .mobile-bottom-checkout {
    display: none;
    margin-top: 24px;
  }

  /* ─── TABLET ≤ 1024px ─── */
  @media (max-width: 1024px) {
    .cart-grid {
      display: block;
    }
    .cart-summary {
      position: static;
      order: -1;
      padding-top: 0;
    }
    .mobile-bottom-checkout {
      display: block;
    }
  }

  /* ─── MOBILE ≤ 640px ─── */
  @media (max-width: 640px) {
    .cb-fab { bottom: 90px !important; }
    .cb-panel { bottom: 148px !important; }

    .cart-wrap { padding: 20px 14px 100px; }
    .cart-title { font-size: 1.4rem; }

    .cart-item {
      grid-template-columns: 80px 1fr;
      grid-template-rows: auto auto;
      gap: 12px;
      padding: 24px 0;
    }
    .cart-item-right {
      grid-column: 1 / -1;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background: #F8FAFC;
      padding: 12px 16px;
      border-radius: 12px;
      margin-top: 4px;
    }
    .cart-item-img { width: 80px; height: 80px; }
    .cart-item-name { font-size: 0.95rem; }

    .cart-nav { flex-direction: column; align-items: flex-start; }

    .cart-header-actions {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 16px;
      justify-content: space-between;
      border-top: 1px solid #E2E8F0;
      box-shadow: 0 -10px 40px rgba(0,0,0,0.08);
      z-index: 1000;
    }
    .cart-header-actions > div { text-align: left !important; }
    .cart-header-actions .checkout-btn-small { 
      padding: 14px 24px; font-size: 1rem; width: auto; 
    }
    
    .mobile-bottom-checkout { display: none !important; } /* Hide the redundant button since we now have a sticky bar */

    .cart-summary { padding: 0 0 16px 0; }
    .summary-total-amount { font-size: 1.75rem; }

    .discount-row { flex-wrap: wrap; }
    .discount-btn { flex: 1; justify-content: center; }
  }
`;

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useStore();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = discountApplied ? Math.floor(subtotal * 0.05) : 0;
  const shippingCost = subtotal >= 500000 ? 0 : 5000;
  const total = subtotal; // Shipping is calculated properly in the checkout stage
  const freeShippingProgress = Math.min((subtotal / 500000) * 100, 100);
  const remaining = Math.max(500000 - subtotal, 0);

  const handleRemove = async (id: string) => {
    setRemovingItems(p => new Set(p).add(id));
    await new Promise(r => setTimeout(r, 300));
    removeFromCart(id);
    setRemovingItems(p => { const n = new Set(p); n.delete(id); return n; });
  };

  /* ── Empty state ── */
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="cart-empty">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }} className="cart-empty-icon">
            <ShoppingCart size={44} style={{ color: "#94A3B8" }} />
          </motion.div>
          <motion.h2 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            Сагс хоосон байна
          </motion.h2>
          <motion.p initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            Та хүссэн бараагаа сонгон сагсандаа нэмэх боломжтой.
          </motion.p>
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
            <Link href="/products" className="cart-empty-btn">
              <Sparkles size={18} /> Дэлгүүр хэсэх
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Trust badges data ── */
  const badges = [
    { icon: <Truck size={18} style={{ color: "#0284C7" }} />, bg: "#DBEAFE",
      name: shippingCost === 0 ? "Үнэгүй хүргэлт" : "Хурдан хүргэлт",
      desc: shippingCost === 0 ? "500К+ захиалгад" : "1–3 хоног" },
    { icon: <Shield size={18} style={{ color: "#16A34A" }} />, bg: "#DCFCE7",
      name: "1 жилийн баталгаа", desc: "Үйлдвэрийн албан ёсны" },
    { icon: <CreditCard size={18} style={{ color: "#F59E0B" }} />, bg: "#FEF3C7",
      name: "Лизинг боломжтой", desc: `Сард ~${formatMoney(Math.floor(total / 12))}` },
  ];

  // Order summary sidebar (reused both positions)
  const Summary = (
    <div className="cart-summary">
      <div className="summary-total">
        <span className="summary-total-label">Нийт дүн</span>
        <span className="summary-total-amount">{formatMoney(total)}</span>
      </div>

      <Link href="/checkout" className="checkout-btn">
        <span style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "8px" }}>
          Тооцоо хийх
          <svg className="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </span>
      </Link>
    </div>
  );

  return (
    <div className="cart-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cart-wrap">
        {/* Header */}
        <div className="cart-header" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h1 className="cart-title">Миний сагс</h1>
          </div>

          <div className="cart-header-actions">
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500, marginBottom: "2px" }}>Нийт төлөх:</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{formatMoney(total)}</div>
            </div>
            <Link href="/checkout" className="checkout-btn-small">
              Тооцоо хийх
            </Link>
          </div>
        </div>

        <div className="cart-grid">
          {/* ── Left: items ── */}
          <div>
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: removingItems.has(item.id) ? 0 : 1, x: removingItems.has(item.id) ? 60 : 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.28 }}
                  className="cart-item"
                >
                  {/* Image */}
                  <Link href={item.slug ? `/products/${item.slug}` : "/products"} className="cart-item-img" style={{ position: "relative" }}>
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Link>

                  {/* Details */}
                  <div>
                    <Link href={item.slug ? `/products/${item.slug}` : "/products"} className="cart-item-name">
                      {item.name}
                    </Link>
                    <div className="cart-item-unit">Нэгж үнэ: {formatMoney(item.price)}</div>
                    <button className="cart-remove" onClick={() => handleRemove(item.id)}>
                      <Trash2 size={14} /> Устгах
                    </button>
                  </div>

                  {/* Qty + total */}
                  <div className="cart-item-right">
                    <div className="cart-qty">
                      <button className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}>
                        <Minus size={14} />
                      </button>
                      <motion.div key={item.quantity}
                        initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="cart-qty-val">
                        {item.quantity}
                      </motion.div>
                      <button className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <motion.div key={item.quantity * item.price}
                      initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                      className="cart-item-total">
                      {formatMoney(item.price * item.quantity)}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Bottom nav */}
            <div className="cart-nav" style={{ justifyContent: "space-between", paddingTop: "20px", marginTop: "20px", borderTop: "1px solid #F1F5F9" }}>
              <Link href="/products" className="cart-continue">
                <ArrowRight size={15} style={{ transform: "rotate(180deg)" }} />
                Худалдан авалтаа үргэлжлүүлэх
              </Link>
              <button className="cart-clear" onClick={clearCart}>
                Сагсыг хоослох
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
