import { products } from "@deer-drone/data";
import { formatMoney } from "@deer-drone/utils";

export default function ProductsPage() {
  return (
    <section>
      <div className="admin-title">
        <p className="admin-kicker">Products</p>
        <h1>Catalog control</h1>
        <p className="admin-muted">Product CRUD table-ийн анхны scaffold. Mock catalog workspace package-аас орж ирж байна.</p>
      </div>

      <article className="admin-panel">
        <h2>Active products</h2>
        <div className="table-like">
          {products.map((product) => (
            <div className="table-row" key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <p className="admin-muted">{product.sku}</p>
              </div>
              <div>{product.categoryName}</div>
              <div>{formatMoney(product.price)}</div>
              <div>
                <span className="status-pill">{product.stockQty} үлдсэн</span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
