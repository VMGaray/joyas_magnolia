"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeModalProps {
  message: string;
  name: string;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ message, name, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Fondo con desenfoque y animación de opacidad */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-magnolia-lilac/30 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Contenedor del Modal con animación de escala y entrada suave */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative bg-white p-10 rounded-sm shadow-2xl text-center max-w-md w-full border border-magnolia-lilac/20 mx-4"
        >
          <h2 className="text-3xl font-serif text-magnolia-dark mb-4 tracking-wide">
            ¡Hola {name}!
          </h2>
          
          <div className="w-12 h-[1px] bg-magnolia-lilac mx-auto mb-6" />

          <p className="font-sans text-gray-600 mb-8 italic">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 bg-magnolia-dark text-white font-sans text-xs uppercase tracking-[0.2em] hover:bg-magnolia-lilac transition-colors duration-300"
          >
            Cerrar
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};