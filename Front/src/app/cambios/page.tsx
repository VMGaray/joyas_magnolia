import Cambios from "@/components/Cambios";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cambios y Devoluciones | Magnolia Joyas",
  description: "Conocé nuestras políticas de cambios, plazos y garantías para tus joyas Magnolia.",
};

export default function CambiosPage() {
  return (
    <Cambios />
  );
}