import InfoLayout from "@/components/InfoLayout";

export default function TerminosPage() {
  return (
    <InfoLayout title="Términos y Condiciones">
      <section>
        <h2 className="text-magnolia-dark font-serif text-xl mb-4 italic">01. Generalidades</h2>
        <p>Al acceder y utilizar el sitio web de Magnolia Joyas, el usuario acepta los términos y condiciones aquí descritos. Nos reservamos el derecho de actualizar estos términos en cualquier momento.</p>
      </section>

      <section>
        <h2 className="text-magnolia-dark font-serif text-xl mb-4 italic">02. Productos y Precios</h2>
        <p>Los precios están expresados en Pesos Argentinos y están sujetos a cambios sin previo aviso.</p>
      </section>

      <section>
        <h2 className="text-magnolia-dark font-serif text-xl mb-4 italic">03. Disponibilidad y Stock</h2>
        <p>En caso de que un producto no se encuentre disponible tras la compra, Magnolia Joyas se pondrá en contacto con el cliente para ofrecer un cambio o el reembolso total del dinero.</p>
      </section>

      <section>
        <h2 className="text-magnolia-dark font-serif text-xl mb-4 italic">04. Envíos</h2>
        <p>El costo del envío para fuera del Valle de Calamuchita se calculará y coordinará de forma externa a la plataforma tras la confirmación de la compra.</p>
      </section>
    </InfoLayout>
  );
}