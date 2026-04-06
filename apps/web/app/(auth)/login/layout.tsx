import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Нэвтрэх | DEER Drone",
  description: "DEER Drone системд нэвтэрч өөрийн захиалга болон бүтээгдэхүүнээ удирдах боломжтой.",
  openGraph: {
    title: "Нэвтрэх | DEER Drone",
    description: "DEER Drone системд нэвтрэх",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
