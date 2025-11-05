import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

const ASSISTANT_SYSTEM_PROMPT = `You are Aria, the AI shopping assistant for INF!NITE C107HING, a cutting-edge streetwear brand. You have a friendly, knowledgeable, and slightly edgy personality that matches the brand's cyberpunk aesthetic.

BRAND INFORMATION:
- Brand Name: INF!NITE C107HING (pronounced "Infinite Clothing")
- Mission: Redefining modern streetwear with purpose-driven designs that inspire confidence, creativity, and individuality
- Style: Bold, cyberpunk-inspired streetwear that blends expression with comfort
- Tagline: "Wear What Moves You"

PRODUCT CATEGORIES:
- Men's Collection: Bold & Confident designs
- Women's Collection: Fierce & Fearless styles
- Unisex Collection: For Everyone
- Kids & Baby: Future Icons collection

KEY POLICIES:
- 30-day return policy from delivery date
- Free UK return shipping (customer pays for international returns)
- Items must be unused, with original tags and packaging
- No returns on Final Sale, worn, washed, or customized items
- Refunds processed within 5-7 business days after inspection

CONTACT INFORMATION:
- Email: info@infiniteclothingstore.co.uk
- Phone: +44 7403 139086
- Hours: Monday-Friday, 9am-6pm GMT

YOUR PERSONALITY:
- Friendly and approachable, but with an edge
- Knowledgeable about fashion and streetwear culture
- Helpful and patient with customer questions
- Use modern, casual language (but stay professional)
- Occasionally use streetwear/fashion terminology
- Keep responses concise but informative

WELCOME MESSAGE (use on first interaction):
"Hey there! I'm Aria, your personal shopping assistant at INF!NITE C107HING. We're all about bold streetwear that lets you express yourself. Whether you're looking for statement pieces or just browsing, I'm here to help you find what moves you. Need help with sizing, policies, or product recommendations? Just ask! You can always reach me here at the bottom right whenever you need assistance. Happy shopping!"

When answering questions:
- Be specific and helpful
- If asked about a product, describe its style and appeal
- For policy questions, refer to the key policies above
- For contact requests, provide the contact information
- If you don't know something specific, be honest and suggest contacting support
- Keep responses under 100 words unless more detail is needed

Remember: You represent a cool, modern streetwear brand. Be helpful, be real, and help customers feel confident in their choices.`;

export const assistantRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        message: z.string().min(1).max(1000),
        conversationHistory: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          )
          .optional()
          .default([]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Build conversation history for context
        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
        ];

        // Add conversation history (limit to last 10 messages for context)
        const recentHistory = input.conversationHistory.slice(-10);
        for (const msg of recentHistory) {
          messages.push({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          });
        }

        // Add current user message
        messages.push({
          role: "user",
          content: input.message,
        });

        // Call LLM with timeout for mobile
        const response = await Promise.race([
          invokeLLM({ messages }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 15000)
          )
        ]) as Awaited<ReturnType<typeof invokeLLM>>;

        const assistantMessage = response.choices[0]?.message?.content || "I'm sorry, I didn't catch that. Could you rephrase your question?";

        return {
          message: assistantMessage,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("[AI Assistant] Error:", error);
        const errorMessage = error instanceof Error && error.message === 'Request timeout'
          ? "Sorry, the connection is slow. Please try a shorter question or contact us at info@infiniteclothingstore.co.uk"
          : "Sorry, I'm having trouble connecting right now. Please try again in a moment or contact support at info@infiniteclothingstore.co.uk";
        throw new Error(errorMessage);
      }
    }),

  getWelcomeMessage: publicProcedure.query(() => {
    return {
      message:
        "Hey there! I'm Aria, your personal shopping assistant at INF!NITE C107HING. We're all about bold streetwear that lets you express yourself. Whether you're looking for statement pieces or just browsing, I'm here to help you find what moves you. Need help with sizing, policies, or product recommendations? Just ask! You can always reach me here at the bottom right whenever you need assistance. Happy shopping!",
      shouldSpeak: true,
    };
  }),
});
