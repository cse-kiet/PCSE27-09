/**
 * Seamless Multi-Language System (English / Hindi Toggle)
 * Uses Google Translate engine behind a sleek glassmorphism button
 */

let currentLang = localStorage.getItem('app_language') || 'en';

document.addEventListener('DOMContentLoaded', () => {
    initGoogleTranslateScript();
    initLanguageSwitcher();
});

function initGoogleTranslateScript() {
    if (document.getElementById('google-translate-script')) return;

    // Create hidden container for Google Translate Element
    const gDiv = document.createElement('div');
    gDiv.id = 'google_translate_element';
    gDiv.style.display = 'none';
    document.body.appendChild(gDiv);

    // Global callback for Google Translate initialization
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false
        }, 'google_translate_element');

        if (currentLang === 'hi') {
            setTimeout(() => applyLanguage('hi'), 500);
        }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
}

function initLanguageSwitcher() {
    const navUl = document.querySelector('nav.main ul');
    if (!navUl || document.getElementById('lang-switch-btn')) return;

    const li = document.createElement('li');
    li.innerHTML = `
        <button id="lang-switch-btn" onclick="toggleAppLanguage()" class="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg">
            <i class="fa-solid fa-language text-sm text-purple-300"></i>
            <span id="lang-label-text">${currentLang === 'hi' ? 'हिंदी (Hindi)' : 'ENG'}</span>
        </button>
    `;
    navUl.appendChild(li);
}

function toggleAppLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('app_language', currentLang);
    
    const label = document.getElementById('lang-label-text');
    if (label) label.innerText = currentLang === 'hi' ? 'हिंदी (Hindi)' : 'ENG';

    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
    } else {
        // Set cookie fallback for Google Translate iframe
        if (lang === 'hi') {
            document.cookie = "googtrans=/en/hi; path=/";
            document.cookie = "googtrans=/en/hi; domain=" + window.location.hostname + "; path=/";
        } else {
            document.cookie = "googtrans=/en/en; path=/";
            document.cookie = "googtrans=/en/en; domain=" + window.location.hostname + "; path=/";
        }
        window.location.reload();
    }
}
