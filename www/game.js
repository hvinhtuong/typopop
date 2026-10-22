// --- Cấu hình Supabase ---
const SUPABASE_URL = 'https://ksiapqqsxgnctbwdzxzj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaWFwcXFzeGduY3Rid2R6eHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDg5NDcsImV4cCI6MjEwODIyNDk0N30.gf4iMpC28lqfluWtK0Cf2RZfysQQblNDJxB5FvrVdDU';

let sb = null;
try {
    if (window.supabase && SUPABASE_URL && SUPABASE_KEY.startsWith('eyJ')) {
        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
} catch (e) {
    console.warn('Lỗi khởi tạo Supabase, game chuyển sang chế độ offline:', e);
}

const WORD_PACKS = {
    all: [],
    it: `developer:lập trình viên|software:phần mềm|hardware:phần cứng|database:cơ sở dữ liệu|network:mạng máy tính|security:bảo mật|cloud:điện toán đám mây|framework:khung làm việc|deployment:triển khai|repository:kho lưu trữ|algorithm:thuật toán|debugging:gỡ lỗi|interface:giao diện|compile:biên dịch|terminal:cửa sổ lệnh|variable:biến|function:hàm|syntax:cú pháp|server:máy chủ|client:máy khách`.split('|').map(s => {
        const [a, b] = s.split(':');
        return { w: a, vi: b };
    }),
    travel: `airport:sân bay|passport:hộ chiếu|luggage:hành lý|hotel:khách sạn|ticket:vé xe máy bay|reservation:đặt chỗ|destination:điểm đến|souvenir:quà lưu niệm|guidebook:sách hướng dẫn|itinerary:lịch trình|adventure:cuộc phiêu lưu|landscape:phong cảnh|island:hòn đảo|beach:bãi biển|mountain:ngọn núi|journey:chuyến đi|sightseeing:vãn cảnh|passport:hộ chiếu|customs:hải quan|vacation:kỳ nghỉ`.split('|').map(s => {
        const [a, b] = s.split(':');
        return { w: a, vi: b };
    }),
    daily: `chef:đầu bếp|soap:xà phòng|laughter:tiếng cười|human:con người|monkey:con khỉ|running:đang chạy|tip:mẹo|mirror:cái gương|temperature:nhiệt độ|better:tốt hơn|cat:con mèo|sun:mặt trời|book:quyển sách|milk:sữa|tree:cái cây|fish:con cá|happy:vui vẻ|water:nước|friend:bạn bè|apple:quả táo|window:cửa sổ|garden:khu vườn|family:gia đình|bridge:cây cầu|season:mùa|library:thư viện|hungry:đói bụng|answer:câu trả lời|breakfast:bữa sáng|weather:thời tiết|holiday:kỳ nghỉ|kitchen:nhà bếp|delicious:ngon tuyệt|beautiful:xinh đẹp|dangerous:nguy hiểm|important:quan trọng|different:khác biệt|information:thông tin|education:giáo dục|dictionary:từ điển|vegetable:rau củ|exercise:bài tập|language:ngôn ngữ|neighbor:hàng xóm|umbrella:cái ô|treasure:kho báu|rainbow:cầu vồng|elephant:con voi|computer:máy tính|customer:khách hàng|chocolate:sô-cô-la|butterfly:con bướm|restaurant:nhà hàng|pronounce:phát âm|comfortable:thoải mái|opportunity:cơ hội`.split('|').map(s => {
        const [a, b] = s.split(':');
        return { w: a, vi: b };
    })
};

const allMap = new Map();
[...WORD_PACKS.it, ...WORD_PACKS.travel, ...WORD_PACKS.daily].forEach(o => allMap.set(o.w, o));
WORD_PACKS.all = [...allMap.values()];

let currentTopic = 'all';
let WORDS = WORD_PACKS.all;

const $ = id => document.getElementById(id), cv = $('c'), ctx = cv.getContext('2d'), kb =$('kb');
const COL = ['#ff6fae', '#ffd23f', '#3ee6b0', '#5cc8ff', '#b79cff', '#ff9a5c'];
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
let W = 0, H = 0, DPR = 1, mode = 0, state = 'menu', last = 0;

// KHAI BÁO BIẾN TRẠNG THÁI GAME (CHỈ ĐỂ DUY NHẤT 1 LẦN TẠI ĐÂY)
let words, parts, bullets, floats, stars, score, lives, combo, level, killed, hits, misses, missed, target, spawnT,
    shake, bestEver = 0, topScores = [], lastRecordTime = 0, playerName = '', rankFrom = 'start', mascot;

try {
    bestEver = +localStorage.getItem('mtv-best') || 0;
    playerName = localStorage.getItem('mtv-name') || '';
    topScores = JSON.parse(localStorage.getItem('mtv-top5') || '[]');
    if (!topScores.length && bestEver > 0) {
        topScores = [{ name: playerName || 'Người chơi', score: bestEver, lvl: 1, mode: 0, date: 'Kỷ lục cũ', t: 0 }];
    }
} catch (e) {}

/* ---------- âm thanh & phát âm ---------- */
let AC, muted = false, enVoice = null;

function loadVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    enVoice = vs.find(v => /en[-_]US/i.test(v.lang) && /Google|Natural|Siri|Samantha/i.test(v.name))
        || vs.find(v => /en[-_]US/i.test(v.lang))
        || vs.find(v => /^en/i.test(v.lang)) || null;
}

