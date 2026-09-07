// 打开请柬
function openInvitation() {
    document.getElementById('cover').style.display = 'none';
    document.getElementById('mainContent').classList.add('active');
    createPetals();
    startCountdown();
    initCharacterControl();
}

// 创建飘落花瓣效果
function createPetals() {
    const petalsContainer = document.getElementById('petals');
    const petalCount = 20;

    for (let i = 0; i < petalCount; i++) {
        createSinglePetal(petalsContainer, i);
    }
}

function createSinglePetal(container, index) {
    const petal = document.createElement('div');
    const petalType = Math.floor(Math.random() * 5) + 1;
    petal.className = `petal type${petalType}`;
    petal.style.left = Math.random() * 100 + '%';
    const duration = Math.random() * 5 + 8;
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = (index * 0.3) + 's';
    const animations = ['fall', 'fall2', 'fall3', 'fall4', 'fall5'];
    const animationType = animations[Math.floor(Math.random() * animations.length)];
    petal.style.animationName = animationType;
    petal.style.animationTimingFunction = 'linear';
    const scale = 0.6 + Math.random() * 0.8;
    const initialRotation = Math.random() * 360;
    petal.style.transform = `scale(${scale}) rotate(${initialRotation}deg)`;
    container.appendChild(petal);

    setTimeout(() => {
        petal.remove();
        setTimeout(() => createSinglePetal(container, index), Math.random() * 2000);
    }, (duration + (index * 0.3)) * 1000);
}

// 倒计时
function startCountdown() {
    const weddingDate = new Date('2026-10-06T11:00:00').getTime();
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<p style="font-size: 1.5rem; color: #ff6b9d;">婚礼正在进行中 💕</p>';
            return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// 地图导航
function openMap() {
    const address = 'XX酒店 XX厅';
    const gaodeMapUrl = `https://uri.amap.com/search?query=${encodeURIComponent(address)}`;
    if (confirm('是否打开地图导航？\n点击"确定"打开高德地图')) {
        window.open(gaodeMapUrl, '_blank');
    }
}

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ==================== 祝福系统 ====================
let blessings = [];
let blessingHearts = [];

function showBlessingModal() {
    const modal = document.getElementById('blessingModal');
    modal.classList.add('active');
    document.getElementById('blessingName').value = '';
    document.getElementById('blessingText').value = '';
    document.getElementById('blessingName').focus();
}
function closeBlessingModal() {
    const modal = document.getElementById('blessingModal');
    modal.classList.remove('active');
}
function submitBlessing() {
    const name = document.getElementById('blessingName').value.trim();
    const text = document.getElementById('blessingText').value.trim();
    if (!name) { alert('请输入姓名'); return; }
    if (!text) { alert('请输入祝福语'); return; }
    const blessing = { name, text, id: Date.now() };
    createBlessingHeart(blessing);
    closeBlessingModal();
}
function createBlessingHeart(blessing) {
    const heart = document.createElement('div');
    heart.className = 'blessing-heart';
    heart.textContent = '💗';
    heart.dataset.blessingId = blessing.id;
    const randomX = Math.random() * 80 + 10;
    heart.style.left = randomX + '%';
    heart.style.top = '-100px';
    const duration = Math.random() * 3 + 8;
    heart.style.animationDuration = duration + 's';
    document.body.appendChild(heart);
    blessingHearts.push({ element: heart, blessing, x: randomX });
    setTimeout(() => {
        if (heart.parentNode) heart.remove();
        const idx = blessingHearts.findIndex(b => b.element === heart);
        if (idx > -1) blessingHearts.splice(idx, 1);
    }, duration * 1000);
}
function addBlessingToList(blessing) {
    const listItems = document.getElementById('blessingListItems');
    const item = document.createElement('div');
    item.className = 'blessing-list-item';
    item.innerHTML = `
        <div class="blessing-list-item-name">${blessing.name}:</div>
        <div class="blessing-list-item-text">${blessing.text}</div>
    `;
    listItems.insertBefore(item, listItems.firstChild);
    while (listItems.children.length > 20) listItems.removeChild(listItems.lastChild);
    blessings.push(blessing);
}

// ==================== 角色控制系统【雪碧图版本】 ====================
let characterX = 50;
let score = 0;
let targetX = 50;
let currentFrame = 0;
let lastX = 50;

// 帧配置
const idleFrame = 0;
const basketDownEnd = 15;
const basketUpStart = 15;
const basketUpEnd = 19;
const runStartFrame = 20;
const runEndFrame = 60;

let characterState = 'idle';
let hasNearbyPetal = false;
const moveSpeed = 0.8;

// 雪碧图配置 6行10列，单帧640px
const SPRITE_COLS = 10;
const FRAME_W = 640;
const FRAME_H = 640;

let animId = null;

// 根据帧序号设置雪碧图背景偏移
function setSpriteFrame(frameIdx) {
    const spriteDiv = document.getElementById('characterSprite');
    if (!spriteDiv) return;
    const col = frameIdx % SPRITE_COLS;
    const row = Math.floor(frameIdx / SPRITE_COLS);
    const x = -(col * FRAME_W);
    const y = -(row * FRAME_H);
    spriteDiv.style.backgroundPosition = `${x}px ${y}px`;
}

function tickCharacterAnimation() {
    updateCharacterAnimation();
    animId = requestAnimationFrame(tickCharacterAnimation);
}

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
    tickCharacterAnimation();
    setInterval(checkPetalCollision, 100);
}

