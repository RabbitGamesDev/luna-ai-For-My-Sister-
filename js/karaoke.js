/**
 * js/karaoke.js - Karaoke Pro para Maia (Sin Error 153)
 */
const LunaKaraoke = (() => {
  // Lista de videos con ID directo para evitar bloqueo 153
  const playlist = [
    { title: "Tutu-Camilo", id: "b1mbJv2994U" },
    { title: "Hasta La Raíz - Natalia Lafourcade", id: "zB8L3tB3V0s" },
    { title: "Shakira - Acróstico", id: "x4632mC76m8" },
    { title: "Floricienta — Flores Amarillas", id: "uD0W_J5aJ00" },
    { title: "Ángela Aguilar - Dime Cómo Quieres", id: "A_cUh..." },
  ];

  function renderKaraokeView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="background: #1E1E2E; border-radius: 20px; padding: 16px; color: #FFF; text-align: center;">
        <h3 style="color: #FF7597; margin-bottom: 12px; font-size: 18px;">🎤 Karaoke Pro de Maia</h3>
        
        <!-- BUSCADOR / INPUT DE URL O BÚSQUEDA -->
        <div style="display: flex; gap: 8px; margin-bottom: 14px;">
          <input type="text" id="yt-search-input" placeholder="Escribe el ID o nombre de canción..." style="flex: 1; padding: 10px 14px; border-radius: 20px; border: none; font-size: 13px; outline: none; color: #333;">
          <button id="btn-search-yt" style="background: #FF7597; color: #FFF; border: none; padding: 10px 16px; border-radius: 20px; font-weight: bold; cursor: pointer;">🔍 Cargar</button>
        </div>

        <!-- REPRODUCTOR EMBED SEGURO -->
        <div id="yt-player-container" style="width: 100%; height: 210px; border-radius: 14px; overflow: hidden; background: #000; position: relative;">
          <iframe id="yt-iframe" 
            style="width: 100%; height: 100%; border: none;" 
            src="https://www.youtube-nocookie.com/embed/${playlist[0].id}?autoplay=0&rel=0&enablejsapi=1" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>

        <!-- LISTA RÁPIDA -->
        <div style="display: flex; gap: 6px; overflow-x: auto; margin-top: 12px; padding-bottom: 6px;">
          ${playlist.map(item => `
            <button class="song-quick-btn" data-id="${item.id}" style="background: rgba(255,255,255,0.1); color: #FFF; border: 1px solid #FF7597; padding: 6px 12px; border-radius: 12px; font-size: 11px; white-space: nowrap; cursor: pointer;">
              🎵 ${item.title}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const iframe = container.querySelector('#yt-iframe');
    const searchBtn = container.querySelector('#btn-search-yt');
    const searchInput = container.querySelector('#yt-search-input');

    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (!query) return;

      // Extraer ID si pegan una URL de YouTube o usar término de búsqueda limpia
      let videoId = query;
      if (query.includes('v=')) {
        videoId = query.split('v=')[1].split('&')[0];
      } else if (query.includes('youtu.be/')) {
        videoId = query.split('youtu.be/')[1].split('?')[0];
      }

      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;
    });

    container.querySelectorAll('.song-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&enablejsapi=1`;
      });
    });
  }

  return { render: renderKaraokeView };
})();
