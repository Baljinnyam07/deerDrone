import type { ReactNode } from "react";
import Link from "next/link";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-kicker">MongolDrone Admin</p>
          <h2>Operations</h2>
        </div>

        <nav className="admin-nav">
          <Link href="/">Dashboard</Link>
          <Link href="/products">Products</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/chatbot">Chatbot</Link>
        </nav>
      </aside>

      <div className="admin-content">{children}</div>
    </div>
  );
}
