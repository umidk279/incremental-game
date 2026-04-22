// ============================================================
// NEXUS ASCENSION — Game Logic (Balance & Buy Max Update)
// ============================================================

// ---------- DATA DEFINITIONS ----------
const LAYER_CURRENCIES = ['points', 'boosters', 'prestige', 'timecubes', 'eternity', 'fragments', 'quantum', 'singularity'];
const LAYER_INDEX = { points: 0, boosters: 1, prestige: 2, timecubes: 3, eternity: 4, fragments: 5, quantum: 6, singularity: 7 };
const LAYER_REQS = { boosters: 1000, prestige: 1e8, timecubes: 10, eternity: 1e15, fragments: 10, quantum: 1e40, singularity: 1e80 };

const DATA = {
    // Points Tab (Updated mult values)
    p1: { name: "Point Amplifier", base: 10, mult: 1.2, tab: "points", type: "addBase", val: 1, max: Infinity },
    p2: { name: "Point Multiplier", base: 100, mult: 5.5, tab: "points", type: "multFlat", val: 2, max: 60 },
    p3: { name: "Accelerator", base: 1000, mult: 8, tab: "points", type: "multFlat", val: 3, max: 50 },
    p4: { name: "Hyper Boost", base: 50000, mult: 28, tab: "points", type: "multFlat", val: 5, max: 20 },
    p5: { name: "Critical Points", base: 500000, mult: 1, tab: "points", type: "multFlat", val: 10, max: 1 },
    p6: { name: "Point Synergy", base: 5e6, mult: 1, tab: "points", type: "multSynergy", val: "points", max: 1 },
    p7: { name: "Mega Amplifier", base: 1e7, mult: 1.8, tab: "points", type: "addBase", val: 10, max: Infinity },
    p8: { name: "Ultra Multiplier", base: 1e9, mult: 500, tab: "points", type: "multFlat", val: 10, max: 15 },

    // Boosters Tab
    b1: { name: "Booster Power", base: 3, mult: 2, tab: "boosters", type: "boosterMult", val: 1.5, max: Infinity },
    b2: { name: "Auto Points", base: 5, mult: 1, tab: "boosters", type: "autoPoints", val: 1, max: 1 },
    b3: { name: "Booster Boost", base: 15, mult: 3, tab: "boosters", type: "boosterMult", val: 2, max: Infinity },
    b4: { name: "Point Nexus", base: 30, mult: 1, tab: "boosters", type: "multSynergy", val: "boosters", max: 1 },
    b5: { name: "Hyper Boosters", base: 100, mult: 4, tab: "boosters", type: "boosterMult", val: 3, max: Infinity },

    // Prestige Tab (Updated exponent val)
    pr1: { name: "Prestige Power", base: 3, mult: 2, tab: "prestige", type: "addExp", val: 0.007, max: 15 },
    pr2: { name: "Prestige Multiplier", base: 10, mult: 3, tab: "prestige", type: "multFlat", val: 2, max: Infinity },
    pr3: { name: "Auto Boosters", base: 8, mult: 1, tab: "prestige", type: "autoBoosters", val: 1, max: 1 },
    pr4: { name: "Prestige Aura", base: 25, mult: 2.5, tab: "prestige", type: "multFlat", val: 1.5, max: Infinity },
    pr5: { name: "Prestige Mastery", base: 20, mult: 1, tab: "prestige", type: "keepUpgrades", val: "points", max: 1 },

    // Time Cubes Tab (Updated exponent val)
    t1: { name: "Time Warp", base: 2, mult: 2, tab: "timecubes", type: "multFlat", val: 2, max: Infinity },
    t2: { name: "Temporal Accel", base: 5, mult: 2.5, tab: "timecubes", type: "addExp", val: 0.007, max: 10 },
    t3: { name: "Auto Prestige", base: 10, mult: 1, tab: "timecubes", type: "autoPrestige", val: 1, max: 1 },
    t4: { name: "Time Dilation", base: 20, mult: 2, tab: "timecubes", type: "multFlat", val: 1.5, max: Infinity },

    // Eternity Tab
    e1: { name: "Eternal Power", base: 3, mult: 3, tab: "eternity", type: "eternityMult", val: 3, max: Infinity },
    e2: { name: "Time Mastery", base: 5, mult: 1, tab: "eternity", type: "keepUpgrades", val: "prestige", max: 1 },
    e3: { name: "Eternal Momentum", base: 10, mult: 2, tab: "eternity", type: "eternityMult", val: 1.5, max: Infinity },
    e4: { name: "Auto Time Cubes", base: 15, mult: 1, tab: "eternity", type: "autoTimeCubes", val: 1, max: 1 },
    e5: { name: "Eternal Spark", base: 25, mult: 5, tab: "eternity", type: "multFlat", val: 5, max: Infinity },

    // Fragments Tab
    f1: { name: "Fragment Force", base: 3, mult: 2.5, tab: "fragments", type: "fragmentMult", val: 2, max: Infinity },
    f2: { name: "Eternal Resonance", base: 5, mult: 1, tab: "fragments", type: "keepUpgrades", val: "eternity", max: 1 },
    f3: { name: "Fragment Synthesis", base: 15, mult: 2, tab: "fragments", type: "fragmentMult", val: 1.5, max: Infinity },
    f4: { name: "Auto Eternity", base: 10, mult: 1, tab: "fragments", type: "autoEternity", val: 1, max: 1 },

    // Quantum Tab (Updated exponent val)
    q1: { name: "Quantum Power", base: 2, mult: 3, tab: "quantum", type: "addQuantumExp", val: 0.007, max: Infinity },
    q2: { name: "Quantum Fluctuation", base: 5, mult: 5, tab: "quantum", type: "multFlat", val: 5, max: Infinity },
    q3: { name: "Auto Fragments", base: 8, mult: 1, tab: "quantum", type: "autoFragments", val: 1, max: 1 },
    q4: { name: "Quantum Supremacy", base: 15, mult: 2.5, tab: "quantum", type: "multFlat", val: 2, max: Infinity },
    q5: { name: "Quantum Tunnel", base: 20, mult: 1, tab: "quantum", type: "keepUpgrades", val: "all", max: 1 },
    q6: { name: "Quantum Field", base: 30, mult: 3, tab: "quantum", type: "addQuantumExp", val: 0.007, max: 10 },

    // Singularity Tab (Updated exponent val)
    s1: { name: "Singularity Power", base: 2, mult: 2, tab: "singularity", type: "addSingularityExp", val: 0.007, max: 10 },
    s2: { name: "Cosmic Multiplier", base: 5, mult: 10, tab: "singularity", type: "multFlat", val: 10, max: Infinity },
    s3: { name: "Cosmic Convergence", base: 10, mult: 1, tab: "singularity", type: "singularityMult", val: 2, max: 1 },
    s4: { name: "Singularity Aura", base: 20, mult: 4, tab: "singularity", type: "multFlat", val: 5, max: Infinity },
    s5: { name: "Auto Quantum", base: 15, mult: 1, tab: "singularity", type: "autoQuantum", val: 1, max: 1 },
    s6: { name: "Final Form", base: 30, mult: 1, tab: "singularity", type: "multFlat", val: 1e50, max: 1 }
};

