/**
 * Smart Multi-District Search & Risk Score Calculator Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    initDistrictSearchModal();
});

function initDistrictSearchModal() {
    // Create District Result Modal Container if not present
    if (document.getElementById('district-result-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'district-result-modal';
    modal.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 hidden transition-opacity duration-300';
    
    modal.innerHTML = `
        <div class="glass-card max-w-2xl w-full border-purple-500/30 overflow-hidden relative shadow-2xl animate-fade-in p-6">
            <!-- Close Button -->
            <button onclick="closeDistrictModal()" class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Loading State -->
            <div id="district-modal-loading" class="text-center py-12 space-y-4">
                <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p class="text-slate-300 text-sm font-semibold">Calculating District Crime Risk Score & Zone...</p>
            </div>

            <!-- Content Container -->
            <div id="district-modal-content" class="hidden space-y-6">
                <!-- District Header Banner -->
                <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
                    <div>
                        <span class="text-xs uppercase font-bold text-slate-400 tracking-wider">OFFICIAL CRIME RISK INDEX</span>
                        <h2 id="modal-district-name" class="text-2xl md:text-3xl font-extrabold text-white font-heading mt-1">DISTRICT</h2>
                        <p id="modal-state-name" class="text-xs text-purple-400 font-semibold">STATE</p>
                    </div>
                    <div class="text-right">
                        <span id="modal-zone-badge" class="px-4 py-2 rounded-xl text-xs font-black uppercase border tracking-wider">ZONE</span>
                        <div class="mt-2 text-slate-300 font-bold text-sm">
                            Risk Score: <span id="modal-risk-score" class="text-xl font-extrabold text-purple-400">0</span>/100
                        </div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div class="bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-center">
                        <div class="text-xs text-slate-400 uppercase font-semibold">Total IPC Crimes</div>
                        <div id="modal-total-ipc" class="text-lg font-extrabold text-white font-heading mt-1">0</div>
                    </div>
                    <div class="bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-center">
                        <div class="text-xs text-slate-400 uppercase font-semibold">Primary Threat</div>
                        <div id="modal-top-crime" class="text-xs font-extrabold text-rose-400 mt-2">Theft</div>
                    </div>
                    <div class="bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-center">
                        <div class="text-xs text-slate-400 uppercase font-semibold">Women Safety Index</div>
                        <div id="modal-women-safety" class="text-xs font-bold text-amber-400 mt-2">Assessed</div>
                    </div>
                    <div class="bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-center">
                        <div class="text-xs text-slate-400 uppercase font-semibold">Emergency Status</div>
                        <div class="text-xs font-bold text-emerald-400 mt-2">112 Active</div>
                    </div>
                </div>

                <!-- Crime Breakdown Bar -->
                <div>
                    <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Category Crime Distribution</h4>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                            <span class="text-slate-400">Murder / Homicide:</span>
                            <span id="modal-murder-count" class="font-bold text-white">0</span>
                        </div>
                        <div class="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                            <span class="text-slate-400">Rape / Women Crimes:</span>
                            <span id="modal-rape-count" class="font-bold text-white">0</span>
                        </div>
                        <div class="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                            <span class="text-slate-400">Kidnapping & Abduction:</span>
                            <span id="modal-kidnap-count" class="font-bold text-white">0</span>
                        </div>
                        <div class="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                            <span class="text-slate-400">Theft & Property:</span>
                            <span id="modal-theft-count" class="font-bold text-white">0</span>
                        </div>
                    </div>
                </div>

                <!-- Safety Advisory Banner -->
                <div class="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <h4 class="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5 mb-1">
                        <i class="fa-solid fa-shield-cat"></i> Dynamic Safety Advisory
                    </h4>
                    <p id="modal-safety-advice" class="text-xs text-slate-300 leading-relaxed">
                        Standard safety precautions recommended.
                    </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-between pt-2">
                    <a href="/compare" class="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                        <i class="fa-solid fa-code-compare"></i> Compare with Another District
                    </a>
                    <button id="modal-pdf-download-btn" class="btn-modern px-5 py-2 text-xs font-bold flex items-center gap-2">
                        <i class="fa-solid fa-file-pdf"></i> Download Official PDF Report
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function searchDistrict(query) {
    if (!query || !query.trim()) return;

    const modal = document.getElementById('district-result-modal');
    const loading = document.getElementById('district-modal-loading');
    const content = document.getElementById('district-modal-content');

    if (!modal) return;

    modal.classList.remove('hidden');
    loading.classList.remove('hidden');
    content.classList.add('hidden');

    fetch(`/api/district-search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(resData => {
            loading.classList.add('hidden');
            if (resData.status !== 'success' || !resData.data) {
                alert(resData.message || "District not found in dataset.");
                closeDistrictModal();
                return;
            }

            const d = resData.data;
            content.classList.remove('hidden');

            document.getElementById('modal-district-name').innerText = d.district.toUpperCase();
            document.getElementById('modal-state-name').innerText = d.state.toUpperCase();
            document.getElementById('modal-risk-score').innerText = d.risk_score;
            document.getElementById('modal-total-ipc').innerText = d.total_ipc.toLocaleString();
            document.getElementById('modal-top-crime').innerText = d.top_crime;
            document.getElementById('modal-murder-count').innerText = d.murder;
            document.getElementById('modal-rape-count').innerText = d.rape;
            document.getElementById('modal-kidnap-count').innerText = d.kidnap;
            document.getElementById('modal-theft-count').innerText = d.theft;
            document.getElementById('modal-safety-advice').innerText = d.advice;

            const badge = document.getElementById('modal-zone-badge');
            badge.innerText = d.zone;
            if (d.zone.includes('RED')) {
                badge.className = 'px-4 py-2 rounded-xl text-xs font-black uppercase border tracking-wider bg-red-500/20 text-red-400 border-red-500/40';
            } else if (d.zone.includes('GREEN')) {
                badge.className = 'px-4 py-2 rounded-xl text-xs font-black uppercase border tracking-wider bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
            } else {
                badge.className = 'px-4 py-2 rounded-xl text-xs font-black uppercase border tracking-wider bg-amber-500/20 text-amber-400 border-amber-500/40';
            }

            // PDF Download Action
            const pdfBtn = document.getElementById('modal-pdf-download-btn');
            pdfBtn.onclick = () => {
                if (typeof generateAndDownloadPDF === 'function') {
                    generateAndDownloadPDF(d);
                } else {
                    alert("PDF generator loading... please try again in a moment.");
                }
            };
        })
        .catch(err => {
            loading.classList.add('hidden');
            alert("Error searching district data.");
            closeDistrictModal();
        });
}

function closeDistrictModal() {
    const modal = document.getElementById('district-result-modal');
    if (modal) modal.classList.add('hidden');
}
