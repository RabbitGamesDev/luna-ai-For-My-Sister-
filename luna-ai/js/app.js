/**
 * js/app.js - Orquestador Principal de Luna AI (SPA)
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Elementos de Navegación y Vistas
  const navBtns = document.querySelectorAll('.nav-btn');
  const viewContainers = document.querySelectorAll('.view-container');
  
  // 2. Elementos del Chat Flotante
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const apiWarningBanner = document.getElementById('api-warning-banner');

  // --- NAVEGACIÓN ENTRE VISTAS ---
  function switchView(targetViewId) {
    // Ocultar todas las vistas y desactivar botones
    viewContainers.forEach(container => container.classList.remove('active'));
    navBtns.forEach(btn => btn.classList.remove('active'));

    // Activar vista seleccionada
    const activeView = document.getElementById(`view-${targetViewId}`);
    if (activeView) {
      activeView.classList.add('active');
    }

    // Activar botón correspondiente
    const activeBtn = document.querySelector(`.nav-btn[data-view="${targetViewId}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // Renderizar contenido dinámico según la vista activa
    switch (targetViewId) {
      case 'journal':
        if (typeof LunaJournal !== 'undefined') LunaJournal.render('view-journal');
        break;
      case 'karaoke':
        if (typeof LunaKaraoke !== 'undefined') LunaKaraoke.render('view-karaoke');
        break;
      case 'camera':
        if (typeof LunaCamera !== 'undefined') LunaCamera.render('view-camera');
        break;
      case 'admin':
        if (typeof LunaAdmin !== 'undefined') LunaAdmin.render('view-admin');
        break;
      default:
        break;
    }
  }

  // Asignar listeners a los botones de navegación
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      switchView(view);
    });
  });

  // --- LÓGICA DEL CHAT DE LUNA ---
  function appendMessage(sender, text) {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'luna-bubble'}`;
    
    if (sender === 'luna') {
      msgDiv.innerHTML = `<span class="luna-name">Luna 🐾</span>${text}`;
    } else {
      msgDiv.textContent = text;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      // Mostrar mensaje de Maia
      appendMessage('user', text);
      chatInput.value = '';

      // Indicador de "Escribiendo..."
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chat-bubble luna-bubble typing';
      typingIndicator.innerHTML = '<i>Luna está pensando... 🐾</i>';
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Enviar a la IA
      const response = await LunaAI.sendMessage(text);
      
      // Remover indicador de carga
      if (typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
      }

      // Mostrar respuesta y sintetizar voz femenina con animación
      appendMessage('luna', response.reply);
      if (typeof LunaVoice !== 'undefined') {
        LunaVoice.speak(response.reply);
      }
    });
  }

  // --- VERIFICACIÓN DE API KEY AL INICIAR ---
  function checkApiKey() {
    const key = LunaAI.getApiKey();
    if (!key && apiWarningBanner) {
      apiWarningBanner.style.display = 'block';
    } else if (apiWarningBanner) {
      apiWarningBanner.style.display = 'none';
    }
  }

  // Inicialización de la App
  checkApiKey();
  switchView('home'); // Cargar la vista principal por defecto
});