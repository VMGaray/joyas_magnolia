import Envios from "@/components/Envios";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envíos y Entregas | Magnolia Joyas",
  description: "Información sobre nuestras modalidades de envío local en Calamuchita y entregas a todo el país a través de Correo Argentino.",
};

export default function EnviosPage() {
  return (
    <Envios />
  );
}