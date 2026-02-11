const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

const InwardMail = require("../models/InwardMail");
const OutwardMail = require("../models/OutwardMail");
const User = require("../models/User");
const Department = require("../models/Department");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Please ask a question." });
    }

    /* =====================================================
       STEP 1: FETCH DATABASE CONTEXT
    ====================================================== */

    const [
      inwardMails,
      outwardMails,
      users,
      departments
    ] = await Promise.all([
      InwardMail.find().limit(10).lean(),
      OutwardMail.find().limit(10).lean(),
      User.find().limit(10).lean(),
      Department.find().lean()
    ]);

    /* =====================================================
       STEP 2: BUILD SMART DATABASE CONTEXT
    ====================================================== */

    const dbContext = `
SYSTEM DATABASE SUMMARY:

Users (${users.length}):
${users.map(u => 
  `- ${u.fullName || u.name} | ${u.email} | Role: ${u.role}`
).join("\n")}

Departments (${departments.length}):
${departments.map(d =>
  `- ${d.name} (Code: ${d.code})`
).join("\n")}

Recent Inward Mails (${inwardMails.length}):
${inwardMails.map(m =>
  `- ${m.mailId || m._id} | ${m.subject} | Status: ${m.status}`
).join("\n")}

Recent Outward Mails (${outwardMails.length}):
${outwardMails.map(m =>
  `- ${m.mailId || m._id} | ${m.subject} | Status: ${m.status}`
).join("\n")}
`;

    /* =====================================================
       STEP 3: FINAL AI PROMPT
    ====================================================== */

    const prompt = `
You are Tapaal AI Assistant for a Government Mail Management System.

You have access to live system database data below.

${dbContext}

Instructions:
- Answer using database data when question relates to system.
- If user asks about specific ID, search in provided data.
- If user asks to draft email, generate professional formatted email.
- If user asks general knowledge question, answer normally.
- Be intelligent and conversational like ChatGPT.
- If data not available, say politely that it's not found.

User Question:
"${message}"
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.json({ reply });

  } catch (error) {
    console.error("🔥 AI ERROR:", error.message);

    return res.json({
      reply: "⚠️ AI service temporarily unavailable."
    });
  }
});

module.exports = router;