const MILESTONES = [
    { id: 'm1', req: () => game.totalPoints >= 1000, text: "1,000 Total Points" },
    { id: 'm2', req: () => game.boosters > 0, text: "First Booster" },
    { id: 'm3', req: () => game.prestige > 0, text: "First Prestige" },
    { id: 'm4', req: () => game.timecubes > 0, text: "First Time Cube" },
    { id: 'm5', req: () => game.eternity > 0, text: "First Eternity" },
    { id: 'm6', req: () => game.fragments > 0, text: "First Fragment" },
    { id: 'm7', req: () => game.quantum > 0, text: "First Quantum" },
    { id: 'm8', req: () => game.singularity > 0, text: "First Singularity" },
    { id: 'm9', req: () => game.totalPoints >= 1e50, text: "1e50 Total Points" },
    { id: 'm10', req: () => game.totalPoints >= 1e100, text: "1e100 Total Points" },
    { id: 'm11', req: () => game.totalPoints >= 1e200, text: "1e200 Total Points (Endgame)" }
];

// ---------- GAME STATE ----------
let game = {
    points: 0,
    boosters: 0,
    prestige: 0,
    timecubes: 0,
    eternity: 0,
    fragments: 0,
    quantum: 0,
    singularity: 0,
    totalPoints: 0,
    upgrades: {},
    timePlayed: 0,
    lastTick: Date.now(),
    achievedMilestones: [],
    settings: { offline: true, format: 'mixed', autosave: 30, buyMax: false } // Added buyMax
};