function updateCharacterAnimation() {
    const movementDelta = characterX - lastX;
    const isMoving = Math.abs(movementDelta) > 0.5;
    const charEl = document.getElementById('character');

    if(isMoving){
        if(movementDelta < 0) charEl.classList.add('moving-left');
        else charEl.classList.remove('moving-left');
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
            if (currentFrame > idleFrame) currentFrame--;
            else characterState = 'waiting';
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
            if (currentFrame < basketUpEnd) currentFrame++;
            else {
                characterState = 'running';
                currentFrame = runStartFrame;
            }
            break;
        case 'running':
            currentFrame++;
            if (currentFrame > runEndFrame) currentFrame = runStartFrame;
            if (!isMoving && hasNearbyPetal) {
                characterState = 'puttingDown';
                currentFrame = basketDownEnd;
            } else if (!isMoving && !hasNearbyPetal) {
                characterState = 'idle';
                currentFrame = idleFrame;
            }
            break;
    }

    // 切换雪碧图帧
    setSpriteFrame(currentFrame);
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
    let targetType = 'none';
    hasNearbyPetal = false;

    blessingHearts.forEach(bh => {
        const heartRect = bh.element.getBoundingClientRect();
        if (heartRect.top > window.innerHeight * 0.2) {
            const heartCenterX = heartRect.left + heartRect.width / 2;
            const horizontalDist = Math.abs(heartCenterX - characterCenterX);
            const verticalDist = window.innerHeight - heartRect.bottom;
            const priority = horizontalDist + verticalDist * 0.3;
            if (priority < minDistance) {
                minDistance = priority;
                nearestPetal = bh;
                targetType = 'blessing';
            }
            if (heartRect.top > window.innerHeight * 0.4) hasNearbyPetal = true;
        }
    });

    if (targetType === 'none') {
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
                    targetType = 'petal';
                }
                if (petalRect.top > window.innerHeight * 0.4) hasNearbyPetal = true;
            }
        });
    }

    if (nearestPetal) {
        if (targetType === 'blessing') {
            const heartRect = nearestPetal.element.getBoundingClientRect();
            const heartCenterX = heartRect.left + heartRect.width / 2;
            targetX = (heartCenterX / window.innerWidth) * 100;
        } else {
            const petalRect = nearestPetal.getBoundingClientRect();
            const petalCenterX = petalRect.left + petalRect.width / 2;
            targetX = (petalCenterX / window.innerWidth) * 100;
        }
        targetX = Math.max(5, Math.min(95, targetX));
    }
}

function moveToTarget() {
    const character = document.getElementById('character');
    if (!character) return;
    const distance = targetX - characterX;
    if (Math.abs(distance) > 0.5) {
        if (distance > 0) characterX += Math.min(moveSpeed, distance);
        else characterX += Math.max(-moveSpeed, distance);
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

    blessingHearts.forEach((bh, index) => {
        const heartRect = bh.element.getBoundingClientRect();
        const heartCenterX = heartRect.left + heartRect.width / 2;
        const heartCenterY = heartRect.top + heartRect.height / 2;
        if (heartCenterY >= actualCharacterTop - 20 && heartCenterY <= actualCharacterBottom + 20
            && heartCenterX >= actualCharacterLeft - 20 && heartCenterX <= actualCharacterRight + 20) {
            catchBlessing(bh, heartRect, index);
        }
    });

    const petals = document.querySelectorAll('.petal');
    petals.forEach(petal => {
        const petalRect = petal.getBoundingClientRect();
        const petalCenterX = petalRect.left + petalRect.width / 2;
        const petalCenterY = petalRect.top + petalRect.height / 2;
        if (petalCenterY >= actualCharacterTop - 10 && petalCenterY <= actualCharacterBottom + 10
            && petalCenterX >= actualCharacterLeft - 10 && petalCenterX <= actualCharacterRight + 10) {
            catchPetal(petal, petalRect);
        }
    });
}

function catchBlessing(blessingHeart, heartRect, index) {
    blessingHeart.element.remove();
    blessingHearts.splice(index, 1);
    const effect = document.createElement('div');
    effect.className = 'catch-effect';
    effect.textContent = '💗祝福！';
    effect.style.left = heartRect.left + 'px';
    effect.style.top = heartRect.top + 'px';
    effect.style.fontSize = '2rem';
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
    addBlessingToList(blessingHeart.blessing);
    if (characterState === 'waiting' || characterState === 'puttingDown') {
        characterState = 'pickingUp';
        currentFrame = Math.max(currentFrame, basketUpStart);
    }
}

function catchPetal(petal, petalRect) {
    petal.remove();
    score++;
    const scoreValue = document.getElementById('scoreValue');
    if (scoreValue) scoreValue.textContent = score;
    if (characterState === 'waiting' || characterState === 'puttingDown') {
        characterState = 'pickingUp';
        currentFrame = Math.max(currentFrame, basketUpStart);
    }
    const effect = document.createElement('div');
    effect.className = 'catch-effect';
    effect.textContent = '🌸+1';
    effect.style.left = petalRect.left + 'px';
    effect.style.top = petalRect.top + 'px';
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}
