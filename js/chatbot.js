/* ==========================================================================
   OceanShield AI - Floating AI Chatbot & Voice Assistant Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  injectChatbotWidget();
});

function injectChatbotWidget() {
  const widgetHTML = `
    <div id="ai-chatbot-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 9990;">
      <button id="chatbot-toggle-btn" class="btn btn-primary" style="border-radius: 50%; width: 56px; height: 56px; padding: 0; box-shadow: 0 0 20px rgba(0, 242, 254, 0.5);">
        <i class="fa-solid fa-robot" style="font-size: 1.5rem;"></i>
      </button>

      <div id="chatbot-window" class="glass-card" style="display: none; position: absolute; bottom: 70px; right: 0; width: 350px; height: 480px; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-glass); border-color: var(--border-glow);">
        <div style="padding: 0.85rem 1rem; background: rgba(0, 242, 254, 0.1); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-brain text-gradient" style="font-size: 1.2rem;"></i>
            <h4 style="font-size: 0.95rem; margin: 0;">OceanShield AI Assistant</h4>
          </div>
          <button id="chatbot-close-btn" style="background: none; border: none; color: var(--text-muted); cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div id="chatbot-messages" style="flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
          <div style="background: rgba(0, 242, 254, 0.08); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            👋 Hello! I am <strong>OceanShield AI</strong>. How can I assist you with ocean hazard reporting, emergency evacuation routes, or cyclone advisories today?
          </div>
        </div>

        <div style="padding: 0.75rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.4rem; background: rgba(2, 8, 20, 0.9);">
          <input type="text" id="chatbot-input" placeholder="Ask AI assistant..." style="flex: 1; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.5rem; color: #fff; font-size: 0.85rem;">
          <button id="chatbot-voice-btn" class="btn btn-outline btn-sm" title="Voice Input"><i class="fa-solid fa-microphone"></i></button>
          <button id="chatbot-send-btn" class="btn btn-primary btn-sm"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const sendBtn = document.getElementById('chatbot-send-btn');
  const input = document.getElementById('chatbot-input');
  const voiceBtn = document.getElementById('chatbot-voice-btn');

  toggleBtn.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
  });

  sendBtn.addEventListener('click', () => handleChatSubmit(input));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSubmit(input);
  });

  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'en-US';
        showToast('🎙️ Listening... Speak your query', 'info');
        recognition.start();
        recognition.onresult = (event) => {
          input.value = event.results[0][0].transcript;
          handleChatSubmit(input);
        };
      } else {
        showToast('Voice recognition not supported in this browser', 'warning');
      }
    });
  }
}

function handleChatSubmit(inputEl) {
  const query = inputEl.value.trim();
  if (!query) return;

  const msgBox = document.getElementById('chatbot-messages');

  // User Message
  msgBox.innerHTML += `
    <div style="align-self: flex-end; background: var(--cyan-primary); color: #030a16; font-weight: 600; padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); max-width: 80%;">
      ${query}
    </div>
  `;

  inputEl.value = '';
  msgBox.scrollTop = msgBox.scrollHeight;

  // AI Answer Response Logic
  setTimeout(() => {
    let reply = "I am processing your query. For active emergencies, please press the **1-Click SOS** button on your dashboard immediately!";
    const q = query.toLowerCase();

    if (q.includes('shelter') || q.includes('safe')) {
      reply = "Nearest designated emergency cyclone shelters: **Government Model School (1.2 km)** & **Marina Community Hall (2.5 km)**. View interactive route on GIS Map!";
    } else if (q.includes('cyclone') || q.includes('storm')) {
      reply = "Warning: Severe Depression over Bay of Bengal. Wind speeds reaching 65 km/h. High tide expected at 01:45 AM. Stay tuned to Orange Alerts.";
    } else if (q.includes('report') || q.includes('hazard')) {
      reply = "You can report high waves, oil spills, or missing fishermen on the **Report Ocean Hazard** page. Instant AI Computer Vision scan will verify your upload!";
    } else if (q.includes('sos') || q.includes('help')) {
      reply = "🚨 Emergency SOS active! Live GPS location shared with Coast Guard Command & NDRF Unit 04.";
    }

    msgBox.innerHTML += `
      <div style="background: rgba(0, 242, 254, 0.08); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); max-width: 85%;">
        🤖 ${reply}
      </div>
    `;
    msgBox.scrollTop = msgBox.scrollHeight;
    speakText(reply.replace(/[*#]/g, ''));
  }, 600);
}