// ---------- CORE MATH ----------
function getUpgradeCost(id) {
    let d = DATA[id];
    let lvl = game.upgrades[id] || 0;
    return Math.floor(d.base * Math.pow(d.mult, lvl));
}

// Calculates how many of an upgrade you can buy with your current currency
function getMaxBuyable(id) {
    let d = DATA[id];
    let currency = d.tab;
    let currentCurrency = game[currency];
    let lvl = game.upgrades[id] || 0;
    let baseCost = d.base;
    let mult = d.mult;

    if (d.max !== Infinity) return (lvl < d.max) ? 1 : 0;

    let costOfOne = getUpgradeCost(id);
    if (currentCurrency < costOfOne) return 0;

    if (mult === 1) {
        return Math.floor(currentCurrency / costOfOne);
    }

    let n = Math.floor(
        Math.log( (currentCurrency * (mult - 1) / (baseCost * Math.pow(mult, lvl))) + 1 ) / Math.log(mult)
    );
    
    // Safety check for floating point inaccuracies
    let tempCost = getBulkCost(id, n);
    if (tempCost > currentCurrency) n--;
    
    return Math.max(0, n);
}

// Calculates the total cost of buying 'amount' levels at once
function getBulkCost(id, amount) {
    let d = DATA[id];
    let lvl = game.upgrades[id] || 0;
    let baseCost = d.base;
    let mult = d.mult;

    if (mult === 1) return baseCost * amount;

    // Geometric series sum formula
    return Math.floor(baseCost * Math.pow(mult, lvl) * (Math.pow(mult, amount) - 1) / (mult - 1));
}

function getEffectTotal(type) {
    let isMult = type !== 'addBase' && type !== 'addExp' && type !== 'addQuantumExp' && type !== 'addSingularityExp';
    let total = isMult ? 1 : 0;

    for (let id in DATA) {
        if (DATA[id].type === type) {
            let lvl = game.upgrades[id] || 0;
            if (lvl > 0) {
                if (isMult) {
                    total *= Math.pow(DATA[id].val, lvl);
                } else {
                    total += DATA[id].val * lvl;
                }
            }
        }
    }
    return total;
}

function getPointsPerSecond() {
    let base = 1 + getEffectTotal('addBase');
    let flatMult = getEffectTotal('multFlat');

    if (game.upgrades['p6'] > 0) flatMult *= Math.max(1, Math.log10(game.points + 1));
    if (game.upgrades['b4'] > 0) flatMult *= Math.max(1, Math.log10(game.boosters + 1));

    // Changed to 3rd root (cube root)
    let boosterMult = Math.cbrt(game.boosters + 1) * getEffectTotal('boosterMult');
    let eternityMult = (game.eternity + 1) * getEffectTotal('eternityMult');
    let fragmentMult = (game.fragments + 1) * getEffectTotal('fragmentMult');

    flatMult *= boosterMult * eternityMult * fragmentMult;

    if (game.upgrades['s3'] > 0) flatMult *= Math.pow(2, game.singularity);

    let prestigeExp = 1 + Math.log10(game.prestige + 1) * 0.001 + getEffectTotal('addExp');
    let quantumExp = 1 + Math.log10(game.quantum + 1) * 0.02 + getEffectTotal('addQuantumExp');
    let singularityExp = 1 + Math.log10(game.singularity + 1) * 0.02 + getEffectTotal('addSingularityExp');

    let totalExp = prestigeExp * quantumExp * singularityExp;
    let result = Math.pow(base * flatMult, totalExp);
    return Math.min(result, 1e300);
}

