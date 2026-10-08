// 宾客名单（礼金只用于花瓣大小，不展示）
const guests = [
    { name: '徐四斌', amount: 1000 },
    { name: '王正波', amount: 1000 },
    { name: '郎晓炜', amount: 500 },
    { name: '蔡新生', amount: 600 },
    { name: '王秋实', amount: 1000 },
    { name: '周千湘', amount: 1000 },
    { name: '彭胜男', amount: 600 },
    { name: '涂允灿', amount: 600 },
    { name: '吴莎莎', amount: 600 },
    { name: '施雅文', amount: 600 },
    { name: '鲍雨丽', amount: 666 },
    { name: '卢金鹏', amount: 600 },
    { name: '张驰', amount: 200 },
    { name: '王洪宇', amount: 600 },
    { name: '夏永进', amount: 600 },
    { name: '尤鑫', amount: 600 },
    { name: '刘文豪', amount: 1000 },
    { name: '厉宝强', amount: 420 },
    { name: '厉根生', amount: 420 }
];

const minGift = Math.min(...guests.map(g => g.amount));
const maxGift = Math.max(...guests.map(g => g.amount));
const minPetalScale = 0.9;
const maxPetalScale = 3.2;

let remainingGuests = [];
let blessings = [];
let activePetal = null;
let petalFallTimer = null;
let waitingForCatch = false;

function shuffleGuests() {
    remainingGuests = [...guests];
    for (let i = remainingGuests.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingGuests[i], remainingGuests[j]] = [remainingGuests[j], remainingGuests[i]];
    }
}

function pickNextGuest() {
    if (remainingGuests.length === 0) {
        shuffleGuests();
    }
    return remainingGuests.pop();
}

function giftToScale(amount) {
    if (maxGift === minGift) return (minPetalScale + maxPetalScale) / 2;
    const t = (amount - minGift) / (maxGift - minGift);
    return minPetalScale + t * (maxPetalScale - minPetalScale);
}

const TOTAL_FRAMES = 61; // frame_0000.png ~ frame_0060.png

function updateLoadingProgress(loaded, total) {
    const percent = Math.min(100, Math.round((loaded / total) * 100));
    const fill = document.getElementById('loadingBarFill');
    const label = document.getElementById('loadingPercent');
    if (fill) fill.style.width = percent + '%';
    if (label) label.textContent = percent + '%';
}

function preloadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

async function preloadFrames(onProgress) {
    let loaded = 0;
    const tasks = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const src = `frames/frame_${String(i).padStart(4, '0')}.png`;
        tasks.push(
            preloadImage(src).then(() => {
                loaded++;
                onProgress(loaded, TOTAL_FRAMES);
            })
        );
    }

    await Promise.all(tasks);
}

async function preloadFonts() {
    if (!document.fonts || !document.fonts.load) {
        return;
    }

    try {
        await Promise.all([
            document.fonts.load('16px "Pixeloid Sans"'),
            document.fonts.load('bold 16px "Pixeloid Sans"'),
            document.fonts.load('16px "Press Start 2P"'),
            document.fonts.ready
        ]);
    } catch (e) {
        // 字体失败也不阻塞上线体验
        console.warn('字体加载未完全成功，继续进入页面', e);
    }
}

async function prepareResources() {
    // 帧图占进度 0–90%，字体占 90–100%
    updateLoadingProgress(0, 100);

    await preloadFrames((loaded, total) => {
        const mapped = Math.round((loaded / total) * 90);
        updateLoadingProgress(mapped, 100);
    });

    await preloadFonts();
    updateLoadingProgress(100, 100);
}

function hideLoadingScreen() {
    const loading = document.getElementById('loadingScreen');
    if (!loading) return;

    loading.classList.add('fade-out');
    setTimeout(() => {
        loading.remove();
    }, 450);
}

// 资源就绪后进入答谢页
function startThankYouPage() {
    document.getElementById('app')?.removeAttribute('hidden');
    document.getElementById('petals')?.removeAttribute('hidden');
    document.getElementById('character')?.removeAttribute('hidden');

    shuffleGuests();
    initCharacterControl();
    spawnNextPetal();
    hideLoadingScreen();
}

