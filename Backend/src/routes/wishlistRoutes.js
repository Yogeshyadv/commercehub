const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
} = require('../controllers/wishlistController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getWishlist);

router
  .route('/:productId')
  .post(addToWishlist)
  .delete(removeFromWishlist);

router
  .route('/check/:productId')
  .get(checkWishlistStatus);

module.exports = router;