if ('speechSynthesis' in window) {
    loadVoice();
    speechSynthesis.onvoiceschanged = loadVoice;
}

function speak(word) {
    if (muted) return;
    const isMessenger = /FBAN|FBAV/i.test(navigator.userAgent);
    if (!isMessenger && 'speechSynthesis' in window) {
        try {
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(word);
            if (enVoice) u.voice = enVoice;
            u.lang = 'en-US';
            u.rate = 1.0;
            speechSynthesis.speak(u);
            return;
        } catch (e) {}
    }
    [523, 659, 784].forEach((f, i) => snd(f, 0.1, 'triangle', 0.08, 0, i * 0.06));
}

function snd(f, d = .08, type = 'sine', v = .07, slide = 0, delay = 0) {
    if (muted) return;
    try {
        AC = AC || new (window.AudioContext || window.webkitAudioContext)();
        const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f, t);
        if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, t + d);
        g.gain.setValueAtTime(v, t);
        g.gain.exponentialRampToValueAtTime(.0001, t + d);
        o.connect(g);
        g.connect(AC.destination);
        o.start(t);
        o.stop(t + d);
    } catch (e) {}
}

const sPop = n => [523, 659, 784, 1047].forEach((f, i) => snd(f * (1 + Math.min(n, 8) * .03), .14, 'triangle', .07, 0, i * .05));
$('mute').onclick = e => {
    muted = !muted;
    if (muted && 'speechSynthesis' in window) speechSynthesis.cancel();
    e.target.textContent = muted ? '🔇' : '🔊';
    refocus();
};

/* ---------- kích thước ---------- */
function resize() {
    const vv = window.visualViewport;
    W = window.innerWidth;
    H = vv ? vv.height : window.innerHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
  $('app').style.height = H + 'px';
    cv.width = W * DPR;
    cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    window.scrollTo(0, 0);
}

addEventListener('resize', resize);
if (window.visualViewport) {
    visualViewport.addEventListener('resize', resize);
    visualViewport.addEventListener('scroll', () => window.scrollTo(0, 0));
}

/* ---------- khởi tạo ---------- */
function fs() {
    return Math.max(20, Math.min(30, W / 17));
}

function initStars() {
    stars = Array.from({ length: 110 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.8 + .4,
        t: Math.random() * 6,
        s: Math.random() * .5 + .2
    }));
}

function reset() {
    words = [];
    parts = [];
    bullets = [];
    floats = [];
    score = 0;
    lives = 5;
    combo = 0;
    level = 1;
    killed = 0;
    hits = 0;
    misses = 0;
    missed = new Map();
    target = null;
    spawnT = .4;
    shake = 0;
    mascot = { x: 0, sq: 0, look: 0, mouth: 0 };
    hud();
}

function hud() {
    $('score').textContent = '⭐ ' + Math.round(score);$('lvl').textContent = 'Cấp ' + level;
  $('hearts').textContent = '💗'.repeat(Math.max(lives, 0)) + '🤍'.repeat(5 - Math.max(lives, 0));
    const c = $('combo');
    c.style.visibility = combo >= 2 ? 'visible' : 'hidden';
    c.textContent = 'x' + combo + ' 🔥';
    c.classList.add('pop');
    setTimeout(() => c.classList.remove('pop'), 150);
}