function getResetGain(layer) {
    let gain = 0;
    let current = game[layer];
    
    if (layer === 'boosters') {
        if (game.points < LAYER_REQS.boosters) return 0;
        gain = Math.floor(Math.sqrt(game.points / 1000));
    } else if (layer === 'prestige') {
        if (game.points < LAYER_REQS.prestige) return 0;
        gain = Math.floor(Math.pow(game.points / 1e8, 0.5));
    } else if (layer === 'timecubes') {
        if (game.prestige < LAYER_REQS.timecubes) return 0;
        gain = Math.floor(Math.pow(game.prestige / 10, 0.6));
    } else if (layer === 'eternity') {
        if (game.points < LAYER_REQS.eternity) return 0;
        gain = Math.floor(Math.pow(game.points / 1e15, 0.35));
    } else if (layer === 'fragments') {
        if (game.eternity < LAYER_REQS.fragments) return 0;
        gain = Math.floor(Math.pow(game.eternity / 10, 0.7));
    } else if (layer === 'quantum') {
        if (game.points < LAYER_REQS.quantum) return 0;
        gain = Math.floor(Math.pow(game.points / 1e40, 0.25));
    } else if (layer === 'singularity') {
        if (game.points < LAYER_REQS.singularity) return 0;
        gain = Math.floor(Math.pow(game.points / 1e80, 0.15));
    }
    
    return Math.max(0, gain - current);
}

// ---------- RESET LOGIC ----------
function doReset(layerName) {
    let gain = getResetGain(layerName);
    if (gain <= 0) return;

    game[layerName] += gain;
    let targetIdx = LAYER_INDEX[layerName];

    for (let i = 0; i < targetIdx; i++) {
        game[LAYER_CURRENCIES[i]] = 0;
    }

    for (let id in DATA) {
        if ((game.upgrades[id] || 0) === 0) continue;
        let d = DATA[id];
        let upgIdx = LAYER_INDEX[d.tab];
        
        if (upgIdx < targetIdx) {
            if (!shouldKeepUpgrade(id, targetIdx)) {
                game.upgrades[id] = 0;
            }
        }
    }

    showToast(`Reset for +${formatNum(gain)} ${layerName.charAt(0).toUpperCase() + layerName.slice(1)}`, TOAST_MAP[layerName]);
    updateUI();
}

function shouldKeepUpgrade(upgId, resetLayerIdx) {
    if (resetLayerIdx >= LAYER_INDEX['prestige'] && game.upgrades['pr5'] > 0 && DATA[upgId].tab === 'points') return true;
    if (resetLayerIdx >= LAYER_INDEX['eternity'] && game.upgrades['e2'] > 0 && DATA[upgId].tab === 'prestige') return true;
    if (resetLayerIdx >= LAYER_INDEX['fragments'] && game.upgrades['f2'] > 0 && DATA[upgId].tab === 'eternity') return true;
    if (resetLayerIdx >= LAYER_INDEX['quantum'] && game.upgrades['q5'] > 0 && LAYER_INDEX[DATA[upgId].tab] < LAYER_INDEX['quantum']) return true;
    return false;
}

// ---------- PURCHASE LOGIC ----------
function buyUpgrade(id) {
    let d = DATA[id];
    let lvl = game.upgrades[id] || 0;
    let currency = d.tab;

    if (lvl >= d.max) return;

    // Buy Max Logic (Affected by Toggle)
    if (game.settings.buyMax && d.max === Infinity) {
        let amountToBuy = getMaxBuyable(id);
        if (amountToBuy <= 0) return;
        
        let cost = getBulkCost(id, amountToBuy);
        if (game[currency] < cost) return;
        
        game[currency] -= cost;
        game.upgrades[id] = lvl + amountToBuy;
    } else {
        // Buy 1 Logic
        let cost = getUpgradeCost(id);
        if (game[currency] < cost) return;

        game[currency] -= cost;
        game.upgrades[id] = lvl + 1;
    }

    let el = document.querySelector(`.upgrade-card[data-upgrade="${id}"]`);
    if (el) {
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 300);
    }

    updateUI();
}

// ---------- AUTO BUYERS ----------
let autoTimer = 0;
function handleAutobuyers(dt) {
    autoTimer += dt;
    if (autoTimer < 2) return; 
    autoTimer = 0;

    // Auto-buyers now respect the Buy Max toggle automatically because buyUpgrade() checks it!
    if (game.upgrades['b2'] > 0 && game.points >= getUpgradeCost('p1')) buyUpgrade('p1');
    if (game.upgrades['pr3'] > 0 && getResetGain('boosters') > 0) doReset('boosters');
    if (game.upgrades['t3'] > 0 && getResetGain('prestige') > 0) doReset('prestige');
    if (game.upgrades['e4'] > 0 && getResetGain('timecubes') > 0) doReset('timecubes');
    if (game.upgrades['f4'] > 0 && getResetGain('eternity') > 0) doReset('eternity');
    if (game.upgrades['q3'] > 0 && getResetGain('fragments') > 0) doReset('fragments');
    if (game.upgrades['s5'] > 0 && getResetGain('quantum') > 0) doReset('quantum');
}

