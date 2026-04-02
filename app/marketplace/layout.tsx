import { Navbar } from "@/components/marketing/navbar";

export const metadata = {
  title: "Component Marketplace | FlexUI",
  description: "Discover community-built components, premium effects, and ready-to-use building blocks for your next project.",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
    </>
  );
}