function refocus() {
    if (state === 'play') {
        try {
            kb.focus({ preventScroll: true });
        } catch (e) {
            kb.focus();
        }
    }
}

/* ---------- từ ---------- */
function spawn() {
    const maxLen = [5, 7, 9][mode] + Math.floor(level * 1.2),
        pool = WORDS.filter(o => o.w.length <= maxLen && !words.some(x => x.w === o.w)),
        o = pool[Math.random() * pool.length | 0] || WORDS[0];
    ctx.font = `700 ${fs()}px Fredoka,sans-serif`;
    const w = ctx.measureText(o.w).width + 28, m = w / 2 + 10;
    let x = m + Math.random() * (W - 2 * m);
    for (let i = 0; i < 8; i++) {
        const c = m + Math.random() * (W - 2 * m);
        if (!words.some(q => q.y < 90 && Math.abs(q.x - c) < (q.w + w) / 2 + 10)) {
            x = c;
            break;
        }
    }
    words.push({
        w: o.w,
        vi: o.vi,
        x,
        y: -30,
        pw: w,
        vy: (26 + level * 5 + Math.random() * 14 + mode * 10) * Math.max(.8, H / 700),
        typed: 0,
        ph: Math.random() * 6,
        col: COL[Math.random() * COL.length | 0],
        locked: false,
        sc: 0
    });
}

function pickByChar(ch) {
    let b = null;
    for (const q of words) if (!q.locked && q.w[0] === ch && (!b || q.y > b.y)) b = q;
    return b;
}

/* ---------- gõ phím ---------- */
const TELEX_MAP = {
    'ă': 'aw', 'â': 'aa', 'đ': 'dd', 'ê': 'ee', 'ô': 'oo', 'ơ': 'ow', 'ư': 'w',
    'á': 'as', 'à': 'af', 'ả': 'ar', 'ã': 'ax', 'ạ': 'aj',
    'ắ': 'aws', 'ằ': 'awf', 'ẳ': 'awr', 'ẵ': 'awx', 'ặ': 'awj',
    'ấ': 'aas', 'ầ': 'aaf', 'ẩ': 'aar', 'ẫ': 'aax', 'ậ': 'aaj',
    'é': 'es', 'è': 'ef', 'ẻ': 'er', 'ẽ': 'ex', 'ẹ': 'ej',
    'ế': 'ees', 'ề': 'eef', 'ể': 'eer', 'ễ': 'eex', 'ệ': 'eej',
    'í': 'is', 'ì': 'if', 'ỉ': 'ir', 'ĩ': 'ix', 'ị': 'ij',
    'ó': 'os', 'ò': 'of', 'ỏ': 'or', 'õ': 'ox', 'ọ': 'oj',
    'ố': 'oos', 'ồ': 'oof', 'ổ': 'oor', 'ỗ': 'oox', 'ộ': 'ooj',
    'ớ': 'ows', 'ờ': 'owf', 'ở': 'owr', 'ỡ': 'owx', 'ợ': 'owj',
    'ú': 'us', 'ù': 'uf', 'ủ': 'ur', 'ũ': 'ux', 'ụ': 'uj',
    'ứ': 'uws', 'ừ': 'uwf', 'ử': 'uwr', 'ữ': 'uwx', 'ự': 'uwj',
    'ý': 'ys', 'ỳ': 'yf', 'ỷ': 'yr', 'ỹ': 'yx', 'ỵ': 'yj'
};

