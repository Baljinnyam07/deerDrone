"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { formatMoney } from "@deer-drone/utils";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useStore();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 my-5 text-center text-sans-serif">
        <div className="bg-light mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: "100px", height: "100px" }}>
          <ShoppingCart size={40} className="text-secondary" />
        </div>
        <h2 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>Сагс хоосон байна</h2>
        <p className="text-secondary mb-5">Та хүссэн бараагаа сонгон сагсандаа нэмэх боломжтой.</p>
        <Link href="/products" className="btn btn-primary rounded-pill py-3 px-5 fw-bold shadow">
          Худалдан авалт хийх
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white pb-5 text-sans-serif">
      <div className="container py-4">
        <h1 className="fw-bold mb-5" style={{ fontSize: "2.2rem", letterSpacing: "-0.01em" }}>
          Миний сагс ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)})
        </h1>

        <div className="row g-5">
          {/* Cart Items List */}
          <div className="col-12 col-lg-8">
            <div className="border-top border-light mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="py-4 border-bottom border-light">
                  <div className="row align-items-center">
                    <div className="col-12 col-sm-6 d-flex align-items-center gap-4 mb-3 mb-sm-0">
                      <div className="bg-light rounded-3 p-3 d-flex align-items-center justify-content-center" style={{ width: "120px", height: "120px" }}>
                        <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-contain" />
                      </div>
                      <div className="flex-grow-1">
                        <Link href={`/products/${item.id}`} className="text-decoration-none">
                            <h5 className="fw-bold mb-1 text-dark hover-text-primary transition-all">{item.name}</h5>
                        </Link>
                        <p className="text-secondary small mb-2">Нэг бүрийн үнэ: {formatMoney(item.price)}</p>
                        <button 
                          className="btn btn-link text-secondary p-0 text-decoration-none small hover-text-danger" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={14} className="me-1" /> Устгах
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-6 col-sm-3 d-flex justify-content-center">
                      <div className="input-group input-group-sm" style={{ maxWidth: "100px", height: "36px" }}>
                        <button 
                          className="btn btn-outline-light text-dark border" 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <input 
                          type="text" 
                          className="form-control text-center fw-bold bg-white border-top border-bottom border-0" 
                          value={item.quantity} 
                          readOnly 
                        />
                        <button 
                          className="btn btn-outline-light text-dark border" 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-6 col-sm-3 text-end d-flex flex-column align-items-end justify-content-center">
                      <h5 className="fw-bold text-dark mb-0 fs-5">{formatMoney(item.price * item.quantity)}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="d-flex justify-content-between align-items-center mt-2">
              <Link href="/products" className="text-primary text-decoration-none fw-medium small">
                &lt; Худалдан авалтаа үргэлжлүүлэх
              </Link>
              <button 
                className="btn btn-link text-danger btn-sm text-decoration-none small"
                onClick={clearCart}
              >
                Сагсыг хоослох
              </button>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 bg-light p-3">
              <div className="card-body p-3">
                <h3 className="fw-bold mb-4" style={{ fontSize: "1.5rem" }}>Захиалгын тойм</h3>
                
                <div className="d-flex justify-content-between mb-3 text-secondary small fw-medium">
                  <span>НИЙТ ДҮН</span>
                  <span className="text-dark fw-bold">{formatMoney(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-secondary small fw-medium">
                  <span>ХҮРГЭЛТ</span>
                  <span className="text-success fw-bold">ҮНЭГҮЙ</span>
                </div>
                <hr className="my-4 opacity-5" />
                <div className="d-flex justify-content-between mb-5 align-items-end">
                  <span className="fw-bold text-dark fs-5">ТӨЛӨХ ДҮН</span>
                  <span className="fw-bold text-primary" style={{ fontSize: "1.8rem", letterSpacing: "-0.01em" }}>{formatMoney(total)}</span>
                </div>
                
                <Link 
                  href="/checkout" 
                  className="btn btn-primary w-100 rounded-pill py-3 fw-bold fs-5 shadow-lg position-relative overflow-hidden group"
                >
                  <span className="position-relative z-1">Тооцоо хийх</span>
                </Link>

                <div className="mt-4 text-center text-muted" style={{ fontSize: "0.75rem", lineHeight: "1.6" }}>
                  Төлбөр төлөгдсөний дараа таны захиалга баталгаажуулж, хүргэлтийн ажилтан тантай холбогдох болно.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
