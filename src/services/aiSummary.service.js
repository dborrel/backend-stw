async function generateSummary(events) {
  try {

    if (!events || events.length === 0) {
      return {
        summary: "No hay eventos para este criterio.",
        highlights: []
      };
    }

    const simplified = events.slice(0, 20).map(e => ({
      id: e._id,
      titulo: e.title,
      categoria: e.category,
      fecha: e.startDate
    }));

    // 👉 TU PROMPT ORIGINAL (no lo toco)
    const prompt = `
Eres un sistema que analiza eventos en Zaragoza.

Tu tarea tiene DOS PARTES:

1. Generar un RESUMEN general (5 a 10 líneas)
- Describe tendencias (categorías, tipos de eventos)
- NO menciones nombres concretos
- NO recomiendes

2. Seleccionar 3 a 5 eventos destacados

FORMATO (JSON PURO):

{
  "summary": "texto con saltos de línea",
  "highlights": [
    { "text": "breve descripción", "eventId": "id" }
  ]
}

EVENTOS:
${JSON.stringify(simplified, null, 2)}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("Respuesta IA inválida");
    }

    let text = result.response.text();

    if (!text) {
      throw new Error("Texto vacío de IA");
    }

    console.log("IA RAW:", text);

    // limpiar markdown típico de Gemini
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsed;

    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;

      if (jsonStart === -1) throw new Error("No JSON found");

      const cleanJson = text.slice(jsonStart, jsonEnd);

      try {
        parsed = JSON.parse(cleanJson);
      } catch (err) {
        console.log("FALLBACK PARSE ACTIVADO");

        return {
          summary: text.substring(0, 500), // usa el texto bruto como resumen
          highlights: events.slice(0, 3).map(e => ({
            text: e.title,
            eventId: e._id
          }))
        };
      }
      console.log("IA RAW:", text);
    } catch (err) {
      console.log("IA RAW:", text);
      console.log("PARSE ERROR:", err.message);
      throw err;
    }

    return {
      summary: parsed.summary || "",
      highlights: parsed.highlights || []
    };

  } catch (err) {
    console.error("ERROR IA:", err);

    return {
      summary: "No se pudo generar el resumen.",
      highlights: events.slice(0, 3).map(e => ({
        text: e.title,
        eventId: e._id
      }))
    };
  }
}

module.exports = generateSummary;