import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import MenuSection from "@/components/sections/MenuSection";
import Gallery from "@/components/sections/Gallery";
import Events from "@/components/sections/Events";
import ReservationForm from "@/components/sections/ReservationForm";
import Reviews from "@/components/sections/Reviews";
import MapSection from "@/components/sections/MapSection";
import QRMenu from "@/components/sections/QRMenu";
import SocialSection from "@/components/sections/SocialSection";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import { getMenuCategories, getMenuItems } from "@/lib/menu";

export default async function Home() {
  const [menuItems, menuCategories] = await Promise.all([
    getMenuItems(),
    Promise.resolve(getMenuCategories()),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <MenuSection items={menuItems} categories={menuCategories} />
        <Gallery />
        <Events />
        <ReservationForm />
        <Reviews />
        <QRMenu />
        <SocialSection />
        <MapSection />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
      <InstallPrompt />
    </>
  );
}