// ---------- FORMATTING ----------
function formatNum(num) {
    if (isNaN(num) || num < 0) return "0";
    if (!isFinite(num)) return "Infinity"; 
    
    if (num < 10) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1e6) return Math.floor(num).toLocaleString();
    
    let exp = Math.floor(Math.log10(num));
    let mantissa = num / Math.pow(10, exp);
    
    if (game.settings.format === 'scientific' || (game.settings.format === 'mixed' && exp >= 6)) {
        return mantissa.toFixed(2) + "e" + exp;
    } else {
        return Math.floor(num).toLocaleString();
    }
}

function formatTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);
    return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

// ---------- UI UPDATES ----------
function updateUI() {
    document.getElementById('points-amount').textContent = formatNum(game.points);
    document.getElementById('side-points').textContent = formatNum(game.points);
    document.getElementById('panel-points-amount').textContent = formatNum(game.points);
    
    LAYER_CURRENCIES.forEach(c => {
        let el = document.getElementById(`side-${c}`);
        if (el) el.textContent = formatNum(game[c]);
        let panelEl = document.getElementById(`panel-${c}-amount`);
        if (panelEl) panelEl.textContent = formatNum(game[c]);
    });

    let pps = getPointsPerSecond();
    document.getElementById('points-per-sec').textContent = formatNum(pps);
    document.getElementById('panel-points-rate').textContent = formatNum(pps);
    document.getElementById('mult-display').textContent = `x${formatNum(pps)}`;
    document.getElementById('mult-total').textContent = `${formatNum(pps)}/s`;

    document.getElementById('mult-base').textContent = formatNum(1 + getEffectTotal('addBase'));
    document.getElementById('mult-flat').textContent = `x${formatNum(getEffectTotal('multFlat'))}`;
    
    let prestigeExp = 1 + Math.log10(game.prestige + 1) * 0.5 + getEffectTotal('addExp');
    let quantumExp = 1 + Math.log10(game.quantum + 1) * 0.25 + getEffectTotal('addQuantumExp');
    let singularityExp = 1 + Math.log10(game.singularity + 1) * 0.1 + getEffectTotal('addSingularityExp');
    let totalExp = prestigeExp * quantumExp * singularityExp;
    
    document.getElementById('mult-exp').textContent = `^${isFinite(totalExp) ? totalExp.toFixed(2) : "∞"}`;

    ['boosters', 'prestige', 'timecubes', 'eternity', 'fragments', 'quantum', 'singularity'].forEach(layer => {
        let gain = getResetGain(layer);
        let btn = document.getElementById(`btn-${layer}-reset`);
        let gainEl = document.getElementById(`${layer}-gain`);
        let reqEl = document.getElementById(`${layer}-req`);
        
        if (gainEl) gainEl.textContent = formatNum(gain);
        if (reqEl) reqEl.textContent = formatNum(LAYER_REQS[layer]);
        
        if (btn) {
            if (gain > 0) {
                btn.classList.add('ready');
                btn.classList.remove('locked');
            } else {
                btn.classList.remove('ready');
                btn.classList.add('locked');
            }
        }
    });

    // Upgrades Loop
    for (let id in DATA) {
        let el = document.querySelector(`.upgrade-card[data-upgrade="${id}"]`);
        if (!el) continue;
        
        let d = DATA[id];
        let lvl = game.upgrades[id] || 0;
        let currency = d.tab;
        let btn = el.querySelector('.buy-btn');

        // Dynamic Button Text based on Buy Max toggle
        if (game.settings.buyMax && d.max === Infinity) {
            let maxBuyable = getMaxBuyable(id);
            let bulkCost = getBulkCost(id, maxBuyable);
            btn.firstChild.textContent = maxBuyable > 0 ? `Buy x${maxBuyable}: ` : "Cost: ";
            el.querySelector('.cost-val').textContent = maxBuyable > 0 ? formatNum(bulkCost) : formatNum(getUpgradeCost(id));
        } else {
            btn.firstChild.textContent = "Cost: ";
            el.querySelector('.cost-val').textContent = formatNum(getUpgradeCost(id));
        }

        if (d.max === 1) {
            el.querySelector('.level-display').textContent = lvl > 0 ? "Purchased" : "One-time";
        } else {
            el.querySelector('.lvl-val').textContent = lvl;
        }

        let effEl = el.querySelector('.eff-val');
        if (effEl) {
            if (d.type.startsWith('auto') || d.type === 'keepUpgrades') {
                effEl.textContent = lvl > 0 ? "Active" : "Inactive";
            } else if (d.type === 'addBase' || d.type === 'addExp' || d.type === 'addQuantumExp' || d.type === 'addSingularityExp') {
                effEl.textContent = (d.val * lvl).toFixed(3); // Updated to 3 decimals to show 0.007 properly
            } else if (d.type === 'multSynergy') {
                if (lvl > 0) {
                    let currVal = game[d.val] || 0;
                    let synMult = Math.max(1, Math.log10(currVal + 1));
                    effEl.textContent = `x${formatNum(synMult)}`;
                } else {
                    effEl.textContent = "Inactive";
                }
            } else {
                effEl.textContent = formatNum(Math.pow(d.val, lvl));
            }
        }

        if (lvl >= d.max) {
            btn.classList.add('purchased');
            btn.classList.remove('cant-afford');
            el.classList.add('purchased');
        } else if (game[currency] < getUpgradeCost(id)) { // Check against cost of 1 for visual affordability
            btn.classList.add('cant-afford');
            btn.classList.remove('purchased');
            el.classList.remove('purchased');
        } else {
            btn.classList.remove('cant-afford', 'purchased');
            el.classList.remove('purchased');
        }
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        let tab = btn.dataset.tab;
        if (tab === 'points') return;
        if (game.totalPoints >= LAYER_REQS[tab] || game[tab] > 0) {
            btn.classList.remove('locked');
        } else {
            btn.classList.add('locked');
        }
    });

    updateMilestones();
}

