'use client';

import ProductForm from "./ProductForm";

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onSave: (values: any) => void;
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-serif mb-4">Editar Producto</h3>
        <ProductForm
          initialValues={product}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