// 一次只落一片；接到后再落下一片
function spawnNextPetal(guestOverride) {
    if (waitingForCatch && !guestOverride) return;

    const container = document.getElementById('petals');
    if (!container) return;

    if (petalFallTimer) {
        clearTimeout(petalFallTimer);
        petalFallTimer = null;
    }
    if (activePetal && activePetal.parentNode) {
        activePetal.remove();
    }

    const guest = guestOverride || pickNextGuest();
    const petal = document.createElement('div');
    const petalType = Math.floor(Math.random() * 5) + 1;
    petal.className = `petal type${petalType}`;
    petal.dataset.guestName = guest.name;
    petal.dataset.guestAmount = String(guest.amount);

    petal.style.left = Math.random() * 80 + 10 + '%';

    const duration = Math.random() * 3 + 7; // 7-10秒，单片更易接
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = '0s';

    const animations = ['fall', 'fall2', 'fall3', 'fall4', 'fall5'];
    petal.style.animationName = animations[Math.floor(Math.random() * animations.length)];
    petal.style.animationTimingFunction = 'linear';

    const scale = giftToScale(guest.amount);
    petal.style.setProperty('--petal-scale', scale.toFixed(2));

    container.appendChild(petal);
    activePetal = petal;
    waitingForCatch = true;

    // 未接到则同一人再落一次，直到接到才换下一位
    petalFallTimer = setTimeout(() => {
        if (activePetal === petal && petal.parentNode) {
            petal.remove();
            activePetal = null;
            waitingForCatch = false;
            setTimeout(() => spawnNextPetal(guest), 600);
        }
    }, duration * 1000);
}

// 等动画帧与字体全部就绪后再开始落花瓣
window.addEventListener('DOMContentLoaded', async () => {
    document.body.style.opacity = '1';
    try {
        await prepareResources();
    } catch (e) {
        console.warn('资源预加载出错，仍进入页面', e);
        updateLoadingProgress(100, 100);
    }
    // 稍留一点时间让 100% 可见
    setTimeout(startThankYouPage, 280);
});

// ==================== 衷心感谢 · 名单 ====================

function addGuestToBoard(name) {
    const list = document.getElementById('guestList');
    const hint = document.getElementById('guestHint');
    if (!list) return;

    if (hint) hint.hidden = true;

    const item = document.createElement('span');
    item.className = 'guest-name';
    item.textContent = name;
    list.insertBefore(item, list.firstChild);

    blessings.push(name);
}

// ==================== 角色控制系统 ====================

let characterX = 50;
let score = 0;
let targetX = 50;
let currentFrame = 0;
let lastX = 50;

const idleFrame = 0;
const basketDownEnd = 15;
const basketUpStart = 15;
const basketUpEnd = 19;
const runStartFrame = 20;
const runEndFrame = 60;

let characterState = 'idle';
let hasNearbyPetal = false;

const moveSpeed = 0.8;

function initCharacterControl() {
    const character = document.getElementById('character');
    if (!character) return;

    const scoreBoard = document.createElement('div');
    scoreBoard.className = 'score-board';
    scoreBoard.innerHTML = `
        <div class="score-label">接到花瓣</div>
        <div class="score-value" id="scoreValue">0</div>
    `;
    document.body.appendChild(scoreBoard);

    setInterval(findNearestPetal, 50);
    setInterval(moveToTarget, 30);
    setInterval(updateCharacterAnimation, 50);
    setInterval(checkPetalCollision, 100);
}

function updateCharacterAnimation() {
    const character = document.getElementById('character');
    const sprite = document.getElementById('characterSprite');
    if (!sprite) return;

    const movementDelta = characterX - lastX;
    const isMoving = Math.abs(movementDelta) > 0.5;

    if (isMoving) {
        if (movementDelta < 0) {
            character.classList.add('moving-left');
        } else if (movementDelta > 0) {
            character.classList.remove('moving-left');
        }
    }

    switch (characterState) {
        case 'idle':
            currentFrame = idleFrame;
            if (hasNearbyPetal && !isMoving) {
                characterState = 'puttingDown';
                currentFrame = basketDownEnd;
            } else if (isMoving) {
                characterState = 'pickingUp';
                currentFrame = basketUpStart;
            }
            break;

        case 'puttingDown':
            if (currentFrame > idleFrame) {
                currentFrame--;
            } else {
                characterState = 'waiting';
            }

            if (isMoving) {
                characterState = 'pickingUp';
                currentFrame = Math.max(currentFrame, basketUpStart);
            }
            break;

        case 'waiting':
            currentFrame = idleFrame;

            if (isMoving || !hasNearbyPetal) {
                characterState = 'pickingUp';
                currentFrame = basketUpStart;
            }
            break;

        case 'pickingUp':
            if (currentFrame < basketUpEnd) {
                currentFrame++;
            } else {
                characterState = 'running';
                currentFrame = runStartFrame;
            }
            break;

        case 'running':
            currentFrame++;
            if (currentFrame > runEndFrame) {
                currentFrame = runStartFrame;
            }

            if (!isMoving && hasNearbyPetal) {
                characterState = 'puttingDown';
                currentFrame = basketDownEnd;
            } else if (!isMoving && !hasNearbyPetal) {
                characterState = 'idle';
                currentFrame = idleFrame;
            }
            break;
    }

    sprite.src = `frames/frame_${String(currentFrame).padStart(4, '0')}.png`;
    lastX = characterX;
}