function normalizeChar(ch) {
    ch = ch.toLowerCase();
    if (/^[a-z'-]$/.test(ch)) return ch;
    const mapped = TELEX_MAP[ch];
    if (!mapped) return '';
    if (ch === 'ư') {
        const needed = target ? target.w[target.typed] : null;
        if (needed === 'u') return 'u';
        return 'w';
    }
    return mapped[mapped.length - 1];
}

function typeChar(rawCh) {
    if (state !== 'play') return;
    const ch = normalizeChar(rawCh);
    if (!ch) return;
    if (!target || target.typed === 0) {
        const t = pickByChar(ch);
        if (t) {
            target = t;
            mascot.look = 1;
        }
    }
    if (!target || target.w[target.typed] !== ch) {
        misses++;
        combo = 0;
        shake = reduce ? 0 : .25;
        snd(150, .18, 'sawtooth', .05, .6);
        if (target) target.sc = -1;
        hud();
        return;
    }
    const t = target;
    t.typed++;
    hits++;
    t.sc = 1;
    mascot.sq = 1;
    mascot.mouth = 1;
    bullets.push({ x: mascot.x, y: H - 70, t, kill: t.typed === t.w.length, lx: t.x, ly: t.y, tr: [] });
    snd(520 + t.typed * 45, .09, 'triangle', .06);
    if (t.typed === t.w.length) {
        t.locked = true;
        target = null;
    }
}

let handledByKeydown = false;

kb.addEventListener('input', e => {
    const v = kb.value;
    kb.value = '';
    if (handledByKeydown) {
        handledByKeydown = false;
        return;
    }
    const str = v || e.data || '';
    for (const ch of str) typeChar(ch);
});

addEventListener('keydown', e => {
    if (state !== 'play') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Backspace' || e.key === 'Escape') {
        if (target && !target.locked) {
            target.typed = 0;
            target = null;
        }
        kb.value = '';
        e.preventDefault();
        return;
    }
    if (e.isComposing || e.key === 'Process' || e.keyCode === 229) return;

    let ch = '';
    if (/^Key[A-Z]$/.test(e.code || '')) {
        ch = e.code.slice(3).toLowerCase();
    } else if (e.key && e.key.length === 1) {
        ch = normalizeChar(e.key);
    }

    if (ch && /^[a-z'-]$/.test(ch)) {
        handledByKeydown = true;
        typeChar(ch);
        kb.value = '';
        e.preventDefault();
        setTimeout(() => {
            handledByKeydown = false;
        }, 0);
    }
});

cv.addEventListener('pointerdown', e => {
    if (state !== 'play') return;
    refocus();
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    let b = null, bd = 1e9;
    for (const q of words) {
        if (q.locked) continue;
        const dx = Math.abs(x - q.x), dy = Math.abs(y - q.y);
        if (dx < q.pw / 2 + 14 && dy < 34 && dx + dy < bd) {
            b = q;
            bd = dx + dy;
        }
    }
    if (b) {
        if (target && target !== b) target.typed = 0;
        target = b;
        b.typed = 0;
        b.sc = 1;
        snd(700, .06, 'sine', .05);
    }
});

/* ---------- hiệu ứng ---------- */
function burst(x, y, col, n = 24, star = true) {
    for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, s = 90 + Math.random() * 260;
        parts.push({
            x,
            y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - 90,
            l: 0,
            m: .6 + Math.random() * .6,
            c: Math.random() < .6 ? col : COL[Math.random() * COL.length | 0],
            r: 3 + Math.random() * 5,
            star: star && Math.random() < .5,
            rot: Math.random() * 6
        });
    }
}

function say(t, x, y, c, size = 26) {
    floats.push({ t, x, y, c, l: 0, size });
}

function kill(q) {
    killed++;
    combo++;
    const gain = Math.round(q.w.length * 10 * (1 + Math.min(combo, 10) * .15));
    score += gain;
    burst(q.x, q.y, q.col, 30);
    say('+' + gain + ' · ' + q.vi, q.x, q.y - 10, '#ffd23f', 22);
    if (combo >= 3) say(['Tuyệt!', 'Giỏi quá!', 'Siêu sao!', 'Bất bại!'][Math.min(combo - 3, 3)] + ' x' + combo, q.x, q.y - 44, '#ff6fae', 22);
    sPop(combo);
    speak(q.w);
    words.splice(words.indexOf(q), 1);
    if (killed % 10 === 0) {
        level++;
        say('Cấp ' + level + '!', W / 2, H * .4, '#3ee6b0', Math.min(64, W / 7));
        burst(W / 2, H * .4, '#3ee6b0', 60);
        [392, 523, 659, 784].forEach((f, i) => snd(f, .2, 'square', .05, 0, i * .09));
    }
    hud();
}

function lose(q) {
    lives--;
    combo = 0;
    shake = reduce ? 0 : .5;
    burst(q.x, H - 60, '#ff5d6c', 26, false);
    say('Ối!', q.x, H - 110, '#ff5d6c');
    snd(220, .35, 'square', .06, .4);
    if (!missed.has(q.w)) missed.set(q.w, q.vi);
    if (target === q) target = null;
    words.splice(words.indexOf(q), 1);
    hud();
    if (lives <= 0) end();
}

/* ---------- vòng lặp ---------- */
function update(dt) {
    spawnT -= dt;
    if (spawnT <= 0 && words.length < 4 + level) {
        spawn();
        spawnT = Math.max(.9, 2.6 - level * .18 - mode * .3) + Math.random() * .6;
    }
    for (const q of words.slice()) {
        q.ph += dt * 2;
        const nearBottom = q === target && q.y > H - 150;
        const speedFactor = q.locked ? 0.1 : (nearBottom ? 0.65 : 1);
        q.y += q.vy * speedFactor * dt;
        if (q.locked && q.y > H - 95) q.y = H - 95;
        q.sc *= .88;
        if (!q.locked && q.y > H - 92) lose(q);
    }
    for (const b of bullets) {
        const t = b.t.dead ? null : b.t;
        if (t) {
            b.lx = t.x;
            b.ly = t.y;
        }
        const dx = b.lx - b.x, dy = b.ly - b.y, d = Math.hypot(dx, dy), s = 1100 * dt;
        b.tr.push([b.x, b.y]);
        if (b.tr.length > 6) b.tr.shift();
        if (d <= s + 8) {
            b.done = true;
            burst(b.lx, b.ly, b.t.col, b.kill ? 0 : 6);
            if (b.kill && !b.t.dead) {
                b.t.dead = true;
                kill(b.t);
            }
        } else {
            b.x += dx / d * s;
            b.y += dy / d * s;
        }
    }
    bullets = bullets.filter(b => !b.done);
    for (const p of parts) {
        p.l += dt;
        p.vy += 620 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += dt * 8;
    }
    parts = parts.filter(p => p.l < p.m);
    for (const f of floats) {
        f.l += dt;
        f.y -= 50 * dt;
    }
    floats = floats.filter(f => f.l < 1);
    mascot.x += ((target ? target.x : W / 2) - mascot.x) * Math.min(1, dt * 8);
    mascot.sq *= .85;
    mascot.mouth *= .9;
    shake = Math.max(0, shake - dt);
    for (const s of stars) {
        s.t += dt * s.s * 3;
        s.y += dt * s.s * .012 * (1 + level * .1);
        if (s.y > 1) s.y = 0;
    }
}

function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function starPath(x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
        const a = rot + i * Math.PI / 5, rad = i % 2 ? r * .45 : r;
        ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    ctx.closePath();
}

function drawBg(t) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#2a1a6e');
    g.addColorStop(.6, '#1a1245');
    g.addColorStop(1, '#0f0a30');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    for (const [cx, cy, c, r] of [[.2, .25, 'rgba(255,111,174,.16)', .45], [.85, .6, 'rgba(92,200,255,.14)', .5], [.5, .9, 'rgba(183,156,255,.14)', .5]]) {
        const x = cx * W + Math.sin(t / 4000 + cx * 9) * 30, y = cy * H + Math.cos(t / 5000 + cy * 9) * 30,
            rg = ctx.createRadialGradient(x, y, 0, x, y, r * Math.max(W, H) * .6);
        rg.addColorStop(0, c);
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, W, H);
    }
    for (const s of stars) {
        ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(s.t));
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, 6.283);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawWord(q, t) {
    const f = fs(), y = q.y + Math.sin(q.ph) * 3, x = q.x + Math.sin(q.ph * .7) * 4, isT = q === target,
        sc = 1 + (q.sc > 0 ? q.sc * .18 : 0), h = f + 18;
    q.dx = x;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    if (q.sc < -.1) ctx.translate(Math.sin(t / 20) * 4, 0);
    if (isT || q.locked) {
        ctx.shadowColor = q.locked ? '#3ee6b0' : '#ffd23f';
        ctx.shadowBlur = 18 + Math.sin(t / 120) * 6;
    }
    rr(-q.pw / 2, -h / 2, q.pw, h, h / 2);
    ctx.fillStyle = isT ? 'rgba(255,210,63,.22)' : 'rgba(255,255,255,.12)';
    ctx.fill();
    ctx.lineWidth = isT ? 3 : 2;
    ctx.strokeStyle = isT ? '#ffd23f' : q.col;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.font = `700 ${f}px Fredoka,sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const a = q.w.slice(0, q.typed), tw = ctx.measureText(q.w).width, x0 = -tw / 2;
    ctx.fillStyle = '#3ee6b0';
    ctx.fillText(a, x0, 1);
    ctx.fillStyle = '#fff';
    ctx.fillText(q.w.slice(q.typed), x0 + ctx.measureText(a).width, 1);
    ctx.textAlign = 'center';
    ctx.font = `500 ${f * .56}px Fredoka,sans-serif`;
    ctx.fillStyle = isT ? '#ffe98a' : 'rgba(255,214,235,.85)';
    ctx.fillText(q.vi, 0, h / 2 + f * .4);
    ctx.restore();
}

function drawMascot(t) {
    const m = mascot, x = m.x, y = H - 52 + Math.sin(t / 300) * 3, s = 1 + m.sq * .18, k = 1 - m.sq * .14;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * k, s / k * 1.0);
    ctx.fillStyle = '#ffb347';
    for (const d of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(d * 14, -22);
        ctx.lineTo(d * 30, -46);
        ctx.lineTo(d * 34, -14);
        ctx.closePath();
        ctx.fill();
    }
    const g = ctx.createRadialGradient(-8, -14, 4, 0, 0, 40);
    g.addColorStop(0, '#ffe98a');
    g.addColorStop(1, '#ffb347');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, 38, 32, 0, 0, 6.283);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,111,174,.6)';
    for (const d of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(d * 23, 8, 7, 4.5, 0, 0, 6.283);
        ctx.fill();
    }
    let lx = 0, ly = 0;
    if (target) {
        const dx = target.x - x, dy = target.y - y, d = Math.hypot(dx, dy) || 1;
        lx = dx / d * 4;
        ly = dy / d * 3;
    }
    const blink = Math.sin(t / 900) > .97 ? .15 : 1;
    ctx.fillStyle = '#3a1250';
    for (const d of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(d * 13 + lx, -4 + ly, 5, 6 * blink, 0, 0, 6.283);
        ctx.fill();
    }
    ctx.strokeStyle = '#3a1250';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (m.mouth > .2) {
        ctx.fillStyle = '#e0457f';
        ctx.ellipse(0, 12, 6, 4 + m.mouth * 5, 0, 0, 6.283);
        ctx.fill();
    } else {
        ctx.arc(0, 8, 6, .15 * Math.PI, .85 * Math.PI);
        ctx.stroke();
    }
    ctx.restore();
}

function draw(t) {
    ctx.save();
    if (shake > 0) ctx.translate((Math.random() - .5) * shake * 22, (Math.random() - .5) * shake * 22);
    drawBg(t);
    if (target && !target.locked) {
        ctx.strokeStyle = 'rgba(255,210,63,.25)';
        ctx.setLineDash([4, 8]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mascot.x, H - 80);
        ctx.lineTo(target.x, target.y + 18);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    for (const q of words) drawWord(q, t);
    for (const b of bullets) {
        for (let i = 0; i < b.tr.length; i++) {
            ctx.globalAlpha = i / b.tr.length * .5;
            ctx.fillStyle = '#ffd23f';
            ctx.beginPath();
            ctx.arc(b.tr[i][0], b.tr[i][1], 3 + i * .6, 0, 6.283);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#ffd23f';
        ctx.shadowBlur = 14;
        starPath(b.x, b.y, 10, t / 80);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    for (const p of parts) {
        ctx.globalAlpha = 1 - p.l / p.m;
        ctx.fillStyle = p.c;
        if (p.star) {
            starPath(p.x, p.y, p.r * 1.6, p.rot);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 6.283);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1;
    drawMascot(t);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const f of floats) {
        ctx.globalAlpha = 1 - f.l;
        ctx.font = `700 ${f.size * (1 + Math.max(0, .3 - f.l))}px Fredoka,sans-serif`;
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(26,18,69,.8)';
        ctx.strokeText(f.t, f.x, f.y);
        ctx.fillStyle = f.c;
        ctx.fillText(f.t, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
}

function loop(t) {
    const dt = Math.min(.05, (t - last) / 1000 || 0);
    last = t;
    if (state === 'play') update(dt);
    else for (const s of stars) {
        s.t += dt * s.s * 3;
    }
    draw(t);
    requestAnimationFrame(loop);
}

/* ---------- luồng game ---------- */
async function saveScore(sc) {
    if (sc <= 0) return;
    lastRecordTime = Date.now();
    const player = playerName || 'Người chơi';
    const topicName = typeof currentTopic !== 'undefined' ? currentTopic : 'all';

    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    topScores.push({ name: player, score: sc, lvl: level, mode, topic: topicName, date: dateStr, t: lastRecordTime });
    topScores.sort((a, b) => b.score - a.score);
    topScores = topScores.slice(0, 5);
    try { localStorage.setItem('mtv-top5', JSON.stringify(topScores)); } catch (e) {}

    if (sb) {
        try {
            await sb.from('leaderboard').insert([
                { name: player, score: sc, level: level, mode: mode, topic: topicName }
            ]);
        } catch (err) {
            console.warn('Lỗi gửi điểm lên Supabase:', err);
        }
    }
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

async function renderRank() {
    const rankBox = $('rank-list');
    rankBox.innerHTML = '<p style="opacity:.8">Đang tải bảng xếp hạng...</p>';

    const medals = ['🥇', '🥈', '🥉', '4.', '5.'];
    const modeNames = ['Dễ', 'Vừa', 'Khó'];
    let list = [];

    if (sb) {
        try {
            const { data, error } = await sb
                .from('leaderboard')
                .select('*')
                .order('score', { ascending: false })
                .limit(5);

            if (!error && data && data.length > 0) {
                list = data.map(item => {
                    const d = new Date(item.created_at);
                    const pad = n => String(n).padStart(2, '0');
                    return {
                        name: item.name,
                        score: item.score,
                        lvl: item.level,
                        mode: item.mode,
                        date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`,
                        isCurrent: item.name === playerName && item.score === Math.round(score)
                    };
                });
            }
        } catch (err) {
            console.warn('Không tải được Supabase, chuyển sang cache local:', err);
        }
    }

    if (!list.length) {
        list = topScores.map(r => ({
            name: r.name,
            score: r.score,
            lvl: r.lvl,
            mode: r.mode,
            date: r.date,
            isCurrent: r.t === lastRecordTime
        }));
    }

    if (!list.length) {
        rankBox.innerHTML = '<p style="opacity:.8">Chưa có kỷ lục nào. Hãy là người đầu tiên ghi danh!</p>';
        return;
    }

    rankBox.innerHTML = list.map((r, i) => `
    <div class="rk-row ${i === 0 ? 'top1' : ''} ${r.isCurrent ? 'new' : ''}">
      <div class="rk-left">
        <span>${medals[i]}</span>
        <span class="rk-name">${escapeHtml(r.name || 'Người chơi')}</span>
        <span class="rk-score">⭐ ${r.score}</span>
      </div>
      <div class="rk-meta">
        <div>Cấp ${r.lvl} · ${modeNames[r.mode] || modeNames[0]}</div>
        <div>${r.date || ''}</div>
      </div>
    </div>
  `).join('');
}

