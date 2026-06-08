const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const SYSTEM_PROMPT = `You are a helpful assistant for Lampro Nepal, a national LED display sales and installation company.
You help customers with product inquiries, pricing, specifications, and general support.
Key facts:
- We sell fixed and movable LED displays for Indoor, Outdoor, and Events, with full installation and service.
- P2.5 LED display costs approximately Rs. 12,000 per sqft.
- 103-inch LED display costs approximately Rs. 4,15,000 excluding installation.
- We do NOT rent LED displays or digital standees.
- Contact: +977 9709066376
- To recommend the right product, ask: 1) Indoor or outdoor use 2) Pixel requirements 3) Purpose 4) Size needed 5) Photo of space 6) Company details
Always respond professionally and concisely. Reply in the same language the customer uses (Nepali or English).
Keep responses under 200 words and suitable for WhatsApp/social media messaging.`;


app.get("/", (req, res) => res.json({ status: "Gemini middleware is running - Lampro Nepal Bot" }));


app.post("/chat", async (req, res) => {
  try {
    const body = req.body;
    const userMessage = body.message || body.text || body.input || body.last_input || body.subscriber_input || "Hello";
    const subscriberName = body.subscriber_name || body.name || "Customer";


    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });


    const result = await model.generateContent(userMessage);
    const replyText = result.response.text();


    res.json({
