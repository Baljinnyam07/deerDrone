"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Trash2, Plus, Minus, ShoppingCart, Heart, X,
  ChevronUp, Ticket, CreditCard, AlertTriangle, ArrowLeft,
} from "lucide-react";
import { useStore } from "../../../store/useStore";
import { formatMoney } from "@deer-drone/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  .cart-page {
    background: #F8FAFC;
    min-height: 100vh;
    padding-bottom: 100px;
    margin-top: 30px;
  }

  /* Breadcrumb */
  .cart-breadcrumb {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 24px 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    color: #94A3B8;
    flex-wrap: wrap;
  }
  .cart-breadcrumb-item { white-space: nowrap; }
  .cart-breadcrumb-item.active { color: #0F172A; font-weight: 600; }
  .cart-breadcrumb-sep { color: #CBD5E1; font-size: 0.7rem; }

  /* Main layout */
  .cart-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 24px 0;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 28px;
    align-items: start;
  }

  /* Section header */
  .cart-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .cart-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
  }
  .cart-clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    background: #fff;
    color: #64748B;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 200ms;
  }
  .cart-clear-btn:hover {
    border-color: #EF4444;
    color: #EF4444;
    background: #FFF1F0;
  }

  /* Items card */
  .cart-items-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #E2E8F0;
    overflow: hidden;
    margin-bottom: 16px;
  }

  /* Single cart item */
  .cart-item {
    display: grid;
    grid-template-columns: 96px 1fr auto;
    gap: 16px;
    align-items: center;
    padding: 20px 20px;
    border-bottom: 1px solid #F1F5F9;
  }
  .cart-item:last-of-type { border-bottom: none; }

  .cart-item-img-wrap {
    width: 96px; height: 96px;
    border-radius: 10px;
    border: 1px solid #F1F5F9;
    background: #F8FAFC;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    flex-shrink: 0;
    transition: transform 200ms;
  }
  .cart-item-img-wrap:hover { transform: scale(1.03); }

  .cart-item-body {}
  .cart-item-brand {
    font-size: 0.68rem;
    font-weight: 700;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 3px;
  }
  .cart-item-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #0F172A;
    text-decoration: none;
    display: block;
    margin-bottom: 12px;
    line-height: 1.3;
    transition: color 200ms;
  }
  .cart-item-name:hover { color: #2563EB; }

  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .cart-item-unit {
    font-size: 0.88rem;
    color: #64748B;
    font-weight: 500;
  }

  .cart-qty {
    display: inline-flex;
    align-items: center;
    border: 1.5px solid #E2E8F0;
    border-radius: 8px;
    background: #F8FAFC;
    overflow: hidden;
  }
  .cart-qty:focus-within { border-color: #94A3B8; }
  .cart-qty-btn {
    border: none; background: transparent;
    padding: 7px 10px;
    cursor: pointer; color: #64748B;
    display: flex; align-items: center;
    transition: color 150ms;
  }
  .cart-qty-btn:hover:not(:disabled) { color: #0F172A; }
  .cart-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .cart-qty-val {
    min-width: 30px; text-align: center;
    font-weight: 700; font-size: 0.9rem; color: #0F172A;
    padding: 7px 0;
  }

  .cart-item-stock {
    font-size: 0.72rem;
    color: #2563EB;
    margin-top: 6px;
    font-weight: 500;
  }

  /* Right side of item */
  .cart-item-right {
    display: flex; flex-direction: column;
    align-items: flex-end; gap: 10px;
  }
  .cart-item-total {
    font-size: 1rem; font-weight: 700; color: #0F172A;
    white-space: nowrap;
  }
  .cart-item-actions { display: flex; gap: 7px; }
  .cart-action-btn {
    width: 34px; height: 34px;
    border-radius: 8px;
    border: 1px solid #E2E8F0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #64748B;
    transition: all 200ms;
  }
  .cart-action-btn:hover { border-color: #CBD5E1; background: #F8FAFC; color: #0F172A; }
  .cart-action-btn.fav-active { color: #EF4444; border-color: #FCA5A5; background: #FFF1F0; }
  .cart-action-btn.remove:hover { border-color: #FCA5A5; background: #FFF1F0; color: #EF4444; }

  /* Delivery warning */
  .delivery-warning {
    background: #FFFBEB;
    border: 1px solid #FDE68A;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .delivery-warning-title {
    font-size: 0.82rem; font-weight: 700; color: #92400E; margin-bottom: 3px;
  }
  .delivery-warning-text {
    font-size: 0.78rem; color: #B45309; line-height: 1.5; margin: 0;
  }

  /* Right col: summary card */
  .cart-right { position: sticky; top: 88px; }

  .summary-card {
    background: #fff;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 20px;
  }
  .summary-card-title {
    font-size: 0.95rem; font-weight: 700; color: #0F172A;
    margin: 0 0 14px 0;
  }
  .summary-section-label {
    font-size: 0.68rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: #94A3B8; margin-bottom: 10px;
  }

  .summary-item-row {
    display: flex; justify-content: space-between;
    align-items: center; gap: 12px; margin-bottom: 14px;
  }
  .summary-item-left {
    display: flex; align-items: center; justify-content: space-between; gap: 6px;
    flex: 1; min-width: 0;
  }
  .summary-item-name {
    font-size: 0.82rem; color: #0F172A; font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .qty-badge {
    background: #F1F5F9; color: #64748B;
    font-size: 0.68rem; font-weight: 700;
    padding: 2px 6px; border-radius: 4px;
    flex-shrink: 0;
  }
  .summary-item-price {
    font-size: 0.82rem; font-weight: 600; color: #0F172A;
    white-space: nowrap;
  }

  .summary-hr { border: none; border-top: 1px solid #F1F5F9; margin: 12px 0; }

  .summary-row {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 8px; font-size: 0.85rem;
  }
  .summary-row-label { color: #64748B; }
  .summary-row-value { font-weight: 600; color: #0F172A; }
  .summary-row-value.green { color: #16A34A; }

  .summary-total-row {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 10px;
  }
  .summary-total-label { font-size: 0.92rem; font-weight: 600; color: #0F172A; }
  .summary-total-amount { font-size: 1.15rem; font-weight: 800; color: #0F172A; }

  .loyalty-row {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 14px;
  }
  .loyalty-row-left {
    display: flex; align-items: center; gap: 8px;
  }
  .loyalty-icon {
    width: 28px; height: 28px;
    background: #EEF2FF; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: #4F46E5;
    flex-shrink: 0;
  }
  .loyalty-label { font-size: 0.85rem; color: #64748B; }
  .loyalty-value { font-size: 0.85rem; font-weight: 600; color: #0F172A; }

  .coupon-btn {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; width: 100%;
    padding: 12px;
    background: #FFFBEB;
    border: 1.5px dashed #FBBF24;
    border-radius: 10px;
    font-size: 0.85rem; font-weight: 600; color: #B45309;
    cursor: pointer; transition: all 200ms; margin-bottom: 10px;
  }
  .coupon-btn:hover { background: #FEF3C7; }

  .checkout-btn {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 8px;
    background: #2563EB; color: #fff;
    border-radius: 10px;
    font-weight: 700; font-size: 0.95rem;
    text-decoration: none; border: none; cursor: pointer;
    transition: all 200ms;
  }
  .checkout-btn:hover { background: #155238; transform: translateY(-1px); }

  /* Empty state */
  .cart-empty {
    min-height: 60vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 40px 16px;
  }
  .cart-empty-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: #F1F5F9;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .cart-empty h2 { font-size: 1.5rem; font-weight: 800; color: #0F172A; margin: 0 0 8px; }
  .cart-empty p { color: #64748B; margin: 0 0 24px; }
  .cart-empty-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; background: #2563EB; color: #fff;
    border-radius: 10px; font-weight: 700;
    text-decoration: none; transition: all 200ms;
  }
  .cart-empty-btn:hover { background: #1d4ed8; }

  /* Mobile header (hidden on desktop) */
  .cart-mobile-header {
    display: none;
    align-items: center; justify-content: space-between;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #F1F5F9;
    position: sticky; top: 0; z-index: 50;
  }
  .cart-mobile-back {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none; color: #0F172A;
  }
  .cart-mobile-title {
    font-size: 1rem; font-weight: 700; color: #0F172A; margin: 0;
  }
  .cart-mobile-count {
    font-size: 0.75rem; color: #64748B; font-weight: 400;
  }

  /* Mobile bottom sheet */
  .mobile-sheet-overlay {
    display: none;
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.4);
  }
  .mobile-sheet-overlay.open { display: block; }

  .mobile-sheet {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 201;
    background: #fff;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -20px 60px rgba(0,0,0,0.15);
    max-height: 82vh; overflow-y: auto;
    padding: 0 20px 32px;
  }
  .mobile-sheet-handle {
    width: 36px; height: 4px;
    background: #E2E8F0; border-radius: 2px;
    margin: 12px auto 16px;
  }

  .mobile-bottom-bar {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(10px);
    border-top: 1px solid #E2E8F0;
    padding: 12px 16px;
    z-index: 100;
    align-items: center; justify-content: space-between; gap: 12px;
  }
  .mobile-bottom-total { font-size: 1rem; font-weight: 800; color: #0F172A; }
  .mobile-bottom-sub { font-size: 0.72rem; color: #64748B; }
  .mobile-checkout-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 12px 20px; background: #2563EB; color: #fff;
    border-radius: 10px; font-weight: 700; font-size: 0.9rem;
    text-decoration: none; white-space: nowrap;
  }
  .mobile-show-summary-btn {
    display: flex; align-items: center; gap: 4px;
    font-size: 0.75rem; color: #2563EB; font-weight: 600;
    background: none; border: none; cursor: pointer; padding: 0;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .cart-breadcrumb { display: none; }
    .cart-container {
      grid-template-columns: 1fr;
      padding: 16px 14px 0;
      gap: 0;
    }
    .cart-right { display: none; }
    .cart-mobile-header { display: flex; }
    .mobile-bottom-bar { display: flex; }
    .mobile-sheet { display: block; }
    .cart-page { padding-bottom: 90px; margin-top: 0; }
    .cart-section-header { margin-top: 8px; }
  }

  @media (max-width: 640px) {
    .cart-item {
      grid-template-columns: 80px 1fr;
      gap: 12px;
    }
    .cart-item-right {
      grid-column: 1 / -1;
      flex-direction: row; align-items: center;
      justify-content: space-between;
      background: #F8FAFC;
      padding: 10px 12px; border-radius: 10px;
    }
    .cart-item-img-wrap { width: 80px; height: 80px; }
  }
`;

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, favorites, addFavorite, removeFavorite } = useStore();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const loyaltyEarn = Math.floor(subtotal * 0.01);
  const total = subtotal;

  const handleRemove = async (id: string) => {
    setRemovingItems(p => new Set(p).add(id));
    await new Promise(r => setTimeout(r, 280));
    removeFromCart(id);
    setRemovingItems(p => { const n = new Set(p); n.delete(id); return n; });
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) removeFavorite(id);
    else addFavorite(id);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="cart-empty">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35 }} className="cart-empty-icon">
            <ShoppingCart size={38} style={{ color: "#94A3B8" }} />
          </motion.div>
          <motion.h2 initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>Сагс хоосон байна</motion.h2>
          <motion.p initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}>Та хүссэн бараагаа сонгон сагсандаа нэмэх боломжтой.</motion.p>
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.26 }}>
            <Link href="/products" className="cart-empty-btn">Дэлгүүр хэсэх</Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const SummaryContent = (
    <>
      <p className="summary-section-label">Бүтээгдэхүүн</p>
      {cartItems.map(item => (
        <div key={item.id} className="summary-item-row">
          <div className="summary-item-left">
            <span className="summary-item-name">{item.name}</span>
            <span className="qty-badge">x{item.quantity}</span>
          </div>
          <span className="summary-item-price">{formatMoney(item.price)}</span>
        </div>
      ))}


      <hr className="summary-hr" />
      <div className="summary-total-row">
        <span className="summary-total-label">Нийт төлөх дүн</span>
        <span className="summary-total-amount">{formatMoney(total)}</span>
      </div>

      <Link href="/checkout" className="checkout-btn">
        Үргэлжлүүлэх
      </Link>
    </>
  );

  return (
    <div className="cart-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Mobile header */}
      <div className="cart-mobile-header">
        <Link href="/products" className="cart-mobile-back">
          <ArrowLeft size={20} />
          <div>
            <div className="cart-mobile-title">Миний сагс</div>
            <div className="cart-mobile-count">{cartItems.length} бараа</div>
          </div>
        </Link>
      </div>

      {/* Desktop breadcrumb */}
      <div className="cart-breadcrumb">
        <span className="cart-breadcrumb-item active">Миний сагс</span>
        <span className="cart-breadcrumb-sep">›</span>
        <span className="cart-breadcrumb-item">Захиалгын хаяг</span>
        <span className="cart-breadcrumb-sep">›</span>
        <span className="cart-breadcrumb-item">Баталгаажуулах</span>
        <span className="cart-breadcrumb-sep">›</span>
        <span className="cart-breadcrumb-item">Захиалгын мэдээлэл</span>
      </div>

      <div className="cart-container">
        {/* ── Left: items ── */}
        <div className="cart-left">
          <div className="cart-section-header">
            <h1 className="cart-title">Таны сагс</h1>
            <button className="cart-clear-btn" onClick={clearCart}>
              <Trash2 size={14} /> Сагс хоослох
            </button>
          </div>

          <div className="cart-items-card">
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: removingItems.has(item.id) ? 0 : 1, x: removingItems.has(item.id) ? 40 : 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.25 }}
                  className="cart-item"
                >
                  {/* Image */}
                  <Link href={item.slug ? `/products/${item.slug}` : "/products"} className="cart-item-img-wrap">
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: "8px" }} />
                  </Link>

                  {/* Details */}
                  <div className="cart-item-body">
                    {item.brand && <div className="cart-item-brand">{item.brand}</div>}
                    <Link href={item.slug ? `/products/${item.slug}` : "/products"} className="cart-item-name">
                      {item.name}
                    </Link>
                    <div className="cart-item-controls">
                      <span className="cart-item-unit">{formatMoney(item.price)}</span>
                      <div className="cart-qty">
                        <button className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}>
                          <Minus size={13} />
                        </button>
                        <motion.div key={item.quantity}
                          initial={{ scale: 1.25, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}
                          className="cart-qty-val">
                          {item.quantity}
                        </motion.div>
                        <button className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    {item.stockQty !== undefined && (
                      <div className="cart-item-stock">Үлдэгдэл: {item.stockQty}</div>
                    )}
                  </div>

                  {/* Total + actions */}
                  <div className="cart-item-right">
                    <motion.div key={item.quantity * item.price}
                      initial={{ scale: 1.08 }} animate={{ scale: 1 }}
                      className="cart-item-total">
                      {formatMoney(item.price * item.quantity)}
                    </motion.div>
                    <div className="cart-item-actions">
                      <button
                        className={`cart-action-btn ${favorites.includes(item.id) ? "fav-active" : ""}`}
                        title="Хадгалах"
                        onClick={() => toggleFavorite(item.id)}
                      >
                        <Heart size={15} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                      </button>
                      <button className="cart-action-btn remove" title="Устгах" onClick={() => handleRemove(item.id)}>
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right: summary ── */}
        <div className="cart-right">
          <div className="cart-section-header">
            <h2 className="cart-title">Төлбөрийн мэдээлэл</h2>
          </div>
          <div className="summary-card">
            {SummaryContent}
          </div>
        </div>
      </div>

      {/* ── Mobile: bottom bar + sheet ── */}
      {/* {sheetOpen && (
        <div className="mobile-sheet-overlay open" onClick={() => setSheetOpen(false)} />
      )} */}

      {/* <AnimatePresence>
        {sheetOpen && (
          <motion.div
            className="mobile-sheet"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="mobile-sheet-handle" />
            <h2 className="summary-card-title">Төлбөрийн мэдээлэл</h2>
            {SummaryContent}
          </motion.div>
        )}
      </AnimatePresence> */}

      <div className="mobile-bottom-bar">
        <div>
          <div className="mobile-bottom-sub">Нийт төлөх дүн</div>
          <div className="mobile-bottom-total">{formatMoney(total)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* <button className="mobile-show-summary-btn" onClick={() => setSheetOpen(v => !v)}>
            <ChevronUp size={15} style={{ transform: sheetOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
            Дэлгэрэнгүй
          </button> */}
          <Link href="/checkout" className="mobile-checkout-btn">
            Үргэлжлүүлэх
          </Link>
        </div>
      </div>
    </div>
  );
}
