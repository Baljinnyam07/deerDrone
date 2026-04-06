import { createAdminClient } from "../../../lib/supabase";
import { CreateProductForm } from "./create-product-form";

async function getCategories() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <section>
      <div className="admin-title">
        <p className="admin-kicker">Products</p>
        <h1>Шинэ бүтээгдэхүүн нэмэх</h1>
        <p className="admin-muted">
          Каталогт шинэ бараа уүсгэх маягт. Зураг болон үндсэн үзүүлэлтүүдээ оруулна уу.
        </p>
      </div>

      <article className="admin-panel">
        <CreateProductForm categories={categories} />
      </article>
    </section>
  );
}
