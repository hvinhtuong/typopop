(() => {
    // --- Cấu hình Supabase ---
    const SUPABASE_URL = 'https://ksiapqqsxgnctbwdzxzj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaWFwcXFzeGduY3Rid2R6eHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDg5NDcsImV4cCI6MjEwODIyNDk0N30.gf4iMpC28lqfluWtK0Cf2RZfysQQblNDJxB5FvrVdDU';

    let sb = null;
    try {
        if (window.supabase && SUPABASE_URL && SUPABASE_KEY.startsWith('eyJ')) {
            sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
    } catch (e) {
        console.warn('Lỗi khởi tạo Supabase:', e);
    }

    const WORD_PACKS = {
        all: [],
        it: `code:mã nguồn|data:dữ liệu|bug:lỗi|file:tập tin|host:máy chủ|node:nút mạng|user:người dùng|byte:byte|link:liên kết|port:cổng mạng|developer:lập trình viên|software:phần mềm|hardware:phần cứng|database:cơ sở dữ liệu|network:mạng máy tính|security:bảo mật|cloud:điện toán đám mây|framework:khung làm việc|deployment:triển khai|repository:kho lưu trữ|algorithm:thuật toán|debugging:gỡ lỗi|interface:giao diện|compile:biên dịch|terminal:cửa sổ lệnh|variable:biến|function:hàm|syntax:cú pháp|server:máy chủ|client:máy khách|backend:phía máy chủ|frontend:giao diện người dùng|fullstack:toàn diện|pipeline:quy trình tự động|container:vỏ đóng gói|docker:nền tảng ảo hóa|cluster:cụm máy chủ|memory:bộ nhớ|storage:lưu trữ|cache:bộ nhớ đệm|binary:nhị phân|protocol:giao thức|endpoint:điểm cuối api|payload:dữ liệu truyền tải|query:truy vấn|thread:luồng xử lý|process:tiến trình|exception:ngoại lệ lỗi|parameter:tham số|argument:đối số|compiler:trình biên dịch|runtime:thời gian chạy|library:thư viện mã|package:gói phần mềm|firewall:tường lửa|encryption:mã hóa|decryption:giải mã|token:mã xác thực|session:phiên làm việc|cookie:dữ liệu duyệt web|router:thiết bị định tuyến|bandwidth:băng thông|latency:độ trễ mạng|backup:sao lưu dự phòng|restore:phục hồi|virtual:ảo hóa|instance:thực thể máy chủ|scalable:khả năng mở rộng|monitoring:giám sát|performance:hiệu năng`.split('|').map(s => {
            const [a, b] = s.split(':');
            return {w: a, vi: b};
        }),
        travel: `map:bản đồ|bus:xe buýt|trip:chuyến đi|camp:cắm trại|tent:cái lều|tour:chuyến tham quan|pack:đóng gói|boat:con thuyền|stay:lưu trú|walk:đi dạo|airport:sân bay|passport:hộ chiếu|luggage:hành lý|hotel:khách sạn|ticket:vé đi lại|reservation:đặt chỗ|destination:điểm đến|souvenir:quà lưu niệm|guidebook:sách hướng dẫn|itinerary:lịch trình|adventure:cuộc phiêu lưu|landscape:phong cảnh|island:hòn đảo|beach:bãi biển|mountain:ngọn núi|journey:chuyến đi xa|sightseeing:ngắm cảnh|customs:hải quan|vacation:kỳ nghỉ|boarding:lên máy bay|departure:khởi hành|arrival:hạ cánh đến nơi|terminal:nhà ga sân bay|flight:chuyến bay|passenger:hành khách|suitcase:va-li|backpack:ba-lô du lịch|resort:khu nghỉ dưỡng|hostel:nhà nghỉ tập thể|motel:nhà nghỉ ven đường|reception:quầy lễ tân|checkout:trả phòng|homestay:nhà dân bản địa|scenery:cảnh quan thiên nhiên|valley:thung lũng|waterfall:thác nước|forest:khu rừng|desert:sa mạc|canyon:hẻm núi|monument:tượng đài di tích|museum:viện bảo tàng|temple:ngôi đền|palace:cung điện|explore:khám phá|culture:văn hóa bản địa|cuisine:ẩm thực vùng miền|excursion:chuyến dã ngoại|expedition:chuyến thám hiểm|cruising:du ngoạn bằng tàu|currency:tiền tệ|exchange:đổi ngoại tệ`.split('|').map(s => {
            const [a, b] = s.split(':');
            return {w: a, vi: b};
        }),
        daily: `cat:con mèo|sun:mặt trời|book:quyển sách|milk:sữa tươi|tree:cái cây|fish:con cá|rain:cơn mưa|door:cánh cửa|road:con đường|time:thời gian|chef:đầu bếp|soap:xà phòng|laughter:tiếng cười|human:con người|monkey:con khỉ|running:đang chạy|tip:mẹo nhỏ|mirror:cái gương|temperature:nhiệt độ|better:tốt hơn|happy:vui vẻ|water:nước uống|friend:bạn bè|apple:quả táo|window:cửa sổ|garden:khu vườn|family:gia đình|bridge:cây cầu|season:mùa trong năm|library:thư viện|hungry:đói bụng|answer:câu trả lời|breakfast:bữa sáng|weather:thời tiết|holiday:ngày lễ|kitchen:nhà bếp|delicious:ngon miệng|beautiful:xinh đẹp|dangerous:nguy hiểm|important:quan trọng|different:khác biệt|information:thông tin|education:giáo dục|dictionary:từ điển|vegetable:rau củ quả|exercise:tập thể dục|language:ngôn ngữ|neighbor:hàng xóm|umbrella:cái ô che|treasure:kho báu|rainbow:cầu vồng|elephant:con voi|computer:máy tính|customer:khách hàng|chocolate:sô-cô-la|butterfly:con bướm|restaurant:nhà hàng|pronounce:phát âm|comfortable:thoải mái|opportunity:cơ hội|celebrate:ăn mừng|hospital:bệnh viện|medicine:thuốc men|schedule:lịch trình|morning:buổi sáng|evening:buổi tối|midnight:nửa đêm|whisper:thì thầm|laughter:tiếng cười|promise:lời hứa|bicycle:xe đạp|furniture:nội thất|sandwich:bánh mì kẹp|apartment:căn hộ chung cư|supermarket:siêu thị`.split('|').map(s => {
            const [a, b] = s.split(':');
            return {w: a, vi: b};
        })
    };

    const allMap = new Map();
    [...WORD_PACKS.it, ...WORD_PACKS.travel, ...WORD_PACKS.daily].forEach(o => allMap.set(o.w, o));
    WORD_PACKS.all = [...allMap.values()];

    let currentTopic = 'all';
    let WORDS = WORD_PACKS.all.length > 0 ? WORD_PACKS.all : WORD_PACKS.it;
    let currentRankPeriod = 'today';
    let currentRankTopic = 'all';
    let boss = null;
    let reviewNotebook = new Map();
    let isRevengeMode = false;
    let notebookFromScreen = 'start';
    let bossWarningTimer = 0;

    // --- HỆ THỐNG NGOẠI TRANG & TIỀN TỆ ---
    let totalKilledBank = 0;
    let currentSkin = 'classic';
    let unlockedSkins = ['classic'];

    const SKINS_DATA = [
        { id: 'classic', name: 'Mèo Cổ Điển', icon: '🐱', cost: 0, desc: 'Chú mèo vàng cam ban đầu, nhanh nhẹn đáng yêu.' },
        { id: 'astro', name: 'Phi Hành Gia', icon: '👨‍🚀', cost: 30, desc: 'Đội mũ phi hành gia phản quang, bắn đạn laser xanh lam.' },
        { id: 'ninja', name: 'Cyber Ninja', icon: '🥷', cost: 70, desc: 'Mặt nạ hắc ám, mắt đỏ ngầu, bắn phi tiêu bóng đêm.' },
        { id: 'wizard', name: 'Phù Thủy Tối Thượng', icon: '🧙‍♂️', cost: 120, desc: 'Mũ phép thuật tím đính sao, bắn cầu lửa rực sáng.' }
    ];

    try {
        totalKilledBank = +localStorage.getItem('mtv-total-killed') || 0;
        currentSkin = localStorage.getItem('mtv-current-skin') || 'classic';
        unlockedSkins = JSON.parse(localStorage.getItem('mtv-unlocked-skins') || '["classic"]');
    } catch (e) {}

    function saveCosmeticsData() {
        try {
            localStorage.setItem('mtv-total-killed', totalKilledBank);
            localStorage.setItem('mtv-current-skin', currentSkin);
            localStorage.setItem('mtv-unlocked-skins', JSON.stringify(unlockedSkins));
        } catch (e) {}
    }

    const $ = id => document.getElementById(id);
    const cv = $('c'), ctx = cv.getContext('2d'), kb = $('kb');
    const COL = ['#ff6fae', '#ffd23f', '#3ee6b0', '#5cc8ff', '#b79cff', '#ff9a5c'];
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const GAME_TIPS = [
        '💣 Hạ từ có biểu tượng Bom để nổ sạch toàn bộ chữ trên màn hình!',
        '❄️ Hạ từ có Bông tuyết để đóng băng, làm chậm tốc độ rơi 5 giây!',
        '💖 Hạ từ có Trái tim để hồi lại 1 mạng (hoặc +1000 điểm nếu đầy máu)!',
        '🔥 Đạt chuỗi Combo 10 để kích hoạt FEVER MODE: bắn đạn kép & x2 điểm!',
        '⌨️ Gõ sai từ sẽ làm mất toàn bộ Combo và thoát trạng thái Fever!',
        '🎯 Nhấn phím Backspace hoặc Escape để bỏ chọn từ đang gõ dở dang.',
        '📱 Trên điện thoại: bạn có thể chạm thẳng vào từ để chọn nhanh mục tiêu.',
        'BOSS sẽ xuất hiện sau mỗi 5 level!'
    ];

    try {
        const savedNb = JSON.parse(localStorage.getItem('mtv-notebook') || '[]');
        savedNb.forEach(([w, data]) => reviewNotebook.set(w, data));
    } catch (e) {}

    function saveNotebookToLocal() {
        try {
            localStorage.setItem('mtv-notebook', JSON.stringify([...reviewNotebook]));
        } catch (e) {}
    }

    let tipTimer = 0, currentTipIdx = 0;

    let W = window.innerWidth || 400, H = window.innerHeight || 700, DPR = 1, mode = 0, state = 'menu', last = 0;

    let words = [], parts = [], bullets = [], floats = [], stars = [], score = 0, lives = 5, combo = 0, level = 1,
        killed = 0, hits = 0, misses = 0, missed = new Map(), target = null, spawnT = 0.5,
        shake = 0, bestEver = 0, topScores = [], lastRecordTime = 0, playerName = '', rankFrom = 'start',
        mascot = {x: 200, sq: 0, look: 0, mouth: 0}, freezeTimer = 0, isFever = false;

    try {
        bestEver = +localStorage.getItem('mtv-best') || 0;
        playerName = localStorage.getItem('mtv-name') || '';
        topScores = JSON.parse(localStorage.getItem('mtv-top5') || '[]');
        if (!topScores.length && bestEver > 0) {
            topScores = [{name: playerName || 'Người chơi', score: bestEver, lvl: 1, mode: 0, date: 'Kỷ lục cũ', t: 0}];
        }
    } catch (e) {}

    /* ---------- âm thanh ---------- */
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
        if ('speechSynthesis' in window) {
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

    if ($('mute')) {
        $('mute').onclick = e => {
            muted = !muted;
            if (muted && 'speechSynthesis' in window) speechSynthesis.cancel();
            e.target.textContent = muted ? '🔇' : '🔊';
            refocus();
        };
    }

    /* ---------- KÍCH THƯỚC CHUẨN XÁC KHÔNG LỆCH MATRIX ---------- */
    function resize() {
        const vv = window.visualViewport;
        W = vv ? vv.width : window.innerWidth;
        H = vv ? vv.height : window.innerHeight;
        DPR = Math.min(window.devicePixelRatio || 1, 2);

        if ($('app')) $('app').style.height = H + 'px';
        cv.width = Math.floor(W * DPR);
        cv.height = Math.floor(H * DPR);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(DPR, DPR);

        if (!mascot || isNaN(mascot.x)) {
            mascot = {x: W / 2, sq: 0, look: 0, mouth: 0};
        }
    }

    addEventListener('resize', resize);
    if (window.visualViewport) {
        visualViewport.addEventListener('resize', resize);
    }

    function fs() {
        return Math.max(20, Math.min(30, W / 17));
    }

    function initStars() {
        stars = Array.from({length: 100}, () => ({
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
        spawnT = 0.5;
        shake = 0;
        freezeTimer = 0;
        isFever = false;
        mascot = {x: W / 2, sq: 0, look: 0, mouth: 0};
        boss = null;
        bossWarningTimer = 0;
        const warnEl = $('boss-warning');
        if (warnEl) warnEl.classList.add('hide');
        const bossHud = $('boss-hud');
        if (bossHud) bossHud.classList.add('hide');
        document.body.classList.remove('fever-active');
        hud();
    }

    function hud() {
        if ($('score')) $('score').textContent = '⭐ ' + Math.round(score);
        if ($('lvl')) $('lvl').textContent = 'Cấp ' + level;
        if ($('hearts')) $('hearts').textContent = '💗'.repeat(Math.max(lives, 0)) + '🤍'.repeat(5 - Math.max(lives, 0));

        const c = $('combo');
        if (c) {
            c.style.visibility = combo >= 2 ? 'visible' : 'hidden';
            c.textContent = 'x' + combo + ' 🔥';
            c.classList.add('pop');
            setTimeout(() => c.classList.remove('pop'), 150);
        }

        const feverPill = $('fever-pill');
        if (feverPill) {
            if (combo >= 10) {
                if (!isFever) {
                    isFever = true;
                    document.body.classList.add('fever-active');
                    say('🔥 FEVER ACTIVE! x2 POINT 🔥', W / 2, H * .35, '#ff007f', 30);
                    [523, 659, 784, 1047].forEach((f, i) => snd(f * 1.2, .15, 'sawtooth', .08, 0, i * .06));
                    burst(W / 2, H * .35, '#ff007f', 50);
                }
                feverPill.style.display = 'block';
                feverPill.textContent = `🔥 FEVER x${Math.min(combo, 99)} 🔥`;
            } else {
                isFever = false;
                document.body.classList.remove('fever-active');
                feverPill.style.display = 'none';
            }
        }
    }

    function refocus() {
        if (state === 'play' && kb) {
            try {
                kb.focus({preventScroll: true});
            } catch (e) {
                kb.focus();
            }
        }
    }

    /* ---------- SINH TỪ VỰNG ---------- */
    function spawn() {
        if (!WORDS || WORDS.length === 0) {
            WORDS = WORD_PACKS.all.length > 0 ? WORD_PACKS.all : WORD_PACKS.it;
        }

        let pool;
        if (isRevengeMode && reviewNotebook.size > 0) {
            const revengeWords = [...reviewNotebook.entries()].map(([w, data]) => ({ w, vi: data.vi }));
            pool = revengeWords.filter(o => !words.some(x => x.w === o.w));
            if (pool.length === 0) pool = revengeWords;
        } else {
            const maxLen = [5, 7, 9][mode] + Math.floor(level * 1.2);
            pool = WORDS.filter(o => o && o.w && o.w.length <= maxLen && !words.some(x => x.w === o.w));
            if (pool.length === 0) pool = WORDS;
        }

        const o = pool[Math.random() * pool.length | 0] || {w: 'star', vi: 'ngôi sao'};

        ctx.font = `700 ${fs()}px Fredoka,sans-serif`;
        const textMetric = ctx.measureText(o.w || 'word');
        const w = (textMetric ? textMetric.width : 60) + 36;
        const m = w / 2 + 10;

        let x = m + Math.random() * Math.max(20, W - 2 * m);
        for (let i = 0; i < 8; i++) {
            const c = m + Math.random() * Math.max(20, W - 2 * m);
            if (!words.some(q => q.y < 90 && Math.abs(q.x - c) < (q.pw + w) / 2 + 10)) {
                x = c;
                break;
            }
        }

        let power = null;
        const rand = Math.random();
        if (rand < 0.12) power = 'bomb';
        else if (rand < 0.25) power = 'freeze';
        else if (rand < 0.35) power = 'heal';

        words.push({
            w: o.w,
            vi: o.vi,
            x: Math.max(m, Math.min(W - m, x)),
            y: -30,
            pw: w,
            vy: (28 + level * 5 + Math.random() * 12 + mode * 10) * Math.max(.85, H / 700),
            typed: 0,
            ph: Math.random() * 6,
            col: COL[Math.random() * COL.length | 0],
            locked: false,
            sc: 0,
            power
        });
    }

    function pickByChar(ch) {
        let b = null;
        for (const q of words) if (!q.locked && q.w && q.w[0] === ch && (!b || q.y > b.y)) b = q;
        return b;
    }

    /* ---------- GÕ PHÍM ---------- */
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

        if (!target) {
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

        let bulletColor = '#ffd23f';
        if (currentSkin === 'astro') bulletColor = '#63b3ed';
        else if (currentSkin === 'ninja') bulletColor = '#ff2a5f';
        else if (currentSkin === 'wizard') bulletColor = '#b794f4';

        if (isFever) {
            bullets.push({x: mascot.x - 12, y: H - 95, t, kill: t.typed === t.w.length, lx: t.x, ly: t.y, tr: [], isFever: true, col: '#ff007f'});
            bullets.push({x: mascot.x + 12, y: H - 95, t, kill: t.typed === t.w.length, lx: t.x, ly: t.y, tr: [], isFever: true, col: '#00f2fe'});
            snd(650 + t.typed * 55, .08, 'sawtooth', .08);
        } else {
            bullets.push({x: mascot.x, y: H - 95, t, kill: t.typed === t.w.length, lx: t.x, ly: t.y, tr: [], col: bulletColor});
            snd(520 + t.typed * 45, .09, 'triangle', .06);
        }

        if (t.typed === t.w.length) {
            t.locked = true;
            target = null;
        }
    }

    if (kb) {
        kb.addEventListener('input', () => {
            const v = kb.value;
            kb.value = '';
            if (!v) return;
            for (const ch of v) typeChar(ch);
        });
    }

    addEventListener('keydown', e => {
        if (state !== 'play') return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (e.key === 'Backspace' || e.key === 'Escape') {
            if (target && !target.locked) {
                target.typed = 0;
                target = null;
            }
            if (kb) kb.value = '';
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
            typeChar(ch);
            if (kb) kb.value = '';
            e.preventDefault();
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
        e.preventDefault();
    });

    /* ---------- HIỆU ỨNG ---------- */
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
                c: isFever ? (Math.random() < .5 ? '#ff007f' : '#00f2fe') : (Math.random() < .6 ? col : COL[Math.random() * COL.length | 0]),
                r: 3 + Math.random() * 6,
                star: star && Math.random() < .6,
                rot: Math.random() * 6
            });
        }
    }

    function say(t, x, y, c, size = 26) {
        floats.push({t, x, y, c, l: 0, size});
    }

    function kill(q) {
        killed++;
        combo++;

        const feverMultiplier = isFever ? 2 : 1;
        const gain = Math.round(q.w.length * 10 * (1 + Math.min(combo, 12) * .15)) * feverMultiplier;
        score += gain;
        burst(q.x, q.y, q.col, isFever ? 45 : 30);

        const pointText = isFever ? `🔥 +${gain} (x2) · ${q.vi}` : `+${gain} · ${q.vi}`;
        say(pointText, q.x, q.y - 10, isFever ? '#ff007f' : '#ffd23f', isFever ? 25 : 22);

        if (q.power === 'bomb') {
            say('💣 BOOM !!! - CLEAR ALL', W / 2, H * .4, '#ff5d6c', 30);
            snd(120, .4, 'sawtooth', .12, .3);
            burst(W / 2, H / 2, '#ff5d6c', 80);
            shake = reduce ? 0 : .6;

            const others = words.filter(w => w !== q && !w.locked);
            others.forEach(w => {
                killed++;
                score += Math.round(w.w.length * 8) * feverMultiplier;
                burst(w.x, w.y, '#ffd23f', 16);
                words.splice(words.indexOf(w), 1);
            });
            target = null;
        } else if (q.power === 'freeze') {
            freezeTimer = 5;
            say('❄️ FREEZE - ĐÓNG BĂNG 5s!', q.x, q.y - 40, '#5cc8ff', 24);
            [600, 800, 1000].forEach((f, i) => snd(f, .15, 'sine', .08, 0, i * .06));
        } else if (q.power === 'heal') {
            if (lives < 5) {
                lives++;
                say('💖 +1 HEART!', q.x, q.y - 40, '#ff6fae', 26);
                [440, 554, 659].forEach((f, i) => snd(f, .15, 'triangle', .08, 0, i * .08));
            } else {
                say('+1000 POINT!', q.x, q.y - 40, '#ff6fae', 22);
                score += 1000;
            }
        }

        if (combo >= 3 && !q.power && !isFever) {
            say(['GREAT!', 'GOOD!', 'MASTER!', 'UNSTOPPABLE!'][Math.min(combo - 3, 3)] + ' x' + combo, q.x, q.y - 44, '#ff6fae', 22);
        }
        sPop(combo);
        speak(q.w);

        const idx = words.indexOf(q);
        if (idx !== -1) words.splice(idx, 1);

        if (boss && q.isBossMinion) {
            boss.hp--;
            boss.hitTimer = 0.2;
            updateBossHpBar();
            burst(boss.x, boss.y, '#ff2a5f', 35);
            snd(160, .25, 'sawtooth', .14, .4);

            if (boss.hp <= 0) {
                // BOSS DEFEATED!
                say('💥 BOSS DEFEATED! +2000 💥', W / 2, H * .4, '#ffd23f', 34);
                score += 2000;
                burst(boss.x, boss.y, '#ffd23f', 90);
                burst(boss.x, boss.y, '#ff2a5f', 90);
                shake = reduce ? 0 : 0.8;
                [392, 523, 659, 784, 1047].forEach((f, i) => snd(f * 1.3, .2, 'triangle', .09, 0, i * .08));

                boss = null;
                const bossHud = $('boss-hud');
                if (bossHud) bossHud.classList.add('hide');

                level++;
                hud();
            }
        }

        if (!boss && killed > 0 && killed % 10 === 0) {
            if (level % 5 === 4) { // Cứ trước khi lên Level 5, 10... sẽ gọi Boss
                level++;
                hud();
                triggerBossBattle();
            } else {
                level++;
                say('Level ' + level + '!', W / 2, H * .4, '#3ee6b0', Math.min(64, W / 7));
                burst(W / 2, H * .4, '#3ee6b0', 60);
                [392, 523, 659, 784].forEach((f, i) => snd(f, .2, 'square', .05, 0, i * .09));
                hud();
            }
        }

        if (isRevengeMode && reviewNotebook.has(q.w)) {
            const item = reviewNotebook.get(q.w);
            item.count--;
            if (item.count <= 0) reviewNotebook.delete(q.w);
            saveNotebookToLocal();
        }
        hud();
    }

    function lose(q) {
        lives--;
        combo = 0;
        shake = reduce ? 0 : .5;
        burst(q.x, H - 75, '#ff5d6c', 26, false);
        say('Oops!', q.x, H - 120, '#ff5d6c');
        snd(220, .35, 'square', .06, .4);
        if (!missed.has(q.w)) missed.set(q.w, q.vi);

        // Lưu từ vào sổ tay ôn tập
        const existing = reviewNotebook.get(q.w) || { vi: q.vi, count: 0 };
        existing.count++;
        existing.vi = q.vi;
        reviewNotebook.set(q.w, existing);
        saveNotebookToLocal();

        if (target === q) target = null;
        words.splice(words.indexOf(q), 1);
        hud();
        if (lives <= 0) end();
    }

    /* ---------- CẬP NHẬT TỌA ĐỘ VÀ VẬT LÝ ---------- */
    function update(dt) {
        updateTip(dt);

        if (freezeTimer > 0) {
            freezeTimer = Math.max(0, freezeTimer - dt);
        }

        // Chỉ spawn từ thường khi không có Boss
        if (!boss && bossWarningTimer <= 0) {
            spawnT -= dt;
            if (spawnT <= 0 && words.length < 4 + level) {
                try { spawn(); } catch (e) {}
                spawnT = Math.max(.9, 2.6 - level * .18 - mode * .3) + Math.random() * .6;
            }
        }

        // Chuyển động của Boss
        if (boss) {
            boss.x += boss.vx * dt;
            if (boss.x < 80) {
                boss.x = 80;
                boss.vx = Math.abs(boss.vx);
            } else if (boss.x > W - 80) {
                boss.x = W - 80;
                boss.vx = -Math.abs(boss.vx);
            }

            if (boss.hitTimer > 0) boss.hitTimer -= dt;

            // Nếu từ bảo vệ bị hạ gục, Boss chuẩn bị thả từ tiếp theo
            if (!words.some(q => q.isBossMinion)) {
                spawnBossWord();
            }
        }

        const freezeSlowFactor = freezeTimer > 0 ? 0.35 : 1.0;

        for (const q of words.slice()) {
            q.ph += dt * 2;
            const nearBottom = q === target && q.y > H - 150;
            const speedFactor = (q.locked ? 0.1 : (nearBottom ? 0.65 : 1)) * freezeSlowFactor;
            q.y += q.vy * speedFactor * dt;
            if (q.locked && q.y > H - 95) q.y = H - 95;
            q.sc *= .88;

            if (!q.locked && H > 250 && q.y > H - 95) {
                lose(q);
            }
        }

        for (const b of bullets) {
            const t = b.t.dead ? null : b.t;
            if (t) {
                b.lx = t.x;
                b.ly = t.y;
            }
            const dx = b.lx - b.x, dy = b.ly - b.y, d = Math.hypot(dx, dy), s = (b.isFever ? 1400 : 1100) * dt;
            b.tr.push([b.x, b.y]);
            if (b.tr.length > (b.isFever ? 8 : 6)) b.tr.shift();
            if (d <= s + 8) {
                b.done = true;
                burst(b.lx, b.ly, b.t.col, b.kill ? 0 : (b.isFever ? 10 : 6));
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

        const targetX = target ? target.x : (W > 0 ? W / 2 : 200);
        if (isNaN(mascot.x)) mascot.x = targetX;
        mascot.x += (targetX - mascot.x) * Math.min(1, dt * 8);
        mascot.sq *= .85;
        mascot.mouth *= .9;
        shake = Math.max(0, shake - dt);

        const starSpeedMultiplier = isFever ? 2.5 : 1.0;
        for (const s of stars) {
            s.t += dt * s.s * 3 * starSpeedMultiplier;
            s.y += dt * s.s * .012 * (1 + level * .1) * starSpeedMultiplier;
            if (s.y > 1) s.y = 0;
        }
    }

    function updateTip(dt) {
        if (state !== 'play') return;
        const tipEl = $('game-tip');
        if (!tipEl) return;

        tipTimer -= dt;
        if (tipTimer <= 0) {
            currentTipIdx = (currentTipIdx + 1) % GAME_TIPS.length;
            tipEl.innerHTML = '💡 ' + GAME_TIPS[currentTipIdx];
            tipEl.classList.remove('hide');
            tipEl.classList.add('show');
            tipTimer = 9;
        }
    }

    function rr(x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
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

    /* ---------- VẼ NỀN & KHÔNG GIAN ---------- */
    function drawBg(t) {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        if (isFever) {
            g.addColorStop(0, '#3d0a4e');
            g.addColorStop(.6, '#20083b');
            g.addColorStop(1, '#0c021c');
        } else {
            g.addColorStop(0, '#2a1a6e');
            g.addColorStop(.6, '#1a1245');
            g.addColorStop(1, '#0f0a30');
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        const aura1 = isFever ? 'rgba(255,0,128,.28)' : 'rgba(255,111,174,.16)';
        const aura2 = isFever ? 'rgba(0,242,254,.24)' : 'rgba(92,200,255,.14)';
        for (const [cx, cy, c, r] of [[.2, .25, aura1, .45], [.85, .6, aura2, .5], [.5, .9, 'rgba(183,156,255,.14)', .5]]) {
            const x = cx * W + Math.sin(t / 4000 + cx * 9) * 30, y = cy * H + Math.cos(t / 5000 + cy * 9) * 30,
                rg = ctx.createRadialGradient(x, y, 0, x, y, r * Math.max(W, H) * .6);
            rg.addColorStop(0, c);
            rg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = rg;
            ctx.fillRect(0, 0, W, H);
        }
        for (const s of stars) {
            ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(s.t));
            ctx.fillStyle = isFever ? '#ffc2eb' : '#fff';
            ctx.beginPath();
            ctx.arc(s.x * W, s.y * H, s.r * (isFever ? 1.4 : 1), 0, 6.283);
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

        let strokeColor = q.col;
        let fillColor = isT ? 'rgba(255,210,63,.22)' : 'rgba(255,255,255,.12)';
        let badge = '';

        if (q.power === 'bomb') {
            strokeColor = '#ff4d4d';
            fillColor = 'rgba(255,77,77,.28)';
            badge = '💣';
            ctx.shadowColor = '#ff4d4d';
            ctx.shadowBlur = 16 + Math.sin(t / 80) * 6;
        } else if (q.power === 'freeze') {
            strokeColor = '#5cc8ff';
            fillColor = 'rgba(92,200,255,.28)';
            badge = '❄️';
            ctx.shadowColor = '#5cc8ff';
            ctx.shadowBlur = 16 + Math.sin(t / 100) * 6;
        } else if (q.power === 'heal') {
            strokeColor = '#ff6fae';
            fillColor = 'rgba(255,111,174,.28)';
            badge = '💖';
            ctx.shadowColor = '#ff6fae';
            ctx.shadowBlur = 16 + Math.sin(t / 100) * 6;
        }

        if (isT || q.locked) {
            ctx.shadowColor = q.locked ? '#3ee6b0' : (isFever ? '#ff007f' : '#ffd23f');
            ctx.shadowBlur = 20 + Math.sin(t / 120) * 8;
            fillColor = isFever ? 'rgba(255,0,128,.32)' : 'rgba(255,210,63,.28)';
            strokeColor = isFever ? '#ff007f' : '#ffd23f';
        }

        rr(-q.pw / 2, -h / 2, q.pw, h, h / 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.lineWidth = isT ? 3 : 2;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (badge) {
            ctx.save();
            const ex = -q.pw / 2 + 8;
            const ey = -h / 2 - 12;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            const emojiSize = Math.max(22, Math.round(f * 0.95));
            ctx.font = `${emojiSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(badge, ex, ey);
            ctx.restore();
        }

        ctx.font = `700 ${f}px Fredoka,sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        const a = q.w.slice(0, q.typed), tw = ctx.measureText(q.w).width, x0 = -tw / 2;
        ctx.fillStyle = isFever ? '#00f2fe' : '#3ee6b0';
        ctx.fillText(a, x0, 1);
        ctx.fillStyle = '#fff';
        ctx.fillText(q.w.slice(q.typed), x0 + ctx.measureText(a).width, 1);

        ctx.textAlign = 'center';
        ctx.font = `500 ${f * .56}px Fredoka,sans-serif`;
        ctx.fillStyle = isT ? (isFever ? '#ff85e0' : '#ffe98a') : 'rgba(255,214,235,.85)';
        ctx.fillText(q.vi, 0, h / 2 + f * .4);
        ctx.restore();
    }

    function drawMascot(t) {
        const m = mascot;
        const x = isNaN(m.x) ? W / 2 : m.x;
        const y = H - 78 + Math.sin(t / 300) * 3;
        const s = 1 + (m.sq || 0) * .18, k = 1 - (m.sq || 0) * .14;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(s * k, s / k * 1.0);

        // Màu lông theo skin
        let furColor = '#ffb347';
        let faceGradientStart = '#ffe98a';
        let faceGradientEnd = '#ffb347';

        if (currentSkin === 'ninja') {
            furColor = '#2d3748';
            faceGradientStart = '#4a5568';
            faceGradientEnd = '#1a202c';
        } else if (currentSkin === 'wizard') {
            furColor = '#9f7aea';
            faceGradientStart = '#b794f4';
            faceGradientEnd = '#6b46c1';
        } else if (currentSkin === 'astro') {
            furColor = '#e2e8f0';
            faceGradientStart = '#ffffff';
            faceGradientEnd = '#cbd5e0';
        }

        if (isFever) {
            furColor = '#ff79c6';
            faceGradientStart = '#ff92d0';
            faceGradientEnd = '#ff3b9d';
        }

        ctx.fillStyle = furColor;

        // Tai mèo
        for (const d of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(d * 14, -22);
            ctx.lineTo(d * 30, -46);
            ctx.lineTo(d * 34, -14);
            ctx.closePath();
            ctx.fill();
        }

        // Mặt mèo
        const g = ctx.createRadialGradient(-8, -14, 4, 0, 0, 40);
        g.addColorStop(0, faceGradientStart);
        g.addColorStop(1, faceGradientEnd);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, 38, 32, 0, 0, 6.283);
        ctx.fill();

        // Phụ kiện riêng theo từng Skin
        if (currentSkin === 'wizard') {
            // Mũ phù thủy chóp nhọn
            ctx.fillStyle = '#44337a';
            ctx.beginPath();
            ctx.moveTo(-36, -18);
            ctx.lineTo(0, -65);
            ctx.lineTo(36, -18);
            ctx.closePath();
            ctx.fill();

            // Vành mũ
            ctx.fillStyle = '#ffd23f';
            ctx.beginPath();
            ctx.ellipse(0, -18, 42, 6, 0, 0, 6.283);
            ctx.fill();
        } else if (currentSkin === 'astro') {
            // Mũ kính phi hành gia không gian
            ctx.strokeStyle = '#63b3ed';
            ctx.lineWidth = 3;
            ctx.fillStyle = 'rgba(190, 227, 248, 0.35)';
            ctx.beginPath();
            ctx.arc(0, -2, 42, 0, 6.283);
            ctx.fill();
            ctx.stroke();
        } else if (currentSkin === 'ninja') {
            // Băng đeo trán ninja
            ctx.fillStyle = '#e53e3e';
            ctx.fillRect(-32, -18, 64, 8);
        }

        // Má hồng
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

        if (isFever) {
            // Đeo kính râm khi vào Fever Mode
            ctx.save();
            ctx.fillStyle = '#111';
            ctx.shadowColor = '#00f2fe';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(-24, -10);
            ctx.lineTo(24, -10);
            ctx.lineTo(18, 4);
            ctx.lineTo(-18, 4);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-16, -2);
            ctx.lineTo(-6, -2);
            ctx.moveTo(6, -2);
            ctx.lineTo(16, -2);
            ctx.stroke();
            ctx.restore();
        } else {
            const blink = Math.sin(t / 900) > .97 ? .15 : 1;
            ctx.fillStyle = currentSkin === 'ninja' ? '#ff1a1a' : '#3a1250';
            for (const d of [-1, 1]) {
                ctx.beginPath();
                ctx.ellipse(d * 13 + lx, -4 + ly, 5, 6 * blink, 0, 0, 6.283);
                ctx.fill();
            }
        }

        // Miệng
        ctx.strokeStyle = currentSkin === 'ninja' ? '#ffffff' : '#3a1250';
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

    /* ---------- HÀM RENDER AN TOÀN TUYỆT ĐỐI (TRY...FINALLY) ---------- */
    function draw(t) {
        ctx.save();
        try {
            if (shake > 0) ctx.translate((Math.random() - .5) * shake * 20, (Math.random() - .5) * shake * 20);

            // 1. Vẽ nền vũ trụ
            drawBg(t);

            // 2. Vẽ Phi thuyền Boss Cyber Mothership (VẼ SAU NỀN ĐỂ KHÔNG BỊ ĐÈ)
            if (boss) {
                ctx.save();
                const floatY = boss.y + Math.sin(t / 250) * 5;
                ctx.translate(boss.x, floatY);

                if (boss.hitTimer > 0) {
                    ctx.translate((Math.random() - .5) * 8, (Math.random() - .5) * 8);
                }

                // Hào quang phản lực
                ctx.shadowColor = '#ff2a5f';
                ctx.shadowBlur = 22 + Math.sin(t / 80) * 8;

                // Thân phi thuyền mẹ
                ctx.fillStyle = boss.hitTimer > 0 ? '#ffffff' : '#220b3b';
                ctx.strokeStyle = '#ff2a5f';
                ctx.lineWidth = 3.5;

                ctx.beginPath();
                ctx.moveTo(-boss.w / 2, 0);
                ctx.lineTo(-boss.w / 4, -boss.h / 2);
                ctx.lineTo(boss.w / 4, -boss.h / 2);
                ctx.lineTo(boss.w / 2, 0);
                ctx.lineTo(boss.w / 3, boss.h / 2);
                ctx.lineTo(-boss.w / 3, boss.h / 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Cánh năng lượng hai bên
                ctx.fillStyle = '#ff007f';
                for (const side of [-1, 1]) {
                    ctx.beginPath();
                    ctx.moveTo(side * (boss.w / 2), 0);
                    ctx.lineTo(side * (boss.w / 2 + 18), -10);
                    ctx.lineTo(side * (boss.w / 2 - 10), 18);
                    ctx.closePath();
                    ctx.fill();
                }

                // Lõi năng lượng Neon ở trung tâm
                ctx.fillStyle = '#00f2fe';
                ctx.shadowColor = '#00f2fe';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(0, 4, 11 + Math.sin(t / 90) * 3, 0, 6.283);
                ctx.fill();

                ctx.restore();
            }

            if (freezeTimer > 0) {
                ctx.fillStyle = `rgba(92, 200, 255, ${Math.min(0.25, freezeTimer * 0.05)})`;
                ctx.fillRect(0, 0, W, H);
            }

            if (target && !target.locked) {
                ctx.strokeStyle = isFever ? 'rgba(0, 242, 254, .45)' : 'rgba(255,210,63,.25)';
                ctx.setLineDash([4, 8]);
                ctx.lineWidth = isFever ? 3 : 2;
                ctx.beginPath();
                ctx.moveTo(mascot.x, H - 95);
                ctx.lineTo(target.x, target.y + 18);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            for (const q of words) drawWord(q, t);

            for (const b of bullets) {
                for (let i = 0; i < b.tr.length; i++) {
                    ctx.globalAlpha = i / b.tr.length * .6;
                    ctx.fillStyle = b.col || '#ffd23f';
                    ctx.beginPath();
                    ctx.arc(b.tr[i][0], b.tr[i][1], 3 + i * .7, 0, 6.283);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                ctx.fillStyle = b.isFever ? '#00f2fe' : (b.col || '#fff');
                ctx.shadowColor = b.col || '#ffd23f';
                ctx.shadowBlur = 16;
                starPath(b.x, b.y, b.isFever ? 13 : 10, t / 70);
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
        } finally {
            ctx.restore();
        }
    }

    function loop(t) {
        if (!last) last = t;
        const dt = Math.min(.05, (t - last) / 1000 || 0);
        last = t;
        if (state === 'play') update(dt);
        else for (const s of stars) {
            s.t += dt * s.s * 3;
        }
        draw(t);
        requestAnimationFrame(loop);
    }

    /* ---------- LOGIC BOSS BATTLE ---------- */
    function triggerBossBattle() {
        bossWarningTimer = 2.5;
        const warnEl = $('boss-warning');
        if (warnEl) warnEl.classList.remove('hide');

        // Quét sạch từ thường đang rơi để dọn sàn đấu
        words.forEach(q => burst(q.x, q.y, '#ff5277', 14));
        words = [];
        target = null;

        // Còi báo động dồn dập
        [220, 293, 220, 293].forEach((f, i) => snd(f, .18, 'sawtooth', .1, 0, i * .2));

        setTimeout(() => {
            if (state !== 'play') return;
            if (warnEl) warnEl.classList.add('hide');

            const maxHp = 4 + Math.floor(level / 2);
            boss = {
                x: W / 2,
                y: 130, // Đặt thấp hơn thanh HUD để không bị che
                vx: 80,
                w: 130,
                h: 60,
                hp: maxHp,
                maxHp: maxHp,
                hitTimer: 0
            };

            const bossHud = $('boss-hud');
            if (bossHud) bossHud.classList.remove('hide');
            updateBossHpBar();
            spawnBossWord();
        }, 2500);
    }

    function updateBossHpBar() {
        const bar = $('boss-hp-bar');
        if (bar && boss) {
            const pct = Math.max(0, (boss.hp / boss.maxHp) * 100);
            bar.style.width = pct + '%';
        }
    }

    function spawnBossWord() {
        if (!boss || state !== 'play') return;
        const pool = WORDS.filter(o => o.w.length >= 4 && o.w.length <= 8);
        const o = pool[Math.random() * pool.length | 0] || WORDS[0];

        ctx.font = `700 ${fs()}px Fredoka,sans-serif`;
        const w = ctx.measureText(o.w).width + 38;

        words.push({
            w: o.w,
            vi: o.vi,
            x: boss.x,
            y: boss.y + 45, // Thả ra từ đáy phi thuyền
            pw: w,
            vy: 22 + mode * 8,
            typed: 0,
            ph: 0,
            col: '#ff4d4d',
            locked: false,
            sc: 0,
            isBossMinion: true
        });

        snd(300, .15, 'sawtooth', .08, .5);
    }

    /* ---------- LUỒNG CHÍNH VÀ LEADERBOARD ---------- */
    async function fetchTopChamp() {
        const el = $('top-champ');
        if (!el) return;

        let top1 = null;
        const pad = n => String(n).padStart(2, '0');

        if (sb) {
            try {
                const {data, error} = await sb
                    .from('leaderboard')
                    .select('name, score, created_at')
                    .order('score', {ascending: false})
                    .limit(1);

                if (!error && data && data.length > 0) {
                    const d = new Date(data[0].created_at);
                    top1 = {
                        name: data[0].name,
                        score: data[0].score,
                        timeStr: `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
                    };
                }
            } catch (e) {}
        }

        if (!top1) {
            try {
                const localTop = JSON.parse(localStorage.getItem('mtv-top5') || '[]');
                if (localTop.length > 0 && localTop[0].score > 0) {
                    top1 = {
                        name: localTop[0].name,
                        score: localTop[0].score,
                        timeStr: localTop[0].date || ''
                    };
                } else if (bestEver > 0) {
                    top1 = {
                        name: playerName || 'Người chơi',
                        score: bestEver,
                        timeStr: 'Hôm nay'
                    };
                }
            } catch (e) {}
        }

        if (top1 && top1.score > 0) {
            const timeBadge = top1.timeStr ? `<span class="champ-time">🕒 ${top1.timeStr}</span>` : '';
            el.innerHTML = `👑 Top 1: <b>${escapeHtml(top1.name || 'Người chơi')}</b> (⭐ ${top1.score}) ${timeBadge}`;
            el.classList.remove('hide');
        } else {
            el.innerHTML = `👑 Hãy là người đầu tiên lập kỷ lục!`;
            el.classList.remove('hide');
        }
    }

    const CLIENT_SALT = 'typopop_secret_salt_2026';

    async function generateScoreSignature(name, score, level, killed) {
        const payload = `${name}:${score}:${level}:${killed}:${CLIENT_SALT}`;
        const msgBuffer = new TextEncoder().encode(payload);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function saveScore(sc) {
        if (sc <= 0) return;
        lastRecordTime = Date.now();
        const player = (playerName || 'Người chơi').trim();
        const finalScore = Math.round(sc);
        const finalLevel = Math.max(1, Math.round(level));
        const finalKilled = Math.max(0, Math.round(killed));
        const topicName = typeof currentTopic !== 'undefined' ? currentTopic : 'all';

        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

        topScores.push({
            name: player,
            score: finalScore,
            lvl: finalLevel,
            mode,
            topic: topicName,
            date: dateStr,
            t: lastRecordTime
        });
        topScores.sort((a, b) => b.score - a.score);
        topScores = topScores.slice(0, 5);
        try {
            localStorage.setItem('mtv-top5', JSON.stringify(topScores));
        } catch (e) {}

        if (sb) {
            try {
                const sig = await generateScoreSignature(player, finalScore, finalLevel, finalKilled);
                await sb.from('leaderboard').insert([
                    {
                        name: player,
                        score: finalScore,
                        level: finalLevel,
                        mode: mode,
                        topic: topicName,
                        killed: finalKilled,
                        signature: sig
                    }
                ]);
            } catch (err) {}
        }
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, m => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m]));
    }

    async function renderRank() {
        const rankBox = $('rank-list');
        if (!rankBox) return;
        rankBox.innerHTML = '<p style="opacity:.8;padding:18px">Đang tải bảng xếp hạng...</p>';

        const medals = ['🥇', '🥈', '🥉', '4.', '5.'];
        const modeNames = ['Dễ', 'Vừa', 'Khó'];
        let list = [];

        let timeThreshold = null;
        const now = new Date();
        if (currentRankPeriod === 'today') {
            timeThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        } else if (currentRankPeriod === 'week') {
            const startOfWeek = new Date(now);
            const day = startOfWeek.getDay() || 7;
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(startOfWeek.getDate() - (day - 1));
            timeThreshold = startOfWeek.toISOString();
        }

        if (sb) {
            try {
                let query = sb
                    .from('leaderboard')
                    .select('*')
                    .order('score', {ascending: false})
                    .limit(5);

                if (timeThreshold) {
                    query = query.gte('created_at', timeThreshold);
                }

                if (currentRankTopic !== 'all') {
                    query = query.eq('topic', currentRankTopic);
                }

                const {data, error} = await query;

                if (!error && data && data.length > 0) {
                    const pad = n => String(n).padStart(2, '0');
                    list = data.map(item => {
                        const d = new Date(item.created_at);
                        return {
                            name: item.name,
                            score: item.score,
                            lvl: item.level,
                            mode: item.mode,
                            topic: item.topic,
                            date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`,
                            isCurrent: item.name === playerName && item.score === Math.round(score)
                        };
                    });
                }
            } catch (err) {}
        }

        if (!list.length && typeof topScores !== 'undefined') {
            list = topScores.filter(r => {
                if (currentRankTopic !== 'all' && r.topic && r.topic !== currentRankTopic) return false;
                return true;
            }).slice(0, 5).map(r => ({
                name: r.name,
                score: r.score,
                lvl: r.lvl,
                mode: r.mode,
                date: r.date,
                isCurrent: r.t === lastRecordTime
            }));
        }

        if (!list.length) {
            rankBox.innerHTML = '<p style="opacity:.8;padding:24px 0">Chưa có kỷ lục nào trong mục này.<br>Hãy là người đầu tiên ghi danh!</p>';
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
        if ($(fromScreen)) $(fromScreen).classList.add('hide');
        if ($('rank')) $('rank').classList.remove('hide');
        snd(600, .08, 'triangle', .06);
    }

    function promptPlayerName() {
        state = 'name';
        if ($('start')) $('start').classList.add('hide');
        if ($('name-err')) $('name-err').classList.add('hide');
        if ($('name-modal')) $('name-modal').classList.remove('hide');
        const inp = $('player-name');
        if (inp) {
            inp.value = playerName;
            setTimeout(() => {
                inp.focus();
                inp.select();
            }, 50);
        }
        snd(520, .08, 'triangle', .06);
    }

    function confirmNameAndPlay() {
        const inp = $('player-name');
        const val = inp ? inp.value.trim() : '';
        if (!val) {
            if ($('name-err')) $('name-err').classList.remove('hide');
            snd(180, .18, 'sawtooth', .06, .6);
            if (inp) inp.focus();
            return;
        }
        playerName = val;
        try {
            localStorage.setItem('mtv-name', playerName);
        } catch (e) {}
        if ($('name-modal')) $('name-modal').classList.add('hide');
        begin();
    }

    function resume() {
        state = 'play';
        if ($('start')) $('start').classList.add('hide');
        if ($('modes')) $('modes').style.display = '';
        if ($('btn-rank-start')) $('btn-rank-start').style.display = '';
        last = performance.now();
        refocus();
    }

    function begin() {
        if ($('play') && !isRevengeMode) {
            isRevengeMode = false;
        }
        resize();
        reset();
        tipTimer = 2;
        const tipEl = $('game-tip');
        if (tipEl) {
            tipEl.classList.remove('hide');
            tipEl.classList.add('show');
            tipEl.innerHTML = '💡 ' + GAME_TIPS[0];
        }
        state = 'play';
        last = performance.now();

        if (!muted && 'speechSynthesis' in window) {
            try {
                const u = new SpeechSynthesisUtterance('');
                u.volume = 0;
                speechSynthesis.speak(u);
            } catch (e) {}
        }
        if ($('play')) $('play').textContent = 'Play';
        if ($('modes')) $('modes').style.display = '';
        if ($('btn-rank-start')) $('btn-rank-start').style.display = '';
        if ($('start')) $('start').classList.add('hide');
        if ($('name-modal')) $('name-modal').classList.add('hide');
        if ($('over')) $('over').classList.add('hide');
        if ($('rank')) $('rank').classList.add('hide');

        const notifyEl = $('top-notify');
        if (notifyEl) {
            notifyEl.classList.add('hide');
            notifyEl.innerHTML = '';
        }

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

    async function end() {
        state = 'over';
        const finalScore = Math.round(score);
        const tipEl = $('game-tip');
        if (tipEl) tipEl.classList.add('hide');
        const best = finalScore > bestEver;
        if (best) {
            bestEver = finalScore;
            try {
                localStorage.setItem('mtv-best', bestEver);
            } catch (e) {}
        }

        const notifyEl = $('top-notify');
        if (notifyEl) {
            notifyEl.classList.add('hide');
            notifyEl.innerHTML = '';
        }

        // Cộng dồn số từ hạ được trong ván vào quỹ mua Skin
        totalKilledBank += killed;
        saveCosmeticsData();
        await saveScore(finalScore);
        syncSettingsUI();

        if ($('big')) $('big').textContent = finalScore;
        const acc = hits + misses ? Math.round(hits / (hits + misses) * 100) : 100;
        if ($('stats')) $('stats').textContent = `${playerName || 'Người chơi'} hạ ${killed} từ · Chính xác ${acc}%`;
        if ($('miss')) $('miss').innerHTML = missed.size ? '<b>Từ cần ôn:</b> ' + [...missed].slice(0, 6).map(([w, v]) => w + ' = ' + v).join(' · ') : 'Không bỏ sót từ nào, quá đỉnh!';

        checkTopRank(finalScore);

        [523, 440, 349, 262].forEach((f, i) => snd(f, .25, 'triangle', .07, 0, i * .15));
        setTimeout(() => {
            if ($('over')) $('over').classList.remove('hide');
        }, 500);
    }

    async function checkTopRank(currentScore) {
        const notifyEl = $('top-notify');
        if (!notifyEl) return;

        notifyEl.classList.add('hide');
        notifyEl.innerHTML = '';

        if (currentScore <= 0) return;

        let rankPosition = null;

        if (sb) {
            try {
                const {data, error} = await sb
                    .from('leaderboard')
                    .select('score')
                    .order('score', {ascending: false})
                    .limit(5);

                if (!error && data) {
                    const higherCount = data.filter(item => item.score > currentScore).length;
                    if (higherCount < 5) {
                        rankPosition = higherCount + 1;
                    }
                }
            } catch (e) {}
        }

        if (!rankPosition && typeof topScores !== 'undefined') {
            try {
                const localTop = JSON.parse(localStorage.getItem('mtv-top5') || '[]');
                const higherCount = localTop.filter(item => item.score > currentScore).length;
                if (higherCount < 5 && localTop.length > 0) {
                    rankPosition = higherCount + 1;
                }
            } catch (e) {}
        }

        if (rankPosition && rankPosition <= 5) {
            const trophy = rankPosition === 1 ? '👑' : '🏆';
            notifyEl.innerHTML = `${trophy} XUẤT SẮC! BẠN ĐÃ ĐẠT TOP ${rankPosition} TOÀN CẦU! ${trophy}`;
            notifyEl.classList.remove('hide');

            [523, 659, 784, 1047].forEach((f, i) => snd(f * 1.2, 0.2, 'triangle', 0.08, 0, i * 0.08));
            burst(W / 2, 80, '#ffd23f', 50);
        }
    }

    // Gắn sự kiện các nút
    if ($('play')) {
        $('play').onclick = () => {
            if (state === 'paused') {
                resume();
            } else if (playerName) {
                begin();
            } else {
                promptPlayerName();
            }
        };
    }

    if ($('confirm-name')) $('confirm-name').onclick = confirmNameAndPlay;
    if ($('cancel-name')) $('cancel-name').onclick = () => {
        state = 'menu';
        if ($('name-modal')) $('name-modal').classList.add('hide');
        if ($('start')) $('start').classList.remove('hide');
        snd(480, .08, 'triangle', .06);
    };
    if ($('player-name')) $('player-name').addEventListener('input', () => {
        if ($('name-err')) $('name-err').classList.add('hide');
    });

    if ($('again')) $('again').onclick = begin;

    if ($('btn-rank-start')) $('btn-rank-start').onclick = () => openRank('start');
    if ($('btn-rank-over')) $('btn-rank-over').onclick = () => openRank('over');
    if ($('close-rank')) $('close-rank').onclick = () => {
        if ($('rank')) $('rank').classList.add('hide');
        if ($(rankFrom)) $(rankFrom).classList.remove('hide');
        snd(480, .08, 'triangle', .06);
    };

    const btnHome = $('btn-home');
    if (btnHome) {
        btnHome.onclick = () => {
            isRevengeMode = false;
            state = 'menu';
            if ($('over')) $('over').classList.add('hide');
            if ($('start')) $('start').classList.remove('hide');
            if ($('modes')) $('modes').style.display = '';
            if ($('btn-rank-start')) $('btn-rank-start').style.display = '';
            if ($('play')) $('play').textContent = 'Play';
            syncSettingsUI();
            fetchTopChamp();
            snd(480, .08, 'triangle', .06);
        };
    }

    document.querySelectorAll('#modes button').forEach(b => b.onclick = () => {
        if (state === 'paused') return;
        mode = +b.dataset.m;
        syncSettingsUI();
    });

    document.querySelectorAll('#topics button').forEach(b => b.onclick = () => {
        if (state === 'paused') return;
        currentTopic = b.dataset.topic;
        WORDS = WORD_PACKS[currentTopic] || WORD_PACKS.all;
        syncSettingsUI();
        snd(500, .06, 'triangle', .05);
    });

    document.querySelectorAll('#over-topics button').forEach(b => b.onclick = () => {
        currentTopic = b.dataset.topic;
        WORDS = WORD_PACKS[currentTopic] || WORD_PACKS.all;
        syncSettingsUI();
        snd(500, .06, 'triangle', .05);
    });

    document.querySelectorAll('#over-modes button').forEach(b => b.onclick = () => {
        mode = +b.dataset.m;
        syncSettingsUI();
        snd(500, .06, 'triangle', .05);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && state === 'play') {
            state = 'paused';
            if ($('modes')) $('modes').style.display = 'none';
            if ($('btn-rank-start')) $('btn-rank-start').style.display = 'none';
            if ($('play')) $('play').textContent = 'Chơi tiếp';
            if ($('start')) $('start').classList.remove('hide');
        }
    });

    function initRankTabs() {
        const timeBtns = document.querySelectorAll('#rank-time-tabs button');
        timeBtns.forEach(btn => {
            btn.onclick = () => {
                timeBtns.forEach(b => b.classList.remove('on'));
                btn.classList.add('on');
                currentRankPeriod = btn.dataset.period;
                renderRank();
                snd(520, .06, 'triangle', .05);
            };
        });

        const topicBtns = document.querySelectorAll('#rank-topic-tabs button');
        topicBtns.forEach(btn => {
            btn.onclick = () => {
                topicBtns.forEach(b => b.classList.remove('on'));
                btn.classList.add('on');
                currentRankTopic = btn.dataset.topic;
                renderRank();
                snd(520, .06, 'triangle', .05);
            };
        });
    }
    initRankTabs();

    addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            if (state === 'menu') {
                if (playerName) begin();
                else promptPlayerName();
            } else if (state === 'name') {
                confirmNameAndPlay();
            } else if (state === 'over') {
                begin();
            } else if (state === 'paused') {
                resume();
            }
        }
    });

    function renderNotebook() {
        const box = $('notebook-list');
        const revengeBtn = $('btn-revenge');
        if (!box) return;

        if (reviewNotebook.size === 0) {
            box.innerHTML = '<p style="opacity:.8;padding:24px 0">Sổ tay trống!<br>Bạn chưa bỏ sót từ nào hoặc đã chinh phục hết.</p>';
            if (revengeBtn) revengeBtn.style.display = 'none';
            return;
        }

        if (revengeBtn) revengeBtn.style.display = '';

        box.innerHTML = [...reviewNotebook.entries()].map(([w, data]) => `
        <div class="nb-item">
            <div class="nb-word">
                <span>${escapeHtml(w)}</span>
                <span class="nb-vi">${escapeHtml(data.vi)}</span>
            </div>
            <div class="nb-actions">
                <span class="nb-count">Hỏng ${data.count}x</span>
                <button class="nb-btn-speak" data-word="${escapeHtml(w)}" title="Phát âm">🔊</button>
            </div>
        </div>
    `).join('');

        box.querySelectorAll('.nb-btn-speak').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                speak(btn.dataset.word);
            };
        });
    }

    function openNotebook(fromScreen) {
        notebookFromScreen = fromScreen;
        renderNotebook();
        if ($(fromScreen)) $(fromScreen).classList.add('hide');
        if ($('notebook-modal')) $('notebook-modal').classList.remove('hide');
        snd(560, .08, 'triangle', .06);
    }

    const btnNbStart = $('btn-notebook-start');
    if (btnNbStart) btnNbStart.onclick = () => openNotebook('start');

    const btnNbOver = $('btn-notebook-over');
    if (btnNbOver) btnNbOver.onclick = () => openNotebook('over');

    const closeNb = $('close-notebook');
    if (closeNb) {
        closeNb.onclick = () => {
            if ($('notebook-modal')) $('notebook-modal').classList.add('hide');
            if ($(notebookFromScreen)) $(notebookFromScreen).classList.remove('hide');
            snd(480, .08, 'triangle', .06);
        };
    }

    const clearNb = $('btn-clear-notebook');
    if (clearNb) {
        clearNb.onclick = () => {
            if (confirm('Bạn có chắc muốn xoá hết từ trong sổ tay ôn tập?')) {
                reviewNotebook.clear();
                saveNotebookToLocal();
                renderNotebook();
                snd(200, .15, 'sawtooth', .06);
            }
        };
    }

    const btnRevenge = $('btn-revenge');
    if (btnRevenge) {
        btnRevenge.onclick = () => {
            if (reviewNotebook.size === 0) return;
            isRevengeMode = true;
            if ($('notebook-modal')) $('notebook-modal').classList.add('hide');
            begin();
            say('⚔️ REVENGE MODE!', W / 2, H * .4, '#ffd23f', 32);
            [440, 554, 659, 880].forEach((f, i) => snd(f, .18, 'sawtooth', .08, 0, i * .08));
        };
    }

    function renderShop() {
        const grid = $('shop-skin-grid');
        const coinsEl = $('shop-coins-display');
        if (coinsEl) coinsEl.textContent = `🪙 Số từ tích lũy: ${totalKilledBank}`;
        if (!grid) return;

        grid.innerHTML = SKINS_DATA.map(skin => {
            const isUnlocked = unlockedSkins.includes(skin.id);
            const isEquipped = currentSkin === skin.id;

            let actionBtn = '';
            if (isEquipped) {
                actionBtn = `<button class="btn-skin-action equipped">Đang dùng</button>`;
            } else if (isUnlocked) {
                actionBtn = `<button class="btn-skin-action equip" data-id="${skin.id}">Trang bị</button>`;
            } else {
                const canBuy = totalKilledBank >= skin.cost;
                actionBtn = `<button class="btn-skin-action buy" data-id="${skin.id}" data-cost="${skin.cost}" ${canBuy ? '' : 'disabled style="opacity:0.6"'}>
                    Mua (${skin.cost} 🪙)
                </button>`;
            }

            return `
                <div class="skin-card ${isEquipped ? 'equipped' : ''}">
                    <div class="skin-preview">${skin.icon}</div>
                    <div class="skin-title">${skin.name}</div>
                    <div class="skin-desc">${skin.desc}</div>
                    ${actionBtn}
                </div>
            `;
        }).join('');

        // Bắt sự kiện Trang bị
        grid.querySelectorAll('.btn-skin-action.equip').forEach(btn => {
            btn.onclick = () => {
                currentSkin = btn.dataset.id;
                saveCosmeticsData();
                renderShop();
                snd(640, .1, 'triangle', .08);
            };
        });

        // Bắt sự kiện Mua
        grid.querySelectorAll('.btn-skin-action.buy').forEach(btn => {
            btn.onclick = () => {
                const cost = +btn.dataset.cost;
                const id = btn.dataset.id;
                if (totalKilledBank >= cost && !unlockedSkins.includes(id)) {
                    totalKilledBank -= cost;
                    unlockedSkins.push(id);
                    currentSkin = id;
                    saveCosmeticsData();
                    renderShop();
                    snd(784, .18, 'triangle', .1);
                    burst(W / 2, H / 2, '#ffd23f', 45);
                }
            };
        });
    }

    const btnShopStart = $('btn-shop-start');
    if (btnShopStart) {
        btnShopStart.onclick = (e) => {
            if (e) e.stopPropagation();
            renderShop();
            if ($('start')) $('start').classList.add('hide');
            if ($('shop-modal')) $('shop-modal').classList.remove('hide');
            snd(520, .08, 'triangle', .06);
        };
    }

    const closeShop = $('close-shop');
    if (closeShop) {
        closeShop.onclick = (e) => {
            if (e) e.stopPropagation();
            if ($('shop-modal')) $('shop-modal').classList.add('hide');
            if ($('start')) $('start').classList.remove('hide');
            snd(480, .08, 'triangle', .06);
        };
    }

    // KHỞI ĐỘNG
    resize();
    initStars();
    reset();
    try {
        fetchTopChamp();
    } catch (e) {}

    requestAnimationFrame(loop);

    if (document.fonts && document.fonts.load) {
        document.fonts.load('700 24px Fredoka').catch(() => {});
    }
})();