function updateMilestones() {
    let html = '';
    MILESTONES.forEach(m => {
        let achieved = game.achievedMilestones.includes(m.id);
        if (!achieved && m.req()) {
            game.achievedMilestones.push(m.id);
            achieved = true;
            showToast(`Milestone: ${m.text}`, 'success');
        }
        html += `<div class="milestone-item ${achieved ? 'achieved' : ''}">${m.text}</div>`;
    });
    document.getElementById('milestone-list').innerHTML = html;
}

// ---------- TOAST NOTIFICATIONS ----------
const TOAST_MAP = {
    points: 'info', boosters: 'success', prestige: 'prestige-toast',
    timecubes: 'warning', eternity: 'eternity-toast', fragments: 'info',
    quantum: 'quantum-toast', singularity: 'singularity-toast'
};

function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    let toast = document.createElement('div');
    toast.className = `toast ${type}-toast`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ---------- GAME LOOP ----------
let lastUpdate = Date.now();

function gameLoop() {
    let now = Date.now();
    let dt = (now - lastUpdate) / 1000;
    lastUpdate = now;

    if (dt > 5) dt = 5;

    game.timePlayed += dt;
    document.getElementById('total-time').textContent = formatTime(game.timePlayed);

    let pps = getPointsPerSecond();
    let gain = pps * dt;
    game.points += gain;
    game.totalPoints += gain;

    handleAutobuyers(dt);
    updateUI();

    requestAnimationFrame(gameLoop);
}

// ---------- SAVE / LOAD ----------
function saveGame() {
    game.lastTick = Date.now();
    try {
        localStorage.setItem('nexusAscensionSave', JSON.stringify(game));
        showToast("Game Saved", 'success');
    } catch (e) {
        showToast("Save Failed! Storage full?", 'warning');
    }
}

