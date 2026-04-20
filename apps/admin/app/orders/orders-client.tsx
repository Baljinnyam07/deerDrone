"use client";

import { useState } from "react";
import { safeMoney, safeName, safePhone, safeAddress, safeDate } from "../../lib/format";
import { AdminDrawer } from "../../components/ui/admin-drawer";
import { StatusBadge } from "../../components/ui/status-badge";
import { ActionMenu } from "../../components/ui/action-menu";
import { AdminButton } from "../../components/ui/admin-button";
import { useToast } from "../../components/ui/toast";
import { SectionBlock } from "../../components/section-block";
import { FieldGrid } from "../../components/field-grid";
import { Eye, Clock, CheckCircle, Package, Truck, Check, X, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface OrdersClientProps {
  initialOrders: any[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const statusMap: Record<string, { label: string; variant: any; icon: any }> = {
    pending: { label: "Хүлээгдэж буй", variant: "warning", icon: Clock },
    paid: { label: "Төлөгдсөн", variant: "info", icon: CreditCard },
    confirmed: { label: "Баталгаажсан", variant: "primary", icon: CheckCircle },
    packing: { label: "Савлаж буй", variant: "info", icon: Package },
    shipped: { label: "Илгээсэн", variant: "info", icon: Truck },
    delivered: { label: "Хүргэгдсэн", variant: "success", icon: Check },
    cancelled: { label: "Цуцлагдсан", variant: "danger", icon: X },
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId, 
          status: newStatus,
          note: `Status updated to ${newStatus} via Admin UI`
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Update failed: ${errText}`);
      }
      
      toast(`Захиалгын төлөв амжилттай солигдлоо: ${statusMap[newStatus]?.label}`, "success");
      // Update local state if needed, or refresh
      router.refresh();
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      console.error(err);
      toast(err.message || "Төлөв шинэчлэхэд алдаа гарлаа", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const openOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <article className="admin-panel">
        {/* Header */}
        <div className="admin-panel-header">
          <h2>Сүүлийн захиалгууд</h2>
        </div>

        {/* Orders Table */}
        <div className="admin-table">
          {/* Table Header */}
          <div className="admin-table-header cols-5-orders">
            <div>Захиалга</div>
            <div>Үйлчлүүлэгч</div>
            <div>Нийт дүн</div>
            <div>Төлөв</div>
            <div>Огноо</div>
            <div className="admin-table-cell-align-center">Үйлдэл</div>
          </div>

          {/* Order Rows */}
          {initialOrders.map((order) => {
            const status = statusMap[order.status] || { label: order.status, variant: "neutral", icon: Clock };
            return (
              <div 
                key={order.id} 
                className="admin-table-row cols-5-orders" 
                onClick={() => openOrder(order)}
              >
                {/* Order Number and Method */}
                <div>
                  <div className="font-semibold text-sm">{order.order_number}</div>
                  <div className="text-xs text-muted">{order.payment_method}</div>
                </div>

                {/* Customer */}
                <div>
                  <div className="font-semibold text-sm">{safeName(order.contact_name)}</div>
                  <div className="text-xs text-muted">{safePhone(order.contact_phone)}</div>
                </div>

                {/* Total */}
                <div className="font-semibold">{safeMoney(order.total)}</div>

                {/* Status */}
                <div>
                  <StatusBadge variant={status.variant}>{status.label}</StatusBadge>
                </div>

                {/* Date */}
                <div className="text-sm text-secondary">
                  {mounted ? safeDate(order.created_at, "mn-MN") : "—"}
                </div>

                {/* Actions */}
                <div className="admin-table-actions" onClick={(e) => e.stopPropagation()}>
                  <ActionMenu
                    items={[
                      { label: "Харах", icon: Eye, onClick: () => openOrder(order) },
                      { label: "Төлөгдсөн болгох", icon: CreditCard, onClick: () => updateOrderStatus(order.id, "paid") },
                      { label: "Цуцлагдсан", icon: X, variant: "danger", onClick: () => updateOrderStatus(order.id, "cancelled") },
                    ]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </article>

      {/* Order Details Drawer */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Захиалга: ${selectedOrder?.order_number}`}
        description="Захиалгын дэлгэрэнгүй мэдээлэл болон төлөв удирдах."
        maxWidth="600px"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Хаах
            </AdminButton>
            <AdminButton 
              variant="primary" 
              onClick={() => updateOrderStatus(selectedOrder?.id, "confirmed")}
              disabled={selectedOrder?.status === "confirmed" || isUpdating}
            >
              Баталгаажуулах
            </AdminButton>
          </>
        }
      >
      {selectedOrder && (
          <div className="drawer-section-group">
            {/* Status Section */}
            <SectionBlock title="Одоогийн төлөв">
              <div className="drawer-status-control">
                <StatusBadge variant={statusMap[selectedOrder.status]?.variant}>
                  {statusMap[selectedOrder.status]?.label}
                </StatusBadge>
                <select 
                  value={selectedOrder.status} 
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  disabled={isUpdating}
                  className="drawer-status-select"
                >
                  {Object.entries(statusMap).map(([val, info]) => (
                    <option key={val} value={val}>{info.label}</option>
                  ))}
                </select>
              </div>
            </SectionBlock>

            {/* Customer Info */}
            <SectionBlock title="Захиалагчийн мэдээлэл">
              <FieldGrid 
                cols={2}
                fields={[
                  { label: "Нэр", value: safeName(selectedOrder.contact_name) },
                  { label: "Утас", value: safePhone(selectedOrder.contact_phone) },
                  { label: "Хаяг", value: safeAddress(selectedOrder.shipping_address), fullWidth: true }
                ]}
              />
            </SectionBlock>

            {/* Items Table */}
            <SectionBlock title="Барааны жагсаалт">
              <div className="admin-list">
                {(selectedOrder.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="drawer-list-item">
                    <div className="drawer-list-item-meta">
                      <div className="drawer-list-item-label">{item.product?.name || `Бараа #${idx + 1}`}</div>
                      <div className="drawer-list-item-hint">Тоо ширхэг: {item.quantity}</div>
                    </div>
                    <div className="drawer-list-item-value">{safeMoney(item.price)}</div>
                  </div>
                ))}
                <div className="drawer-list-total">
                  <span className="drawer-list-total-label">Нийт дүн:</span>
                  <strong className="drawer-list-total-value">{safeMoney(selectedOrder.total)}</strong>
                </div>
              </div>
            </SectionBlock>
          </div>
        )}
      </AdminDrawer>
    </>
  );
}
