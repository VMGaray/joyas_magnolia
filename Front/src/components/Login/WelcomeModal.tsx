"use client";
import React from "react";

interface WelcomeModalProps {
  message: string;
  name: string;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ message, name, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          Hola {name}! {message}
        </h2>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-magnolia-dark text-white rounded hover:bg-magnolia-lilac"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
