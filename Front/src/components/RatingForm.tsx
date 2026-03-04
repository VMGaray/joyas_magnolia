'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingFormProps {
  productId: string;
  onRatingSubmitted?: () => void; // Opcional: para recargar stats después
}

export default function RatingForm({ productId, onRatingSubmitted }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:4000/product-ratings/${productId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
        // Si tu app tiene auth (JWT, cookies), agregá credentials: 'include' o Authorization header
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al enviar calificación');
      }

      setSubmitted(true);
      if (onRatingSubmitted) onRatingSubmitted(); // Para recargar stats si agregamos después
      alert('¡Gracias por tu calificación!');
    } catch (err: any) {
      setError(err.message || 'Hubo un error. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 border-t pt-8">
      <h3 className="font-serif text-2xl text-magnolia-dark mb-6">Calificá este producto</h3>

      {submitted ? (
        <div className="text-center py-6 bg-green-50 rounded-lg">
          <p className="text-green-700 text-lg font-medium">
            ¡Gracias por compartir tu opinión! ⭐
          </p>
        </div>
      ) : (
        <>
          {/* Selector de estrellas */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={40}
                    className="transition-colors"
                    fill={starValue <= (hover || rating) ? "#FBBF24" : "none"}
                    color={starValue <= (hover || rating) ? "#FBBF24" : "#D1D5DB"}
                  />
                </button>
              );
            })}
          </div>

          {/* Comentario opcional */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué te pareció? (opcional)"
            className="w-full p-4 border border-gray-300 rounded-lg mb-6 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-magnolia-lilac"
          />

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full md:w-auto px-8 py-3 bg-magnolia-dark text-white rounded-lg uppercase tracking-wider text-sm font-medium transition-colors hover:bg-magnolia-lilac ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Enviando...' : 'Enviar calificación'}
          </button>
        </>
      )}
    </div>
  );
}