function findNearestPetal() {
    const character = document.getElementById('character');
    if (!character) return;

    const characterRect = character.getBoundingClientRect();
    const characterCenterX = characterRect.left + characterRect.width / 2;
    const petals = document.querySelectorAll('.petal');

    let nearestPetal = null;
    let minDistance = Infinity;
    hasNearbyPetal = false;

    petals.forEach(petal => {
        const petalRect = petal.getBoundingClientRect();

        if (petalRect.top > window.innerHeight * 0.3) {
            const petalCenterX = petalRect.left + petalRect.width / 2;

            const horizontalDist = Math.abs(petalCenterX - characterCenterX);
            const verticalDist = window.innerHeight - petalRect.bottom;

            const priority = horizontalDist + verticalDist * 0.5;

            if (priority < minDistance) {
                minDistance = priority;
                nearestPetal = petal;
            }

            if (petalRect.top > window.innerHeight * 0.4) {
                hasNearbyPetal = true;
            }
        }
    });

    if (nearestPetal) {
        const petalRect = nearestPetal.getBoundingClientRect();
        const petalCenterX = petalRect.left + petalRect.width / 2;
        targetX = (petalCenterX / window.innerWidth) * 100;
        targetX = Math.max(5, Math.min(95, targetX));
    }
}

function moveToTarget() {
    const character = document.getElementById('character');
    if (!character) return;

    const distance = targetX - characterX;

    if (Math.abs(distance) > 0.5) {
        if (distance > 0) {
            characterX += Math.min(moveSpeed, distance);
        } else {
            characterX += Math.max(-moveSpeed, distance);
        }
        character.style.left = characterX + '%';
    }
}

function checkPetalCollision() {
    const character = document.getElementById('character');
    if (!character) return;

    const characterRect = character.getBoundingClientRect();

    const actualCharacterLeft = characterRect.left + 100;
    const actualCharacterRight = characterRect.right - 100;
    const actualCharacterTop = characterRect.top + 100;
    const actualCharacterBottom = characterRect.bottom - 100;

    const petals = document.querySelectorAll('.petal');
    petals.forEach(petal => {
        const petalRect = petal.getBoundingClientRect();
        const petalCenterX = petalRect.left + petalRect.width / 2;
        const petalCenterY = petalRect.top + petalRect.height / 2;

        if (
            petalCenterY >= actualCharacterTop - 10 &&
            petalCenterY <= actualCharacterBottom + 10 &&
            petalCenterX >= actualCharacterLeft - 10 &&
            petalCenterX <= actualCharacterRight + 10
        ) {
            catchPetal(petal, petalRect);
        }
    });
}

function catchPetal(petal, petalRect) {
    if (petal !== activePetal) return;

    if (petalFallTimer) {
        clearTimeout(petalFallTimer);
        petalFallTimer = null;
    }

    const guestName = petal.dataset.guestName || '宾客';
    petal.remove();
    activePetal = null;
    waitingForCatch = false;

    score++;
    const scoreValue = document.getElementById('scoreValue');
    if (scoreValue) {
        scoreValue.textContent = score;
    }

    // 名单只显示姓名，不显示礼金
    addGuestToBoard(guestName);

    if (characterState === 'waiting' || characterState === 'puttingDown') {
        characterState = 'pickingUp';
        currentFrame = Math.max(currentFrame, basketUpStart);
    }

    const effect = document.createElement('div');
    effect.className = 'catch-effect';
    effect.textContent = `🌸 ${guestName}`;
    effect.style.left = petalRect.left + 'px';
    effect.style.top = petalRect.top + 'px';
    document.body.appendChild(effect);

    setTimeout(() => effect.remove(), 1000);

    // 接到后稍等再落下一片
    setTimeout(() => spawnNextPetal(), 800);
}
