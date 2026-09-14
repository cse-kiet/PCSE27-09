/**
 * Floating AI Crime Safety Assistant Chatbot Widget
 * Automatically initializes floating chat button & modal
 */

document.addEventListener('DOMContentLoaded', () => {
    initAIChatbot();
});

function initAIChatbot() {
    if (document.getElementById('ai-chatbot-btn')) return;

    // Create Floating Toggle Button
    const chatBtn = document.createElement('button');
    chatBtn.id = 'ai-chatbot-btn';
    chatBtn.className = 'fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl flex items-center justify-center text-2xl z-50 hover:scale-110 active:scale-95 transition-all border border-white/20 cursor-pointer';
    chatBtn.innerHTML = `<i class="fa-solid fa-robot animate-pulse"></i>`;
    chatBtn.title = "Ask AI Crime Assistant";

    // Create Chat Modal Container
    const chatModal = document.createElement('div');
    chatModal.id = 'ai-chatbot-modal';
    chatModal.className = 'fixed bottom-24 right-6 w-96 max-w-[90vw] h-[520px] bg-slate-900/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl shadow-2xl z-50 flex flex-col hidden overflow-hidden transition-all duration-300 transform translate-y-4';

    chatModal.innerHTML = `
        <!-- Chat Header -->
        <div class="p-4 bg-gradient-to-r from-purple-900/80 via-slate-900 to-pink-900/80 border-b border-purple-500/20 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-bold">
                    <i class="fa-solid fa-brain text-lg"></i>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-white font-heading">Crime Safety AI Assistant</h4>
                    <p class="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Intelligence Model
                    </p>
                </div>
            </div>
            <button id="ai-chat-close" class="text-slate-400 hover:text-white text-lg p-1 transition-colors">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <!-- Chat History Scroll Window -->
        <div id="ai-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed font-sans">
            <div class="bg-purple-950/40 border border-purple-500/20 rounded-xl p-3 text-slate-200">
                🤖 <strong>Hello! I am your AI Safety Assistant.</strong> Ask me anything about district safety, emergency numbers, or crime statistics across India!
            </div>

            <!-- Quick Suggestion Chips -->
            <div class="flex flex-wrap gap-1.5 pt-1" id="chat-quick-chips">
                <button class="chip-btn" onclick="sendQuickPrompt('Is Jaipur safe?')">Is Jaipur safe?</button>
                <button class="chip-btn" onclick="sendQuickPrompt('What are top crimes in Delhi?')">Delhi Stats</button>
                <button class="chip-btn" onclick="sendQuickPrompt('Show emergency helplines')">🚨 Helplines</button>
                <button class="chip-btn" onclick="sendQuickPrompt('How does K-Means work?')">🤖 AI Models</button>
            </div>
        </div>

        <!-- Chat Input Footer -->
        <div class="p-3 bg-slate-950/90 border-t border-purple-500/20 flex items-center gap-2">
            <input type="text" id="ai-chat-input" placeholder="Ask about district safety or stats..." class="flex-1 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white outline-none">
            <button id="ai-chat-send" class="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center text-xs font-bold transition-all">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    `;

    document.body.appendChild(chatBtn);
    document.body.appendChild(chatModal);

    // Event Listeners
    chatBtn.addEventListener('click', toggleChatModal);
    document.getElementById('ai-chat-close').addEventListener('click', toggleChatModal);

    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send');

    sendBtn.addEventListener('click', handleChatSubmit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSubmit();
    });
}

function toggleChatModal() {
    const modal = document.getElementById('ai-chatbot-modal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('translate-y-4'), 10);
    } else {
        modal.classList.add('translate-y-4');
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
}

function sendQuickPrompt(promptText) {
    const input = document.getElementById('ai-chat-input');
    if (input) {
        input.value = promptText;
        handleChatSubmit();
    }
}

function handleChatSubmit() {
    const input = document.getElementById('ai-chat-input');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const text = input.value.strip ? input.value.strip() : input.value.trim();
    
    if (!text) return;

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'bg-purple-600/30 border border-purple-500/40 rounded-xl p-3 text-purple-100 self-end text-right ml-6';
    userMsg.innerText = text;
    messagesContainer.appendChild(userMsg);

    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Typing Indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.className = 'bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-slate-400 animate-pulse text-[11px]';
    typingIndicator.innerText = '🤖 AI is analyzing data...';
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Fetch Response from Flask API
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    })
    .then(res => res.json())
    .then(data => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) messagesContainer.removeChild(indicator);

        const aiMsg = document.createElement('div');
        aiMsg.className = 'bg-slate-800/80 border border-purple-500/20 rounded-xl p-3 text-slate-200 space-y-1.5';
        
        // Formatted reply text
        let formattedReply = (data.reply || '')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="bg-purple-950 px-1 py-0.5 rounded text-purple-300 font-mono">$1</code>')
            .replace(/\n/g, '<br>');

        aiMsg.innerHTML = formattedReply;
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    })
    .catch(err => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) messagesContainer.removeChild(indicator);

        const errorMsg = document.createElement('div');
        errorMsg.className = 'bg-rose-950/40 border border-rose-500/30 rounded-xl p-3 text-rose-300';
        errorMsg.innerText = '⚠️ Network error fetching AI response. Please try again.';
        messagesContainer.appendChild(errorMsg);
    });
}
