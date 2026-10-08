/**
 * js/journal.js - Diario de Maia estilo Libreta Digital con Espiral
 */
const LunaJournal = (() => {
  let maiaPin = localStorage.getItem('maia_journal_pin') || '1234';
  let isAuthenticated = false;

  function renderJournalView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!isAuthenticated) {
      container.innerHTML = `
        <div style="background: #FFF0F5; border-radius: 20px; padding: 24px; text-align: center; margin-top: 40px; border: 2px solid #FFD2D7;">
          <h3 style="color: #FF7597; margin-bottom: 8px;">🔐 Diario Secreto de Maia</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 16px;">Ingresa tu PIN de 4 dígitos para abrir tu libreta (CONTRASEÑA: 1234)</p>
          <input type="password" id="maia-pin-input" maxlength="4" placeholder="****" style="width: 120px; text-align: center; font-size: 22px; padding: 8px; border-radius: 12px; border: 2px solid #FF7597; outline: none; margin-bottom: 12px;">
          <br>
          <button id="btn-unlock-journal" style="background: #FF7597; color: #FFF; border: none; padding: 10px 24px; border-radius: 14px; font-weight: bold; cursor: pointer;">Abrir Diario ✨</button>
        </div>
      `;

      container.querySelector('#btn-unlock-journal').addEventListener('click', () => {
        const val = container.querySelector('#maia-pin-input').value;
        if (val === maiaPin) {
          isAuthenticated = true;
          renderJournalView(containerId);
        } else {
          alert('❌ PIN incorrecto Maia. ¡Pídeselo a tu hermano o papá!');
        }
      });
      return;
    }

    const todayDate = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    container.innerHTML = `
      <div class="journal-binder">
        <div class="journal-title-block">
          📖 Daily Routine
          <span style="display: block; font-size: 11px; color: #888; font-weight: normal;">${todayDate}</span>
        </div>

        <div class="journal-grid-layout">
          <!-- MY MOOD -->
          <div class="journal-section-box" style="background: #F3E5F5;">
            <span class="journal-section-title">My Mood</span>
            <div class="mood-selector">
              <span class="mood-btn" data-mood="happy">😊</span>
              <span class="mood-btn" data-mood="neutral">😐</span>
              <span class="mood-btn" data-mood="sad">😢</span>
              <span class="mood-btn" data-mood="excited">🤩</span>
            </div>
          </div>

          <!-- HOURS OF SLEEP -->
          <div class="journal-section-box" style="background: #E1F5FE;">
            <span class="journal-section-title">Hours of Sleep 😴</span>
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
              <label><input type="radio" name="sleep" value="4-6"> 4-6h</label>
              <label><input type="radio" name="sleep" value="7-8" checked> 7-8h</label>
              <label><input type="radio" name="sleep" value="9+"> 9h+</label>
            </div>
          </div>
        </div>

        <!-- TO DO LIST -->
        <div class="journal-section-box" style="margin-top: 10px; background: #FFFDE7;">
          <span class="journal-section-title">To Do List 📝</span>
          <div class="todo-item"><input type="checkbox"> <span>Hacer la tarea de la escuela</span></div>
          <div class="todo-item"><input type="checkbox"> <span>Jugar con la gatita Luna</span></div>
          <div class="todo-item"><input type="checkbox"> <span>Practicar una canción en Karaoke</span></div>
        </div>

        <!-- GOALS / HOY DÍA -->
        <div class="journal-section-box" style="margin-top: 10px; background: #E8F5E9;">
          <span class="journal-section-title">Goals & Notes 🌟</span>
          <textarea class="journal-textarea" id="journal-text-entry" placeholder="Hoy 8 de octubre estoy feliz hoy en la escuela fue un gran día..."></textarea>
        </div>

        <button id="btn-save-journal-entry" style="width: 100%; margin-top: 12px; background: #FF7597; color: #FFF; border: none; padding: 12px; border-radius: 14px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(255,117,151,0.3);">
          Guardar En Mi Diario 💖
        </button>
      </div>
    `;

    // Interactividad Mood
    const moodBtns = container.querySelectorAll('.mood-btn');
    moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        moodBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    // Guardado
    container.querySelector('#btn-save-journal-entry').addEventListener('click', () => {
      const text = container.querySelector('#journal-text-entry').value;
      localStorage.setItem('maia_last_entry', text);
      alert('✨ ¡Entrada guardada en tu libreta secreta Maia!');
    });
  }

  return { render: renderJournalView };
})();