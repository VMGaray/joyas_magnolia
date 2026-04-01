import InfoLayout from "@/components/InfoLayout";

export default function PrivacidadPage() {
  return (
    <InfoLayout title="Política de Privacidad">
      <section>
        <h2 className="text-magnolia-dark font-serif text-xl mb-4 italic">Tratamiento de Datos</h2>
        <p>En Magnolia Joyas protegemos tu información personal. Los datos solicitados (nombre, email, dirección, teléfono) se utilizan exclusivamente para procesar tus pedidos y mantenerte informado sobre novedades si así lo deseás.</p>
      </section>

      <section>
        <h2 className="text-magnolia-dark font-serif text-xl mb-4 italic">Seguridad en los Pagos</h2>
        <p>No almacenamos ni tenemos acceso a tus datos de tarjetas de crédito o débito. Todas las transacciones se realizan de forma segura a través de **Mercado Pago**, líder en seguridad de pagos online en Latinoamérica.</p>
      </section>

      <section>
        <h2 className="text-magnolia-dark font-serif text-xl mb-4 italic">Confidencialidad</h2>
        <p>Bajo ningún concepto compartiremos, venderemos o alquilaremos tu información personal a terceros. Tus datos están seguros con nosotros.</p>
      </section>
    </InfoLayout>
  );
}