function openRank(fromScreen) {
    rankFrom = fromScreen;
    renderRank();
    $(fromScreen).classList.add('hide');$('rank').classList.remove('hide');
    snd(600, .08, 'triangle', .06);
}

function promptPlayerName() {
    state = 'name';
  $('start').classList.add('hide');
    $('name-err').classList.add('hide');$('name-modal').classList.remove('hide');
    const inp = $('player-name');
    inp.value = playerName;
    setTimeout(() => {
        inp.focus();
        inp.select();
    }, 50);
    snd(520, .08, 'triangle', .06);
}

function confirmNameAndPlay() {
    const val = $('player-name').value.trim();
    if (!val) {
    $('name-err').classList.remove('hide');
        snd(180, .18, 'sawtooth', .06, .6);
    $('player-name').focus();
        return;
    }
    playerName = val;
    try {
        localStorage.setItem('mtv-name', playerName);
    } catch (e) {}
  $('name-modal').classList.add('hide');
    begin();
}

function resume() {
    state = 'play';
  $('start').classList.add('hide');
    $('modes').style.display = '';$('btn-rank-start').style.display = '';
    refocus();
}

function begin() {
    reset();
    state = 'play';
    if (!muted && 'speechSynthesis' in window) {
        try {
            const u = new SpeechSynthesisUtterance('');
            u.volume = 0;
            speechSynthesis.speak(u);
        } catch (e) {}
    }
  $('play').textContent = 'Play';
    $('modes').style.display = '';$('btn-rank-start').style.display = '';
    $('start').classList.add('hide');$('name-modal').classList.add('hide');
    $('over').classList.add('hide');$('rank').classList.add('hide');
    mascot.x = W / 2;
    refocus();
    snd(660, .15, 'triangle', .07, 1.5);
}

