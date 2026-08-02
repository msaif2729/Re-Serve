import React, { useState } from 'react';
import API from '../services/api';
import { Star, X, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export default function RatingModal({ isOpen, onClose, order, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/orders/rate', {
        order_id: order._id,
        rating,
        feedback
      });

      if (res.data?.success) {
        setSubmitted(true);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
          setSubmitted(false);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-400">Your review helps maintain high quality standards on Re-Serve.</p>
          </div>
        ) : (
          <>
            <div className="space-y-1 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Post-Delivery Feedback
              </span>
              <h2 className="text-2xl font-black text-white pt-2">Rate Donor Kitchen</h2>
              <p className="text-xs text-slate-400">
                How was your experience with <strong>{order.donor_form_id?.food_name || 'this food donation'}</strong>?
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitRating} className="space-y-6">
              
              {/* Star Rating Picker */}
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs font-bold text-amber-400">
                  {rating === 5 && '🌟 Exceptional Freshness & Punctuality (5/5)'}
                  {rating === 4 && '👍 Great Food Quality & Smooth Pickup (4/5)'}
                  {rating === 3 && '😐 Average Experience (3/5)'}
                  {rating === 2 && '⚠️ Needs Improvement (2/5)'}
                  {rating === 1 && '🚨 Poor Quality / Delay (1/5)'}
                </div>
              </div>

              {/* Feedback Text Input */}
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Comments or Suggestions (Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g. Excellent packaging, food was hot and delicious! Thank you donor team."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="gradient-btn w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Review...' : 'Submit Rating & Review'}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
