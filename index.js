const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant for Evolve Tech, a national trading and distribution company.
You help customers with product inquiries, order status, delivery information, and general support.
Always respond professionally and concisely. Keep responses under 300 words and suitable for WhatsApp.`;

app.get("/", (req, res) => res.json({ status: "Claude middleware running" }));

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || req.body.text || req.body.last_input || req.body.subscriber_input || "Hello";
    const subscriberName = req.body.subscriber_name || req.body.name || "Customer";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const replyText = response.content[0].text;
    res.json({ success: true, reply: replyText, data: { reply: replyText, subscriber_name: subscriberName } });
  } catch (error) {
    console.error("Claude error:", error);
    res.status(500).json({ success: false, reply: "Sorry, I am having trouble right now. Please try again shortly." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Claude middleware running on port ${PORT}`));
module.exports = app;
