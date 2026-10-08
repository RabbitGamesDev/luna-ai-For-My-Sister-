/**
 * js/admin.js - Panel de Control para Padres & Configuración
 */
const LunaAdmin = (() => {
  const DEFAULT_PIN = '8523'; // PIN de seguridad para acceder al panel de padres

  function renderAdminView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentKey = LunaAI.getApiKey();
    const currentProvider = LunaAI.getProvider();

    container.innerHTML = `
      <div class="journal-paper">
        <div class="journal-header">
          <h3>⚙️ Panel para Padres</h3>
          <span style="font-size: 12px; color: #888;">Configuración</span>
        </div>

        <!-- ACCESO PIN DE SEGURIDAD -->
        <div id="admin-auth-section" class="journal-card">
          <h4>🔐 Ingresa el PIN de seguridad</h4>
          <p style="font-size: 12px; color: #666; margin-bottom: 10px;">Para cambiar la API Key o la voz, ingresa el PIN (Solo Padres).</p>
          <div style="display: flex; gap: 8px;">
            <input type="password" id="admin-pin-input" placeholder="PIN" style="flex: 1; border: 1.5px solid #FFCC80; border-radius: 10px; padding: 8px 12px; outline: none; font-size: 14px;">
            <button id="btn-unlock-admin" class="btn-action-primary" style="width: auto; padding: 8px 16px;">Entrar</button>
          </div>
        </div>

        <!-- CONTENIDO PROTEGIDO (CONFIGURACIÓN) -->
        <div id="admin-settings-section" style="display: none;">
          
          <div class="journal-card">
            <h4>🔑 Configuración de API Key (IA)</h4>
            <p style="font-size: 12px; color: #666; margin-bottom: 8px;">Esta clave permite a la gatita Luna responderle a Maia.</p>
            
            <label style="font-size: 12px; font-weight: bold; color: var(--brown-cat); display: block; margin-bottom: 4px;">Proveedor de IA:</label>
            <select id="admin-provider-select" style="width: 100%; border: 1.5px solid #FFCC80; border-radius: 10px; padding: 8px; font-size: 13px; margin-bottom: 10px; outline: none;">
              <option value="groq" ${currentProvider === 'groq' ? 'selected' : ''}>Groq API (Llama 3.3 - Gratis y Rápido)</option>
              <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>Gemini Fast / Flash</option>
            </select>

            <label style="font-size: 12px; font-weight: bold; color: var(--brown-cat); display: block; margin-bottom: 4px;">Clave Secreta (API Key):</label>
            <input type="password" id="admin-key-input" value="${currentKey}" placeholder="gsk_... o sk-..." style="width: 100%; border: 1.5px solid #FFCC80; border-radius: 10px; padding: 8px 12px; font-size: 13px; outline: none;">
          </div>

          <div class="journal-card">
            <h4>🔊 Estado de Voz</h4>
            <p style="font-size: 12px; color: #666;">La app selecciona automáticamente la voz femenina en español disponible en el dispositivo de Maia.</p>
          </div>

          <button id="btn-save-admin" class="btn-action-primary">Guardar Configuración 💾</button>
        </div>

      </div>
    `;

    // Lógica de Validación de PIN
    const authSection = container.querySelector('#admin-auth-section');
    const settingsSection = container.querySelector('#admin-settings-section');
    const unlockBtn = container.querySelector('#btn-unlock-admin');
    const pinInput = container.querySelector('#admin-pin-input');

    if (unlockBtn && pinInput) {
      unlockBtn.addEventListener('click', () => {
        if (pinInput.value === DEFAULT_PIN) {
          authSection.style.display = 'none';
          settingsSection.style.display = 'block';
        } else {
          alert('❌ PIN incorrecto. Intenta de nuevo.');
          pinInput.value = '';
        }
      });
    }

    // Lógica de Guardado de Configuración
    const saveBtn = container.querySelector('#btn-save-admin');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const keyVal = container.querySelector('#admin-key-input').value;
        const providerVal = container.querySelector('#admin-provider-select').value;

        LunaAI.saveConfig(keyVal, providerVal);

        const banner = document.getElementById('api-warning-banner');
        if (banner) {
          banner.style.display = keyVal ? 'none' : 'block';
        }

        alert('✅ ¡Configuración guardada con éxito!');
      });
    }
  }

  return {
    render: renderAdminView
  };
})();