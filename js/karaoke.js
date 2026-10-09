/**
 * js/karaoke.js - Karaoke Pro para Maia (Buscador Libre de YouTube + Favoritas)
 */
const LunaKaraoke = (() => {
  // Tus canciones favoritas fijas
  const playlist = [
    { title: "Tutu - Camilo", id: "b1mbJv2994U" },
    { title: "Hasta La Raíz - Natalia Lafourcade", id: "zB8L3tB3V0s" },
    { title: "Shakira - Acróstico", id: "x4632mC76m8" },
    { title: "Floricienta — Flores Amarillas", id: "uD0W_J5aJ00" },
    { title: "Ángela Aguilar - Dime Cómo Quieres", id: "4-An1MAt4e0" }
  ];

  function renderKaraokeView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="background: #1E1E2E; border-radius: 20px; padding: 16px; color: #FFF; text-align: center;">
        <h3 style="color: #FF7597; margin-bottom: 12px; font-size: 18px;">🎤 Karaoke Pro de Maia</h3>
        
        <!-- BUSCADOR -->
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
          <input type="text" id="yt-search-input" placeholder="Buscar cualquier canción en YouTube..." style="flex: 1; padding: 10px 14px; border-radius: 20px; border: none; font-size: 13px; outline: none; color: #333;">
          <button id="btn-search-yt" style="background: #FF7597; color: #FFF; border: none; padding: 10px 16px; border-radius: 20px; font-weight: bold; cursor: pointer; white-space: nowrap;">🔍 Buscar</button>
        </div>

        <!-- REPRODUCTOR EMBED SEGURO -->
        <div id="yt-player-container" style="width: 100%; height: 210px; border-radius: 14px; overflow: hidden; background: #000; position: relative; margin-bottom: 12px;">
          <iframe id="yt-iframe" 
            style="width: 100%; height: 100%; border: none;" 
            src="https://www.youtube-nocookie.com/embed/${playlist[0].id}?autoplay=0&rel=0&enablejsapi=1" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>

        <!-- CONTENEDOR DE RESULTADOS DE BÚSQUEDA -->
        <div id="yt-search-results" style="display: none; flex-direction: column; gap: 8px; max-height: 160px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 12px; margin-bottom: 12px;"></div>

        <!-- LISTA FINA DE FAVORITAS -->
        <div style="text-align: left; font-size: 11px; color: #FF7597; margin-bottom: 6px; font-weight: bold;">⭐ Canciones Favoritas:</div>
        <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px;">
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
    const resultsContainer = container.querySelector('#yt-search-results');

    // Reproducir un video por su ID
    function playVideo(videoId) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;
    }

    // Búsqueda libre en vivo usando API pública de Piped
    async function searchYouTube(query) {
      if (!query.trim()) return;
      
      searchBtn.textContent = '⏳ ...';
      resultsContainer.style.display = 'flex';
      resultsContainer.innerHTML = '<div style="font-size: 12px; color: #AAA;">Buscando en YouTube...</div>';

      try {
        const searchQuery = encodeURIComponent(query + " karaoke");
        const res = await fetch(`https://pipedapi.kavin.rocks/search?q=${searchQuery}&filter=videos`);
        const data = await res.json();

        resultsContainer.innerHTML = '';

        if (!data.items || data.items.length === 0) {
          resultsContainer.innerHTML = '<div style="font-size: 12px; color: #AAA;">No se encontraron resultados.</div>';
          searchBtn.textContent = '🔍 Buscar';
          return;
        }

        // Mostrar los primeros 5 resultados
        data.items.slice(0, 5).forEach(item => {
          const videoId = item.url.replace('/watch?v=', '');
          const card = document.createElement('div');
          card.style.cssText = 'display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.08); padding: 6px; border-radius: 8px; cursor: pointer; text-align: left;';
          card.innerHTML = `
            <img src="${item.thumbnail}" style="width: 45px; height: 35px; border-radius: 4px; object-fit: cover;">
            <div style="flex: 1; overflow: hidden;">
              <div style="font-size: 11px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #FFF;">${item.title}</div>
              <div style="font-size: 9px; color: #AAA;">${item.uploaderName}</div>
            </div>
          `;

          card.addEventListener('click', () => {
            playVideo(videoId);
          });

          resultsContainer.appendChild(card);
        });

      } catch (err) {
        console.error("Error al buscar en YouTube:", err);
        resultsContainer.innerHTML = '<div style="font-size: 12px; color: #FF6B6B;">Error de red al buscar. Usa las canciones favoritas.</div>';
      } finally {
        searchBtn.textContent = '🔍 Buscar';
      }
    }

    // Eventos de búsqueda
    searchBtn.addEventListener('click', () => searchYouTube(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchYouTube(searchInput.value);
    });

    // Eventos botones favoritos
    container.querySelectorAll('.song-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        resultsContainer.style.display = 'none';
        const id = btn.getAttribute('data-id');
        playVideo(id);
      });
    });
  }

  return { render: renderKaraokeView };
})();
