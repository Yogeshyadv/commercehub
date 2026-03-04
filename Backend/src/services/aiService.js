const OpenAI = require('openai');

let openai = null;

// Only initialize if API key exists
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-xxx') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const aiService = {
  // Generate product description
  generateProductDescription: async (productData) => {
    if (!openai) {
      // Fallback if no API key
      return generateFallbackDescription(productData);
    }

    try {
      const prompt = `Write a compelling, professional product description for an e-commerce listing.

Product Name: ${productData.name}
Category: ${productData.category}
Brand: ${productData.brand || 'N/A'}
Price: ₹${productData.price}
${productData.tags?.length ? `Tags: ${productData.tags.join(', ')}` : ''}

Return a JSON object with:
1. "description": 4-5 paragraphs, highly detailed and engaging, using markdown formatting (headers, bold text, bullet points). Include sections for 'Key Features', 'Specifications', and 'Usage'.
2. "shortDescription": A compelling 2-sentence summary that highlights the USP.

Do not include markdown code blocks for the JSON itself, just raw JSON.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a professional e-commerce copywriter. You always output valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      try {
        const result = JSON.parse(completion.choices[0].message.content.trim());
        return {
            description: result.description,
            shortDescription: result.shortDescription,
            source: 'openai'
        };
      } catch (e) {
         // Fallback if JSON parse fails
         return {
            description: completion.choices[0].message.content.trim(),
            shortDescription: productData.name + ' - ' + productData.category, // Basic fallback
            source: 'openai-raw'
         };
      }
    } catch (error) {
      console.error('OpenAI error:', error.message);
      return generateFallbackDescription(productData);
    }
  },

  // Generate SEO tags
  generateProductTags: async (productData) => {
    if (!openai) {
      return { tags: [productData.category, productData.brand, 'best price', 'online'].filter(Boolean) };
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You generate SEO tags for products. Return only a JSON array of strings.' },
          { role: 'user', content: `Generate 8-10 SEO tags for: ${productData.name} in category ${productData.category}. Return JSON array only.` }
        ],
        max_tokens: 200,
        temperature: 0.5,
      });

      const content = completion.choices[0].message.content.trim();
      const tags = JSON.parse(content);
      return { tags, source: 'openai' };
    } catch (error) {
      console.error('OpenAI tags error:', error.message);
      return { tags: [productData.category, productData.brand, 'buy online', 'best price'].filter(Boolean) };
    }
  },

  // Generate SEO Meta Data
  generateSEOData: async (productData) => {
    if (!openai) {
      return {
        metaTitle: `${productData.name} - Buy Online | ${productData.brand || 'Store'}`,
        metaDescription: `Shop for ${productData.name} at the best prices. High quality ${productData.category} available now.`,
        metaKeywords: `${productData.category}, ${productData.name}, buy online`,
        source: 'fallback'
      };
    }

    try {
        const prompt = `Generate SEO metadata for an e-commerce product.
Product: ${productData.name}
Category: ${productData.category}
Description: ${productData.description || ''}

Return valid JSON with:
1. "metaTitle": SEO optimized title (50-60 chars)
2. "metaDescription": Compelling description (150-160 chars)
3. "metaKeywords": Comma-separated list of 5-8 high-value keywords`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an SEO expert. You output only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.5,
      });

      const content = completion.choices[0].message.content.trim();
      const result = JSON.parse(content);
      return { ...result, source: 'openai' };

    } catch (error) {
      console.error('OpenAI SEO error:', error.message);
      return {
        metaTitle: `${productData.name} | Best Prices`,
        metaDescription: `Buy ${productData.name} online. Top quality ${productData.category}.`,
        metaKeywords: `${productData.name}, ${productData.category}`,
        source: 'fallback-error'
      };
    }
  },
};

// Fallback description generator (no API needed)
function generateFallbackDescription(productData) {
  const name = productData.name || 'Product';
  const category = productData.category || 'General';
  const brand = productData.brand || '';
  const price = productData.price || 0;

  const descriptions = [
    `Introducing the ${name}${brand ? ` by ${brand}` : ''} — a premium ${category.toLowerCase()} product designed to exceed your expectations. Built with quality materials and attention to detail, this product offers exceptional value at ₹${price}.`,
    `Whether you're looking for reliability, performance, or style, the ${name} delivers on all fronts. Perfect for both personal and professional use, it's a must-have addition to your collection.`,
    `Order now and experience the difference. With fast shipping and hassle-free returns, shopping with us is always a pleasure.`
  ];

  return {
    description: descriptions.join('\n\n'),
    shortDescription: `Premium ${name} - High quality ${category.toLowerCase()} product.`,
    source: 'fallback'
  };
}

module.exports = aiService;