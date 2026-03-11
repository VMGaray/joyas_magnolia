import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext"; 
import CartSidebar from "../components/CartSidebar";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "@/components/helpers/Toast";
import AdminBar from "@/components/Admin/AdminBar";
import "./globals.css";

// ... (Fuentes y metadata siguen igual) ...
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Magnolia Joyas",
  description: "Joyas atemporales para nuevos comienzos.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="es">
    <body className={`${playfair.variable} ${lato.variable} font-sans antialiased`}>
      {/* ENVOLVEMOS TODO CON EL CART PROVIDER */}
      <AuthProvider>
        <AdminBar />
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <CartSidebar />

            {/* Aquí montamos el ToastProvider */}
            <ToastProvider />

            {children}

            <Footer />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </body>
  </html>
);

}