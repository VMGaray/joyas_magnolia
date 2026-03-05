'use client';

import ProductForm from "./ProductForm";
import { X } from "lucide-react";

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onSave?: () => void; 
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  
  const handleSuccess = () => {
    if (onSave) onSave(); 
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Fondo con desenfoque magnolia */}
      <div 
        className="absolute inset-0 bg-magnolia-dark/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
        
        {/* Cabecera Premium */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h3 className="text-2xl font-serif text-magnolia-dark">Editar Pieza</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-1">
              Referencia: {product.id.slice(0, 8)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white hover:bg-gray-50 rounded-full text-gray-400 hover:text-magnolia-dark transition-all shadow-sm border border-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <div className="p-4 md:p-8">
          <ProductForm
            initialValues={product}
            onSubmit={handleSuccess} 
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}