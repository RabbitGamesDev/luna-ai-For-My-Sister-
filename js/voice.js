/**
 * js/voice.js - Sintetizador de Voz Femenina de Luna (Limpio)
 */
const LunaVoice = (() => {
  const synth = window.speechSynthesis;

  // Filtro Regex para remover emojis y simbolos raros antes de hablar
  function cleanTextForSpeech(text) {
    return text
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .replace(/[*_~#`]/g, '') // Quitar formato markdown
      .trim();
  }

  function speak(text) {
    if (!synth) return;
    synth.cancel(); // Detener cualquier audio previo

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-MX';
    utterance.pitch = 1.3; // Tono más agudo / femenino
    utterance.rate = 1.0;  // Velocidad normal

    const voices = synth.getVoices();
    
    // Buscar explícitamente voces femeninas conocidas en navegadores
    const femaleVoice = voices.find(v => 
      v.lang.startsWith('es') && 
      (v.name.toLowerCase().includes('sabina') || 
       v.name.toLowerCase().includes('paulina') || 
       v.name.toLowerCase().includes('helena') || 
       v.name.toLowerCase().includes('monica') || 
       v.name.toLowerCase().includes('francisca') ||
       v.name.toLowerCase().includes('female') ||
       v.name.toLowerCase().includes('google español'))
    ) || voices.find(v => v.lang.startsWith('es'));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    synth.speak(utterance);
  }

  // Precargar voces
  if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => synth.getVoices();
  }

  return { speak };
})();