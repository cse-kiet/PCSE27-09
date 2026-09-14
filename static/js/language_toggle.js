/**
 * Multi-Language Support System (English / Hindi Toggle)
 * Dynamically switches UI labels, emergency contacts, and risk zone text
 */

const translations = {
    'hi': {
        'home': 'होम (Home)',
        'about': 'हमारे बारे में (About)',
        'feedback': 'प्रतिक्रिया (Feedback)',
        'compare': 'जिले की तुलना (Compare)',
        'police_dash': 'पुलिस डैशबोर्ड (Police Dash)',
        'ml_metrics': 'एमएल मॉडल मेट्रिक्स (ML Lab)',
        'route_safety': 'सुरक्षित मार्ग जांच (Route Safety)',
        'emergency_title': '🚨 राष्ट्रीय आपातकालीन हेल्पलाइन 24x7',
        'national_emergency': 'राष्ट्रीय आपातकाल',
        'women_helpline': 'महिला हेल्पलाइन',
        'cyber_crime': 'साइबर अपराध पोर्टल',
        'child_line': 'चाइल्ड हेल्पलाइन',
        'red_zone': 'लाल क्षेत्र (High Risk)',
        'orange_zone': 'नारंगी क्षेत्र (Moderate)',
        'green_zone': 'हरा क्षेत्र (Safe Zone)',
        'calculate_score': 'जोखिम स्कोर की गणना करें',
        'sos_panic': '🆘 एसओएस आपातकालीन बटन',
        'report_incident': '📢 घटना की रिपोर्ट करें'
    },
    'en': {
        'home': 'Home',
        'about': 'About',
        'feedback': 'Feedback',
        'compare': 'Compare Districts',
        'police_dash': 'Police Dash',
        'ml_metrics': 'ML Model Lab',
        'route_safety': 'Route Safety',
        'emergency_title': '🚨 National Emergency Helplines 24x7',
        'national_emergency': 'National Emergency',
        'women_helpline': 'Women Helpline',
        'cyber_crime': 'Cyber Crime Portal',
        'child_line': 'Childline India',
        'red_zone': 'RED ZONE',
        'orange_zone': 'ORANGE ZONE',
        'green_zone': 'GREEN ZONE',
        'calculate_score': 'Calculate Risk Score',
        'sos_panic': '🆘 SOS Emergency Panic',
        'report_incident': '📢 Report Incident'
    }
};

let currentLang = localStorage.getItem('app_language') || 'en';

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    applyLanguage(currentLang);
});

function initLanguageSwitcher() {
    const navUl = document.querySelector('nav.main ul');
    if (!navUl || document.getElementById('lang-switch-btn')) return;

    const li = document.createElement('li');
    li.innerHTML = `
        <button id="lang-switch-btn" onclick="toggleAppLanguage()" class="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold hover:bg-purple-500/40 transition-all flex items-center gap-1.5">
            <i class="fa-solid fa-language text-sm"></i>
            <span id="lang-label-text">${currentLang === 'hi' ? 'हिंदी' : 'ENG'}</span>
        </button>
    `;
    navUl.appendChild(li);
}

function toggleAppLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('app_language', currentLang);
    const label = document.getElementById('lang-label-text');
    if (label) label.innerText = currentLang === 'hi' ? 'हिंदी' : 'ENG';
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    const dict = translations[lang] || translations['en'];
    
    // Update elements with data-i18n attribute if present
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.innerText = dict[key];
    });
}
