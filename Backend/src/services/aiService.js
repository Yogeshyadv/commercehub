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
${productData.shortDescription ? `Brief Info: ${productData.shortDescription}` : ''}
${productData.tags?.length ? `Tags: ${productData.tags.join(', ')}` : ''}

Requirements:
- Write 2-3 paragraphs
- Highlight key features and benefits
- Use persuasive language
- Include a call to action
- Keep it under 200 words
- Make it SEO friendly`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a professional e-commerce copywriter.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        description: completion.choices[0].message.content.trim(),
        source: 'openai'
      };
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
    source: 'fallback'
  };
}

module.exports = aiService;