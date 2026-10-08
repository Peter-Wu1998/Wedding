// 宾客名单（礼金只用于花瓣大小，不展示）
const guests = [
    { name: '徐四斌&严可', amount: 1000 },
    { name: '王正波', amount: 1000 },
    { name: '郎晓炜', amount: 500 },
    { name: '叶茂&鲍雨丽', amount: 666 },
    { name: '卢金鹏', amount: 600 },
    { name: '张驰', amount: 200 },
    { name: '王洪宇', amount: 600 },
    { name: '王宇', amount: 600 },
    { name: '夏永进', amount: 600 },
    { name: '尤鑫', amount: 600 },
    { name: '刘文豪', amount: 1000 },
    { name: '蔡新生', amount: 600 },
    { name: '王秋实', amount: 1000 },
    { name: '周千湘', amount: 1000 },
    { name: '彭胜男&黄格格', amount: 600 },
    { name: '涂允灿', amount: 600 },
    { name: '吴莎莎', amount: 600 },
    { name: '施雅雯', amount: 600 },
    { name: '伍爱华', amount: 2000 },
    { name: '伍良友', amount: 400 },
    { name: '伍大平', amount: 1600 },
    { name: '张会珍', amount: 800 },
    { name: '张赛', amount: 800 },
    { name: '周云春', amount: 2000 },
    { name: '周云群', amount: 2000 },
    { name: '周万春', amount: 2000 },
    { name: '周元景', amount: 2000 },
    { name: '夏文洁', amount: 1000 },
    { name: '厉海峰', amount: 800 },
    { name: '厉慧', amount: 800 },
    { name: '厉宽余', amount: 800 },
    { name: '厉爱月', amount: 800 },
    { name: '厉保', amount: 1800 },
    { name: '厉凤丹', amount: 800 },
    { name: '厉宽四', amount: 1000 },
    { name: '厉丁香', amount: 800 },
    { name: '朱丽', amount: 600 },
    { name: '朱江', amount: 600 },
    { name: '朱赛', amount: 800 },
    { name: '朱守武', amount: 800 },
    { name: '厉玉生', amount: 666 },
    { name: '厉宝强', amount: 420 },
    { name: '厉根生', amount: 420 },
    { name: '张业云', amount: 420 },
    { name: '厉启冲', amount: 420 },
    { name: '厉启华', amount: 420 },
    { name: '厉启干', amount: 420 },
    { name: '厉启元', amount: 420 },
    { name: '厉小青', amount: 420 },
    { name: '厉宽银', amount: 420 },
    { name: '厉启银', amount: 420 },
    { name: '费自立', amount: 600 },
    { name: '张二照', amount: 600 },
    { name: '厉广州', amount: 600 },
    { name: '周元红', amount: 800 },
    { name: '周元正', amount: 600 },
    { name: '吴学礼', amount: 800 },
    { name: '吴学广', amount: 600 },
    { name: '吴大伟', amount: 420 },
    { name: '周元亮', amount: 800 },
    { name: '何豹', amount: 800 },
    { name: '张照生', amount: 1000 },
    { name: '张照龙', amount: 600 },
    { name: '汪院生', amount: 600 }
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
let listFinished = false;

function shuffleGuests() {
    remainingGuests = [...guests];
    for (let i = remainingGuests.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingGuests[i], remainingGuests[j]] = [remainingGuests[j], remainingGuests[i]];
    }
}

