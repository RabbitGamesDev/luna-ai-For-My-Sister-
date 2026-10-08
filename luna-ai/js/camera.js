/**
 * js/camera.js - Cámara Filtros Estilo Instagram Stories & Galería para Maia
 */
const LunaCamera = (() => {
  let stream = null;
  let currentFilter = 'none';
  let facingMode = 'user'; // 'user' para frontal, 'environment' para trasera

  const FILTERS = [
    { id: 'none', label: ' Normal', style: 'none' },
    { id: 'pink', label: '🌸 Pink Glow', style: 'sepia(0.2) hue-rotate(300deg) saturate(1.4) brightness(1.05)' },
    { id: 'soft', label: '✨ Soft K-Pop', style: 'brightness(1.1) contrast(0.95) saturate(1.2)' },
    { id: 'warm', label: '☀️ Warm Sun', style: 'sepia(0.35) contrast(1.05) saturate(1.3)' },
    { id: 'bw', label: '🖤 B&W Chic', style: 'grayscale(1) contrast(1.1)' }
  ];

  function renderCameraView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="ig-camera-card" style="background: #000; border-radius: 24px; padding: 12px; color: #FFF; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center;">
        
        <!-- HEADER ESTILO IG STORIES -->
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; z-index: 5;">
          <span style="font-size: 13px; font-weight: bold; color: #FFB7B2; letter-spacing: 0.5px;">📸 LUNA CAM - IG STYLE</span>
          <button id="btn-flip-cam" style="background: rgba(255,255,255,0.2); border: none; color: #FFF; padding: 6px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; backdrop-filter: blur(5px);">🔄 Cambiar</button>
        </div>

        <!-- VISOR DE CÁMARA IG -->
        <div style="position: relative; width: 100%; height: 320px; border-radius: 18px; overflow: hidden; background: #111; margin: 10px 0; display: flex; justify-content: center; align-items: center;">
          <video id="ig-video" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; transition: filter 0.3s; filter: none;"></video>
          <canvas id="ig-canvas" style="display: none;"></canvas>
          <div id="cam-placeholder" style="position: absolute; text-align: center; color: #888; font-size: 13px;">Iniciando cámara de Maia... 🐾</div>
        </div>

        <!-- CARRUSEL DE FILTROS ESTILO INSTAGRAM -->
        <div style="width: 100%; overflow-x: auto; display: flex; gap: 8px; padding: 6px 0; margin-bottom: 12px; -webkit-overflow-scrolling: touch;">
          ${FILTERS.map(f => `
            <button class="btn-ig-filter ${f.id === 'none' ? 'active' : ''}" data-filter-id="${f.id}" style="background: rgba(255,255,255,0.15); border: 1.5px solid ${f.id === 'none' ? '#FFB7B2' : 'transparent'}; color: #FFF; padding: 6px 12px; border-radius: 16px; font-size: 11px; white-space: nowrap; cursor: pointer; backdrop-filter: blur(4px);">
              ${f.label}
            </button>
          `).join('')}
        </div>

        <!-- BOTÓN DE CAPTURA TIPO INSTAGRAM -->
        <div style="margin: 6px 0 14px 0;">
          <button id="btn-snap" style="width: 68px; height: 68px; border-radius: 50%; background: #FFF; border: 4px solid var(--pink-dark); cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 15px rgba(216,27,96,0.5); transition: transform 0.1s;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--pink-dark);"></div>
          </button>
        </div>

        <!-- GALERÍA INSTANTÁNEA -->
        <div style="width: 100%; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 10px;">
          <p style="font-size: 11px; color: #AAA; margin-bottom: 8px; font-weight: 600;">Galería de Maia 🖼️</p>
          <div id="ig-gallery" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px;"></div>
        </div>

      </div>
    `;

    initCamera();

    // Eventos de Filtros
    const filterBtns = container.querySelectorAll('.btn-ig-filter');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.style.borderColor = 'transparent');
        btn.style.borderColor = '#FFB7B2';
        
        const filterId = btn.getAttribute('data-filter-id');
        const selected = FILTERS.find(f => f.id === filterId);
        if (selected) {
          currentFilter = selected.style;
          const video = document.getElementById('ig-video');
          if (video) video.style.filter = currentFilter;
        }
      });
    });

    // Evento Tomar Foto
    const snapBtn = container.querySelector('#btn-snap');
    if (snapBtn) {
      snapBtn.addEventListener('click', takePhoto);
    }

    // Evento Voltear Cámara
    const flipBtn = container.querySelector('#btn-flip-cam');
    if (flipBtn) {
      flipBtn.addEventListener('click', () => {
        facingMode = facingMode === 'user' ? 'environment' : 'user';
        initCamera();
      });
    }
  }

  async function initCamera() {
    const video = document.getElementById('ig-video');
    const placeholder = document.getElementById('cam-placeholder');

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
      if (video) {
        video.srcObject = stream;
        if (placeholder) placeholder.style.display = 'none';
      }
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      if (placeholder) {
        placeholder.innerText = '📷 Activa los permisos de la cámara en tu navegador para ver a Luna.';
      }
    }
  }

  function takePhoto() {
    const video = document.getElementById('ig-video');
    const canvas = document.getElementById('ig-canvas');
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Aplicar el filtro actual al canvas antes de dibujar
    context.filter = currentFilter;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    addToGallery(dataUrl);

    if (typeof LunaVoice !== 'undefined') {
      LunaVoice.speak('¡Miau! ¡Qué fotaza Maia! Quedaste súper linda 💖📸');
    }
  }

  function addToGallery(dataUrl) {
    const gallery = document.getElementById('ig-gallery');
    if (!gallery) return;

    const item = document.createElement('div');
    item.style.cssText = 'position: relative; flex-shrink: 0; width: 70px; height: 70px; border-radius: 12px; overflow: hidden; border: 2px solid #FFB7B2;';
    
    item.innerHTML = `
      <img src="${dataUrl}" style="width: 100%; height: 100%; object-fit: cover;">
      <a href="${dataUrl}" download="Maia_Foto_${Date.now()}.png" style="position: absolute; bottom: 2px; right: 2px; background: rgba(0,0,0,0.6); color: #FFF; text-decoration: none; font-size: 10px; padding: 2px 4px; border-radius: 4px;">💾</a>
    `;

    gallery.insertBefore(item, gallery.firstChild);
  }

  return {
    render: renderCameraView
  };
})();