function syncSettingsUI() {
    document.querySelectorAll('#topics button').forEach(x => x.classList.toggle('on', x.dataset.topic === currentTopic));
    document.querySelectorAll('#over-topics button').forEach(x => x.classList.toggle('on', x.dataset.topic === currentTopic));
    document.querySelectorAll('#modes button').forEach(x => x.classList.toggle('on', +x.dataset.m === mode));
    document.querySelectorAll('#over-modes button').forEach(x => x.classList.toggle('on', +x.dataset.m === mode));
}

function end() {
    state = 'over';
    const finalScore = Math.round(score);
    const best = finalScore > bestEver;
    if (best) {
        bestEver = finalScore;
        try {
            localStorage.setItem('mtv-best', bestEver);
        } catch (e) {}
    }
    saveScore(finalScore);
    syncSettingsUI();
  $('big').textContent = finalScore;
    const acc = hits + misses ? Math.round(hits / (hits + misses) * 100) : 100;
  $('stats').textContent = (best ? 'Kỷ lục mới! ' : 'Kỷ lục: ' + bestEver + '. ') + `${playerName} hạ ${killed} từ · Chính xác ${acc}%`;
    $('miss').innerHTML = missed.size ? '<b>Từ cần ôn:</b> ' + [...missed].slice(0, 6).map(([w, v]) => w + ' = ' + v).join(' · ') : 'Không bỏ sót từ nào, quá đỉnh!';
    [523, 440, 349, 262].forEach((f, i) => snd(f, .25, 'triangle', .07, 0, i * .15));
    setTimeout(() => $('over').classList.remove('hide'), 500);
}