function pickNextGuest() {
    if (remainingGuests.length === 0) {
        return null;
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

async function prepareResources() {
    updateLoadingProgress(0, 100);

    await preloadFrames((loaded, total) => {
        updateLoadingProgress(loaded, total);
    });

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

// 一次只落一片；接到后再落下一片；名单接完后停止
function spawnNextPetal(guestOverride) {
    if (listFinished) return;
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
    if (!guest) {
        listFinished = true;
        waitingForCatch = false;
        activePetal = null;
        return;
    }

    const petal = document.createElement('div');
    const petalType = Math.floor(Math.random() * 5) + 1;
    petal.className = `petal type${petalType}`;
    petal.dataset.guestName = guest.name;
    petal.dataset.guestAmount = String(guest.amount);

    // 左右留边，方便角色赶到
    petal.style.left = Math.random() * 70 + 15 + '%';

    // 手机稍慢一点，提高接住率
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const duration = isMobile
        ? Math.random() * 1.5 + 5.5 // 5.5-7秒
        : Math.random() * 2 + 4.5;  // 4.5-6.5秒
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

function flyGuestTagToBoard(guestName, petalRect) {
    const list = document.getElementById('guestList');
    if (!list) return;

    // 先在名单里占位，拿到真正落点（不瞬移刷新）
    const slot = document.createElement('span');
    slot.className = 'guest-name is-slot';
    slot.textContent = guestName;
    list.insertBefore(slot, list.firstChild);
    blessings.push(guestName);

    const slotRect = slot.getBoundingClientRect();
    const endX = slotRect.left + slotRect.width / 2;
    const endY = slotRect.top + slotRect.height / 2;

    const effect = document.createElement('div');
    effect.className = 'catch-effect';
    effect.textContent = guestName;
    effect.style.left = (petalRect.left + petalRect.width / 2) + 'px';
    effect.style.top = (petalRect.top + petalRect.height / 2) + 'px';
    document.body.appendChild(effect);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            effect.style.left = endX + 'px';
            effect.style.top = endY + 'px';
            effect.classList.add('is-flying');
        });
    });

    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        effect.remove();
        slot.classList.remove('is-slot');
    };

    effect.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'left' || e.propertyName === 'top') {
            finish();
        }
    });
    setTimeout(finish, 850);
}

// ==================== 角色控制系统 ====================

let characterX = 50;
let targetX = 50;
let currentFrame = 0;

const idleFrame = 0;
const basketDownEnd = 15;
const basketUpStart = 15;
const basketUpEnd = 19;
const runStartFrame = 20;
const runEndFrame = 60;

let characterState = 'idle';
let hasNearbyPetal = false;

const isMobileView = () => window.matchMedia('(max-width: 768px)').matches;
// 手机提高追赶速度，减少接不到
const moveSpeed = () => (isMobileView() ? 1.8 : 1.2);

function initCharacterControl() {
    const character = document.getElementById('character');
    if (!character) return;

    setInterval(findNearestPetal, 40);
    setInterval(moveToTarget, 24);
    setInterval(updateCharacterAnimation, 50);
    setInterval(checkPetalCollision, 40);
}