function loadGame() {
    let save = localStorage.getItem('nexusAscensionSave');
    if (save) {
        try {
            let parsed = JSON.parse(save);
            for (let key in parsed) {
                if (key === 'settings' && typeof parsed[key] === 'object') {
                    for (let subKey in parsed[key]) {
                        game.settings[subKey] = parsed[key][subKey];
                    }
                } else if (key === 'upgrades' && typeof parsed[key] === 'object') {
                    for (let subKey in parsed[key]) {
                        game.upgrades[subKey] = parsed[key][subKey];
                    }
                } else if (key === 'achievedMilestones' && Array.isArray(parsed[key])) {
                    game.achievedMilestones = parsed[key];
                } else {
                    game[key] = parsed[key];
                }
            }

            if (game.settings.offline) {
                let now = Date.now();
                let diff = (now - game.lastTick) / 1000;
                if (diff > 10) {
                    let offlineGain = getPointsPerSecond() * diff;
                    game.points += offlineGain;
                    game.totalPoints += offlineGain;
                    
                    document.getElementById('offline-time').textContent = formatTime(diff);
                    document.getElementById('offline-points').textContent = formatNum(offlineGain);
                    document.getElementById('offline-overlay').classList.remove('hidden');
                }
            }
        } catch (e) {
            console.error("Failed to parse save data", e);
            localStorage.removeItem('nexusAscensionSave'); 
        }
    }
    game.lastTick = Date.now();
    lastUpdate = Date.now();
}

function hardReset() {
    if (confirm("Are you absolutely sure you want to delete ALL save data? This cannot be undone!")) {
        localStorage.removeItem('nexusAscensionSave');
        location.reload();
    }
}

// ---------- BACKGROUND PARTICLES ----------
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for(let i=0; i<80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.2
        });
    }
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 160, 32, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(drawCanvas);
}

window.addEventListener('resize', initCanvas);

// ---------- EVENT LISTENERS ----------
function initEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`panel-${btn.dataset.tab}`).classList.add('active');
        });
    });

    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let id = btn.dataset.upgrade;
            if (id) buyUpgrade(id);
        });
    });

    document.getElementById('btn-boosters-reset').addEventListener('click', () => doReset('boosters'));
    document.getElementById('btn-prestige-reset').addEventListener('click', () => doReset('prestige'));
    document.getElementById('btn-timecubes-reset').addEventListener('click', () => doReset('timecubes'));
    document.getElementById('btn-eternity-reset').addEventListener('click', () => doReset('eternity'));
    document.getElementById('btn-fragments-reset').addEventListener('click', () => doReset('fragments'));
    document.getElementById('btn-quantum-reset').addEventListener('click', () => doReset('quantum'));
    document.getElementById('btn-singularity-reset').addEventListener('click', () => doReset('singularity'));

    document.getElementById('btn-save').addEventListener('click', saveGame);
    
    document.getElementById('btn-settings').addEventListener('click', () => {
        document.getElementById('modal-overlay').classList.remove('hidden');
    });
    
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        document.getElementById('modal-overlay').classList.add('hidden');
    });

    document.getElementById('btn-hard-reset').addEventListener('click', hardReset);

    document.getElementById('btn-close-offline').addEventListener('click', () => {
        document.getElementById('offline-overlay').classList.add('hidden');
    });

    document.getElementById('setting-offline').addEventListener('change', (e) => {
        game.settings.offline = e.target.checked;
    });
    document.getElementById('setting-format').addEventListener('change', (e) => {
        game.settings.format = e.target.value;
    });
    document.getElementById('setting-autosave').addEventListener('change', (e) => {
        game.settings.autosave = parseInt(e.target.value);
        setupAutosave();
    });
    
    // NEW: Header Buy Max Toggle Logic
    document.getElementById('setting-buymax').addEventListener('change', (e) => {
        game.settings.buyMax = e.target.checked;
        // Toggle active visual class on the label
        document.querySelector('.header-toggle-label').classList.toggle('active-label', game.settings.buyMax);
        updateUI(); 
    });
}

let autosaveInterval;
function setupAutosave() {
    clearInterval(autosaveInterval);
    if (game.settings.autosave > 0) {
        autosaveInterval = setInterval(saveGame, game.settings.autosave * 1000);
    }
}

// ---------- INITIALIZATION ----------
function init() {
    loadGame();
    
    document.getElementById('setting-offline').checked = game.settings.offline;
    document.getElementById('setting-format').value = game.settings.format;
    document.getElementById('setting-autosave').value = game.settings.autosave;
    
    // NEW: Sync Buy Max UI
    document.getElementById('setting-buymax').checked = game.settings.buyMax;
    if (document.querySelector('.header-toggle-label')) {
        document.querySelector('.header-toggle-label').classList.toggle('active-label', game.settings.buyMax);
    }
    
    initEvents();
    initCanvas();
    drawCanvas();
    updateUI();
    setupAutosave();
    
    requestAnimationFrame(gameLoop);
}

init();
