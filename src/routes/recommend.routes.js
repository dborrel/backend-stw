const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Event = require("../models/Event");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { companion, vibe } = req.body;

    console.log("BODY:", req.body);

    if (!companion || !vibe) {
      return res.status(400).json({ message: "Faltan parámetros" });
    }

    // 🔹 Traducción para IA (tu lógica original)
    const companionText = {
      solo: "solo",
      pareja: "en pareja",
      grupo: "en grupo de amigos",
      familia: "en familia con niños",
    }[companion] ?? companion;

    const vibeText = {
      tranquilo: "algo tranquilo y relajado",
      emocionante: "algo emocionante y con adrenalina",
      exterior: "una actividad al aire libre",
      interior: "un plan bajo techo",
      gastronomico: "algo relacionado con gastronomía o buena comida",
      cultural: "algo cultural, artístico o con historia",
    }[vibe] ?? vibe;

    // 🔹 PROMPT (IA SOLO CLASIFICA)
    const prompt = `
Eres SpAlk, un asistente experto en recomendar planes en Zaragoza.

Tu función NO es inventar eventos.
Tu función es interpretar la intención del usuario para filtrar eventos reales en una base de datos.

El usuario quiere:
- Ir: ${companionText}
- Busca: ${vibeText}

Tu tarea:
1. Analiza la intención
2. Devuelve SOLO una categoría de evento de esta lista:
- deporte
- musica
- cultura
- gastronomia
- social

Reglas:
- Responde SOLO con una palabra
- Sin frases
- Sin explicaciones
- Sin texto adicional
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    const category = result.response.text().trim().toLowerCase();

    console.log("IA CATEGORY:", category);

    // 🔹 QUERY REAL EN MONGO
    const events = await Event.find({
      category: { $regex: category, $options: "i" },
      status: "active"
    })
      .sort({ startDate: 1 })
      .limit(6);

    console.log("EVENTS FOUND:", events.length);

    res.json({ events });

  } catch (error) {
    console.error("❌ ERROR EN /api/recommend:", error);
    res.status(500).json({ message: "Error interno" });
  }
});

module.exports = router;