// Gắn sự kiện các nút
$('play').onclick = () => state === 'paused' ? resume() : promptPlayerName();
$('confirm-name').onclick = confirmNameAndPlay;
$('cancel-name').onclick = () => {
    state = 'menu';
    $('name-modal').classList.add('hide');
    $('start').classList.remove('hide');
    snd(480, .08, 'triangle', .06);
};
$('player-name').addEventListener('input', () => $('name-err').classList.add('hide'));

$('again').onclick = begin;

$('btn-rank-start').onclick = () => openRank('start');
$('btn-rank-over').onclick = () => openRank('over');
$('close-rank').onclick = () => {
    $('rank').classList.add('hide');
    $(rankFrom).classList.remove('hide');
    snd(480, .08, 'triangle', .06);
};

const btnHome = $('btn-home');
if (btnHome) {
    btnHome.onclick = () => {
        state = 'menu';
        $('over').classList.add('hide');
        $('start').classList.remove('hide');
        $('modes').style.display = '';
        $('btn-rank-start').style.display = '';
        $('play').textContent = 'Play';
        syncSettingsUI();
        snd(480, .08, 'triangle', .06);
    };
}

// Chọn độ khó màn hình chính
document.querySelectorAll('#modes button').forEach(b => b.onclick = () => {
    if (state === 'paused') return;
    mode = +b.dataset.m;
    syncSettingsUI();
});

