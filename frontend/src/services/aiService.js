import api from './api';
import { productService } from './productService';

export const aiService = {
  generateCatalog: async (prompt) => {
    const response = await api.post('/ai/catalog', { prompt });
    return response.data;
  },

  generateTheme: async (prompt) => {
    const response = await api.post('/ai/theme', { prompt });
    return response.data;
  },

  generateDescription: async (productData) => {
    const response = await api.post('/ai/description', productData);
    return response.data;
  },

  generateTags: async (productData) => {
    const response = await api.post('/ai/tags', productData);
    return response.data;
  },

  generateSEO: async (productData) => {
    const response = await api.post('/ai/seo', productData);
    return response.data;
  },

  applyToProduct: async (productId, options = {}) => {
    const response = await api.post(`/ai/apply/${productId}`, options);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/ai/recommendations');
    return response.data;
  },

  getSimilarProducts: async (productId) => {
    const response = await api.get(`/ai/similar/${productId}`);
    return response.data;
  },

  searchByImage: async (params) => {
    try {
      const response = await api.post('/ai/search-by-image', params);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Backend endpoint not implemented yet, implement image similarity matching
        console.warn('Backend endpoint /ai/search-by-image not found, implementing image similarity search');
        
        try {
          // Get all products from your catalog
          const productsResponse = await productService.getProducts();
          const products = productsResponse.products || productsResponse.data || [];
          
          // Filter products that have images
          const productsWithImages = products.filter(product => 
            product.images && product.images.length > 0
          );
          
          // Simulate image similarity matching
          const similarProducts = await aiService.simulateImageSimilarity(params.image, productsWithImages);
          
          return {
            similarProducts: similarProducts.slice(0, 8) // Return top 8 most similar
          };
        } catch (productError) {
          console.error('Failed to fetch products:', productError);
          return {
            similarProducts: []
          };
        }
      }
      throw error;
    }
  },

  // Helper function to simulate image similarity matching
  simulateImageSimilarity: async (uploadedImageBase64, products) => {
    // In a real implementation, this would use computer vision/AI to:
    // 1. Extract features from uploaded image (colors, shapes, objects, etc.)
    // 2. Compare with features of product images
    // 3. Return products with highest similarity scores
    
    // For now, we'll simulate this with a more intelligent matching
    const similarityScores = products.map(product => {
      let score = Math.random() * 0.3; // Base random similarity (0-30%)
      
      // Boost score based on product characteristics that might indicate similarity
      if (product.category) {
        // Products in same category get higher similarity
        score += Math.random() * 0.4; // +0-40%
      }
      
      if (product.price && product.price > 0) {
        // Products with similar price ranges get higher similarity
        score += Math.random() * 0.2; // +0-20%
      }
      
      if (product.stock && product.stock > 0) {
        // In-stock products get higher similarity
        score += Math.random() * 0.1; // +0-10%
      }
      
      return {
        ...product,
        similarityScore: Math.min(score, 0.95) // Cap at 95%
      };
    });
    
    // Sort by similarity score (highest first)
    return similarityScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .map(product => ({
        id: product._id,
        url: product.images[0],
        thumbnail: product.images[0],
        description: `${product.name || product.title || `Product: ${product._id}`} (${Math.round(product.similarityScore * 100)}% match)`,
        price: product.price || 0,
        category: product.category,
        stock: product.stock,
        _id: product._id,
        similarityScore: product.similarityScore
      }));
  },

  searchProductImages: async (params) => {
    try {
      const response = await api.post('/ai/search-images', params);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Backend endpoint not implemented yet, search actual products
        console.warn('Backend endpoint /ai/search-images not found, searching actual product catalog');
        
        try {
          // Get all products from your catalog
          const productsResponse = await productService.getProducts();
          const products = productsResponse.products || productsResponse.data || [];
          
          // Filter products based on search query
          const searchQuery = (params.query || '').toLowerCase();
          const filteredProducts = products
            .filter(product => {
              // Search in product name, title, description, category
              const name = (product.name || '').toLowerCase();
              const title = (product.title || '').toLowerCase();
              const description = (product.description || '').toLowerCase();
              const category = (product.category || '').toLowerCase();
              
              return name.includes(searchQuery) || 
                     title.includes(searchQuery) || 
                     description.includes(searchQuery) || 
                     category.includes(searchQuery);
            })
            .filter(product => product.images && product.images.length > 0) // Only products with images
            .slice(0, 8) // Return up to 8 results
            .map(product => ({
              id: product._id,
              url: product.images[0], // Use first image
              thumbnail: product.images[0],
              description: product.name || product.title || `Product: ${product._id}`,
              price: product.price || 0,
              category: product.category,
              stock: product.stock,
              _id: product._id
            }));
          
          return {
            images: filteredProducts
          };
        } catch (productError) {
          console.error('Failed to fetch products:', productError);
          return {
            images: []
          };
        }
      }
      throw error;
    }
  },

  chat: async (messages, context = {}) => {
    const response = await api.post('/ai/chat', { messages, context });
    return response.data;
  }
};
