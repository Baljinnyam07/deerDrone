import Link from "next/link";
import Image from "next/image";

const footerSections = [
  {
    title: "Танилцуулга",
    links: [
      { label: "Бидний тухай", href: "#" },
      { label: "Хамтран ажиллах", href: "#" },
      { label: "Салбар дэлгүүр", href: "#" },
      { label: "Ажлын байр", href: "#" },
    ],
  },
  {
    title: "Тусламж",
    links: [
      { label: "Үйлчилгээний нөхцөл", href: "#" },
      { label: "Нууцлалын бодлого", href: "#" },
      { label: "Хүргэлтийн нөхцөл", href: "#" },
    ],
  },
  {
    title: "Холбоо барих",
    links: [
      { label: "ecommerce@hobbyzone.mn", href: "mailto:ecommerce@hobbyzone.mn" },
      { label: "+976 7623-0000", href: "tel:+97676230000" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-white pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-3">
            <Link className="d-flex align-items-center text-dark text-decoration-none mb-3" href="/">
              <Image 
                alt="DEER droneshop" 
                src="/assets/brand/deer-logo.svg" 
                width={100} 
                height={40} 
                className="me-2 w-auto h-auto" 
              />
            </Link>
            <div className="d-flex gap-3">
              <a aria-label="Facebook" href="https://facebook.com" className="text-dark" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "currentColor" }}><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32V7.46H7.05v3.91h2.45V23h5V11.37h3.39Z" /></svg>
              </a>
              <a aria-label="Instagram" href="https://instagram.com" className="text-dark" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "currentColor" }}><path d="M12,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Z M18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z" /></svg>
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="col-6 col-md-2">
              <h6 className="fw-bold mb-3">{section.title}</h6>
              <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: "0.85rem" }}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("mailto:") || link.href.startsWith("tel:") ? (
                      <a href={link.href} className="text-secondary text-decoration-none">{link.label}</a>
                    ) : (
                      <Link href={link.href} className="text-secondary text-decoration-none">{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-12 col-md-3">
            <h6 className="fw-bold mb-3">Хаяг</h6>
            <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
              River Tower 401 | River Garden 4th Mongol street, 11 khoroo, Khan-Uul district | Ulaanbaatar | Mongolia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
