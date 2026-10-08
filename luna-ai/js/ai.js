/**
 * js/ai.js - Integración Directa con Groq / Google Gemini Fast
 */
const LunaAI = (() => {
  let apiKey = localStorage.getItem('luna_api_key') || '';
  let provider = localStorage.getItem('luna_provider') || 'groq'; // 'groq' o 'gemini'

  const SYSTEM_PROMPT = `Eres Luna, una tierna gatita siamesa parlante asistente de Maia, una niña de 8 años. 
Hablas con un tono muy dulce, cariñoso y divertido. Usas onomatopeyas gatunas suaves como "¡Miau!", "purr..." y utilizas emojis lindos.
Respuestas cortas, positivas y fáciles de entender para una niña de 8 años.`;

  async function sendMessage(userText) {
    if (!apiKey) {
      return { reply: "¡Miau! Maia, dile a tu hermano o a tu papá que ingresen la clave secreta en el botón de configuración (⚙️) para que podamos hablar. 🐾" };
    }

    try {
      if (provider === 'groq') {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userText }
            ],
            temperature: 0.7
          })
        });

        const data = await response.json();
        return { reply: data.choices[0].message.content };
      } else {
        // Proveedor Google Gemini Fast
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nMaia dice: ${userText}` }] }]
          })
        });

        const data = await response.json();
        return { reply: data.candidates[0].content.parts[0].text };
      }
    } catch (err) {
      console.error(err);
      return { reply: "¡Miau! Ocurrió un pequeño problema con la conexión. ¡Inténtalo de nuevo!" };
    }
  }

  return {
    sendMessage,
    getApiKey: () => apiKey,
    getProvider: () => provider,
    saveConfig: (key, prov) => {
      apiKey = key;
      provider = prov;
      localStorage.setItem('luna_api_key', key);
      localStorage.setItem('luna_provider', prov);
    }
  };
})();