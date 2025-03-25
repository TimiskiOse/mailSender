import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Define `__dirname` manually for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// ✅ Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Email Sending Route
app.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !html) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log(`📩 Sending email to: ${to}`);

    await transporter.sendMail({
      from: `"VISTA FINANCE" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html, // ✅ Ensure HTML content is sent
      attachments: [
        {
          filename: "companylogo.jpg",
          path: path.join(__dirname, "public/companylogo.jpg"),
          cid: "companylogo", // Content ID for embedding
        },
      ],
    });

    console.log("✅ Email sent successfully!");
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error });
  }
});

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend/dist");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