function updateCharacterAnimation() {
    const character = document.getElementById('character');
    const sprite = document.getElementById('characterSprite');
    if (!sprite) return;

    // 用是否还在追目标判断，避免接住后抖动触发“走一步”
    const isMoving = Math.abs(targetX - characterX) > 0.8;

    if (isMoving) {
        if (targetX < characterX) {
            character.classList.add('moving-left');
        } else {
            character.classList.remove('moving-left');
        }
    }

    switch (characterState) {
        case 'idle':
            currentFrame = idleFrame;
            // 有花瓣且已到位：放下篮子等待
            if (hasNearbyPetal && !isMoving) {
                characterState = 'puttingDown';
                currentFrame = basketDownEnd;
            } else if (isMoving) {
                // 需要追花瓣：先举起篮子再跑
                characterState = 'pickingUp';
                currentFrame = basketUpStart;
            }
            break;

        case 'puttingDown':
            if (currentFrame > idleFrame) {
                currentFrame--;
            } else {
                characterState = hasNearbyPetal ? 'waiting' : 'idle';
            }

            // 放下中途又要跑了
            if (isMoving) {
                characterState = 'pickingUp';
                currentFrame = Math.max(currentFrame, basketUpStart);
            }
            break;

        case 'waiting':
            // 篮子已放下，原地等花瓣
            currentFrame = idleFrame;

            if (isMoving) {
                characterState = 'pickingUp';
                currentFrame = basketUpStart;
            } else if (!hasNearbyPetal) {
                // 花瓣已接到/消失：安静站着，不要举篮假跑
                characterState = 'idle';
            }
            break;

        case 'pickingUp':
            if (currentFrame < basketUpEnd) {
                currentFrame++;
            } else if (isMoving) {
                characterState = 'running';
                currentFrame = runStartFrame;
            } else {
                // 举完篮但不用跑了（例如刚接到、下片还没落）：回到待机
                characterState = 'idle';
                currentFrame = idleFrame;
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
}

function findNearestPetal() {
    const character = document.getElementById('character');
    if (!character || listFinished) return;

    const characterRect = character.getBoundingClientRect();
    const characterCenterX = characterRect.left + characterRect.width / 2;
    const petals = document.querySelectorAll('.petal');

    let nearestPetal = null;
    let minDistance = Infinity;
    hasNearbyPetal = false;

    // 更早开始追，给角色更多横向移动时间
    const seekFrom = window.innerHeight * 0.12;
    const nearFrom = window.innerHeight * 0.28;

    petals.forEach(petal => {
        const petalRect = petal.getBoundingClientRect();

        if (petalRect.top > seekFrom) {
            const petalCenterX = petalRect.left + petalRect.width / 2;

            const horizontalDist = Math.abs(petalCenterX - characterCenterX);
            const verticalDist = window.innerHeight - petalRect.bottom;

            const priority = horizontalDist + verticalDist * 0.35;

            if (priority < minDistance) {
                minDistance = priority;
                nearestPetal = petal;
            }

            if (petalRect.top > nearFrom) {
                hasNearbyPetal = true;
            }
        }
    });

    if (nearestPetal) {
        const petalRect = nearestPetal.getBoundingClientRect();
        const petalCenterX = petalRect.left + petalRect.width / 2;
        targetX = (petalCenterX / window.innerWidth) * 100;
        targetX = Math.max(8, Math.min(92, targetX));
    }
}

function moveToTarget() {
    const character = document.getElementById('character');
    if (!character) return;

    const distance = targetX - characterX;
    const speed = moveSpeed();

    if (Math.abs(distance) > 0.35) {
        if (distance > 0) {
            characterX += Math.min(speed, distance);
        } else {
            characterX += Math.max(-speed, distance);
        }
        character.style.left = characterX + '%';
    }
}

function checkPetalCollision() {
    const character = document.getElementById('character');
    if (!character || listFinished) return;

    const characterRect = character.getBoundingClientRect();

    // 按角色实际尺寸比例算碰撞区（手机缩放后不能再用固定 100px）
    const padX = characterRect.width * 0.18;
    const padY = characterRect.height * 0.15;
    const hitExpand = isMobileView() ? 28 : 16;

    const hitLeft = characterRect.left + padX - hitExpand;
    const hitRight = characterRect.right - padX + hitExpand;
    const hitTop = characterRect.top + padY - hitExpand;
    const hitBottom = characterRect.bottom - padY + hitExpand;

    const petals = document.querySelectorAll('.petal');
    petals.forEach(petal => {
        const petalRect = petal.getBoundingClientRect();
        const petalCenterX = petalRect.left + petalRect.width / 2;
        const petalCenterY = petalRect.top + petalRect.height / 2;

        if (
            petalCenterY >= hitTop &&
            petalCenterY <= hitBottom &&
            petalCenterX >= hitLeft &&
            petalCenterX <= hitRight
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
    hasNearbyPetal = false;

    // 接到后安静站着等下一片，不要举篮走一步再停
    characterState = 'idle';
    currentFrame = idleFrame;
    targetX = characterX;

    flyGuestTagToBoard(guestName, petalRect);

    // 接到后稍等再落下一片
    setTimeout(() => spawnNextPetal(), 900);
}
