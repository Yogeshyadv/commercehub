const OpenAI = require('openai');

let openai = null;

// Only initialize if API key exists
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-xxx') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const aiService = {
  generateCatalogTheme: async (prompt) => {
    if (!openai) {
        return {
            template: 'minimal',
            design: {
                backgroundColor: '#f8f9fa',
                textColor: '#212529',
                accentColor: '#3b82f6',
                fontFamily: 'Inter',
            },
            message: "Using fallback theme because OpenAI API is not configured."
        };
    }
    try {
        const aiPrompt = `You are an expert e-commerce designer. The user wants to design a catalog.
User prompt: "${prompt}"
Return ONLY a valid JSON object describing the design. It must perfectly match this schema:
{
  "template": "one of: grid, list, magazine, minimal, luxury, modern, classic",
  "design": {
    "backgroundColor": "Hex color code",
    "textColor": "Hex color code",
    "accentColor": "Hex color code",
    "fontFamily": "one of: Inter, Roboto, Playfair Display, Montserrat, Lora, Oswald"
  }
}
Generate colors and fonts that match the vibe of the user's prompt.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: aiPrompt }],
            temperature: 0.7,
            max_tokens: 300,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error('OpenAI Theme Generation Error:', error);
        throw error;
    }
  },

  // Generate complete catalog metadata from a prompt
  generateCatalogDetails: async (prompt) => {
    if (!openai) {
      return {
        name: "Auto-Generated Catalog",
        description: "An auto-generated catalog based on: " + prompt,
        categories: ["General"],
        tags: ["auto-generated"],
        design: {
          template: 'modern-blocks',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          accentColor: '#25D366',
          fontFamily: 'Inter'
        },
        blocks: [
          {
            "id": "hero-1",
            "type": "hero",
            "content": { "title": "Welcome to " + prompt, "subtitle": "Discover our amazing collection", "buttonText": "Shop Now" },
            "settings": { "alignment": "center", "overlayOpacity": 0.5 }
          },
          {
            "id": "grid-1",
            "type": "product_grid",
            "content": { "heading": "Featured Pieces" },
            "settings": { "columns": 3, "showPrices": true }
          },
          {
            "id": "feature-1",
            "type": "features",
            "content": { "heading": "Why Choose Us", "description": "We offer the best quality products for " + prompt },
            "settings": { "layout": "image-right" }
          }
        ],
        source: 'fallback'
      };
    }

    try {
      const aiPrompt = `You are an expert e-commerce merchandiser and web designer. The user wants to generate a product catalog based on this prompt: "${prompt}".
Create the ideal catalog metadata. Return ONLY a valid JSON object that matches this schema perfectly:
{
  "name": "Catchy Catalog Name (e.g. Winter 2024 Collection)",
  "description": "A 1-2 sentence compelling description of this catalog.",
  "categories": ["Array of 1-3 broad product categories that relate to this prompt"],
  "tags": ["Array of 3-5 specific search tags related to this prompt"],
  "design": {
    "template": "one of: modern-blocks",
    "backgroundColor": "Hex color code matching the theme",
    "textColor": "Hex color code matching",
    "accentColor": "Hex color code complementing the theme"
  },
  "blocks": [
    {
      "id": "A unique lowercase string like 'hero-1'",
      "type": "hero",
      "content": { "title": "Big Catchy Headline", "subtitle": "Supporting text", "buttonText": "Shop Now" },
      "settings": { "alignment": "center", "overlayOpacity": 0.5 }
    },
    {
      "id": "A unique lowercase string like 'grid-1'",
      "type": "product_grid",
      "content": { "heading": "Featured Pieces" },
      "settings": { "columns": 3, "showPrices": true }
    },
    {
      "id": "A unique lowercase string like 'features-1'",
      "type": "features",
      "content": { "heading": "Why Choose Us", "description": "Highlight a specific vibe from the prompt" },
      "settings": { "layout": "image-right" }
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: aiPrompt }],
        temperature: 0.7,
        max_tokens: 400,
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI Catalog generation Error:', error);
      throw error;
    }
  },

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