// Chọn chủ đề màn hình chính
document.querySelectorAll('#topics button').forEach(b => b.onclick = () => {
    if (state === 'paused') return;
    currentTopic = b.dataset.topic;
    WORDS = WORD_PACKS[currentTopic] || WORD_PACKS.all;
    syncSettingsUI();
    snd(500, .06, 'triangle', .05);
});

// Chọn chủ đề màn hình Game Over
document.querySelectorAll('#over-topics button').forEach(b => b.onclick = () => {
    currentTopic = b.dataset.topic;
    WORDS = WORD_PACKS[currentTopic] || WORD_PACKS.all;
    syncSettingsUI();
    snd(500, .06, 'triangle', .05);
});

// Chọn độ khó màn hình Game Over
document.querySelectorAll('#over-modes button').forEach(b => b.onclick = () => {
    mode = +b.dataset.m;
    syncSettingsUI();
    snd(500, .06, 'triangle', .05);
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'play') {
        state = 'paused';
        $('modes').style.display = 'none';
        $('btn-rank-start').style.display = 'none';
        $('play').textContent = 'Chơi tiếp';
        $('start').classList.remove('hide');
    }
});

addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (state === 'menu') promptPlayerName();
        else if (state === 'name') confirmNameAndPlay();
        else if (state === 'over') begin();
        else if (state === 'paused') resume();
    }
});

resize();
initStars();
reset();
(document.fonts && document.fonts.load('700 24px Fredoka') || Promise.resolve()).finally(() => requestAnimationFrame(loop));