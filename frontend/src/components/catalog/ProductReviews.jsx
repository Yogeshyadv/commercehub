import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, CheckCircle, User } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { generateInitials, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function ProductReviews({ productId, averageRating, totalReviews, onReviewAdded }) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Form State
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getProductReviews(productId, { page, limit: 5 });
      if (res.data.success) {
        setReviews(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      return;
    }
    
    setSubmitting(true);
    try {
      await reviewService.createReview({ productId, rating, title, comment });
      toast.success('Review submitted successfully!');
      setIsWriting(false);
      setTitle('');
      setComment('');
      setRating(5);
      fetchReviews(); // Refresh list
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Summary Card */}
        <div className="w-full md:w-1/3 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {averageRating || 0}<span className="text-lg text-gray-400 font-normal">/5</span>
            </div>
            <div className="flex flex-col">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.round(averageRating || 0) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{totalReviews || 0} verified reviews</span>
            </div>
          </div>

          {!isWriting ? (
            <button 
              onClick={() => setIsWriting(true)}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Write a Review
            </button>
          ) : (
            <button 
              onClick={() => setIsWriting(false)}
              className="w-full py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel Review
            </button>
          )}
        </div>

        {/* Review List or Form */}
        <div className="w-full md:w-2/3">
          {isWriting && (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 mb-8 animate-in fade-in slide-in-from-top-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-current' : 'text-gray-200 dark:text-gray-700'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="What did you like or dislike?"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                        {generateInitials(`${review.customer?.firstName || ''} ${review.customer?.lastName || ''}`.trim() || 'User')}
                      </div>
                      <div>
                         <p className="font-bold text-gray-900 dark:text-white text-sm">
                           {review.customer?.firstName} {review.customer?.lastName}
                         </p>
                         <div className="flex items-center gap-2">
                           <div className="flex text-amber-400">
                             {[1, 2, 3, 4, 5].map((s) => (
                               <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                             ))}
                           </div>
                           <span className="text-xs text-gray-400">• {formatDate(review.createdAt)}</span>
                         </div>
                      </div>
                    </div>
                    {review.isVerifiedPurchase && (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{review.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
            
            {/* Simple Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
