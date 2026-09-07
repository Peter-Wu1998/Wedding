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
    const petalCount = 20; // 减少数量避免卡顿
    
    // 创建固定数量的花瓣
    for (let i = 0; i < petalCount; i++) {
        createSinglePetal(petalsContainer, i);
    }
}

// 创建单个花瓣并在落下后重新创建
function createSinglePetal(container, index) {
    const petal = document.createElement('div');
    
    // 随机选择花瓣类型（5种现实中的花瓣形状）
    const petalType = Math.floor(Math.random() * 5) + 1;
    petal.className = `petal type${petalType}`;
    
    petal.style.left = Math.random() * 100 + '%';
    
    const duration = Math.random() * 5 + 8; // 8-13秒，飘落更慢更优雅
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = (index * 0.3) + 's'; // 错开时间
    
    // 随机选择动画类型（5种不同飘落方式，都有左右大幅摇摆）
    const animations = ['fall', 'fall2', 'fall3', 'fall4', 'fall5'];
    const animationType = animations[Math.floor(Math.random() * animations.length)];
    petal.style.animationName = animationType;
    // 使用线性动画，保持匀速下落
    petal.style.animationTimingFunction = 'linear';
    
    // 随机花瓣大小
    const scale = 0.6 + Math.random() * 0.8; // 0.6-1.4倍
    const initialRotation = Math.random() * 360; // 随机初始旋转角度
    petal.style.transform = `scale(${scale}) rotate(${initialRotation}deg)`;
    
    container.appendChild(petal);
    
    // 动画结束后移除并重新创建一个新的
    setTimeout(() => {
        petal.remove();
        // 延迟一点再创建新花瓣，避免同时太多
        setTimeout(() => createSinglePetal(container, index), Math.random() * 2000);
    }, (duration + (index * 0.3)) * 1000);
}

// 倒计时功能
function startCountdown() {
    // 设置婚礼日期 - 请修改为实际婚礼日期
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

// 打开地图导航
function openMap() {
    // 这里可以替换为实际的地图链接
    // 例如：高德地图、百度地图、Google Maps等
    const address = 'XX酒店 XX厅';
    const gaodeMapUrl = `https://uri.amap.com/search?query=${encodeURIComponent(address)}`;
    
    // 提示用户选择地图应用
    if (confirm('是否打开地图导航？\n点击"确定"打开高德地图')) {
        window.open(gaodeMapUrl, '_blank');
    }
}

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ==================== 祝福系统 ====================

let blessings = []; // 存储所有祝福
let blessingHearts = []; // 存储正在飘落的祝福爱心

// 显示祝福弹窗
function showBlessingModal() {
    const modal = document.getElementById('blessingModal');
    modal.classList.add('active');
    document.getElementById('blessingName').value = '';
    document.getElementById('blessingText').value = '';
    document.getElementById('blessingName').focus();
}

// 关闭祝福弹窗
function closeBlessingModal() {
    const modal = document.getElementById('blessingModal');
    modal.classList.remove('active');
}

// 提交祝福
function submitBlessing() {
    const name = document.getElementById('blessingName').value.trim();
    const text = document.getElementById('blessingText').value.trim();
    
    if (!name) {
        alert('请输入姓名');
        return;
    }
    
    if (!text) {
        alert('请输入祝福语');
        return;
    }
    
    // 创建祝福对象
    const blessing = {
        name: name,
        text: text,
        id: Date.now()
    };
    
    // 生成祝福爱心
    createBlessingHeart(blessing);
    
    // 关闭弹窗
    closeBlessingModal();
}

// 创建祝福爱心
function createBlessingHeart(blessing) {
    const heart = document.createElement('div');
    heart.className = 'blessing-heart';
    heart.textContent = '💗';
    heart.dataset.blessingId = blessing.id;
    
    // 随机X位置
    const randomX = Math.random() * 80 + 10; // 10-90%
    heart.style.left = randomX + '%';
    heart.style.top = '-100px';
    
    // 随机下落时间
    const duration = Math.random() * 3 + 8; // 8-11秒
    heart.style.animationDuration = duration + 's';
    
    document.body.appendChild(heart);
    
    // 存储祝福信息
    blessingHearts.push({
        element: heart,
        blessing: blessing,
        x: randomX
    });
    
    // 动画结束后移除
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
        // 从数组中移除
        const index = blessingHearts.findIndex(b => b.element === heart);
        if (index > -1) {
            blessingHearts.splice(index, 1);
        }
    }, duration * 1000);
}

// 添加祝福到列表
function addBlessingToList(blessing) {
    const listItems = document.getElementById('blessingListItems');
    
    const item = document.createElement('div');
    item.className = 'blessing-list-item';
    item.innerHTML = `
        <div class="blessing-list-item-name">${blessing.name}:</div>
        <div class="blessing-list-item-text">${blessing.text}</div>
    `;
    
    // 添加到列表顶部
    listItems.insertBefore(item, listItems.firstChild);
    
    // 限制列表数量（最多显示20条）
    while (listItems.children.length > 20) {
        listItems.removeChild(listItems.lastChild);
    }
    
    blessings.push(blessing);
}

// ==================== 角色控制系统 ====================

// 小人控制系统 - AI自动接花瓣
let characterX = 50; // 百分比位置
let score = 0;
let targetX = 50; // 目标位置
let currentFrame = 0;
let lastX = 50;

// 动画帧配置
const idleFrame = 0; // 完全静止帧
const basketDownEnd = 15; // 放篮子动画结束帧
const basketUpStart = 15; // 举起篮子动画开始
const basketUpEnd = 19; // 举起篮子动画结束（调整到19帧）
const runStartFrame = 20; // 跑步循环起始帧（从19改为20）
const runEndFrame = 60; // 跑步循环结束帧

// 角色状态
let characterState = 'idle'; // 状态: idle, puttingDown, waiting, pickingUp, running
let hasNearbyPetal = false;

// 固定移动速度
const moveSpeed = 0.8; // 每帧移动的百分比（从1.5降低到0.8）

function initCharacterControl() {
    const character = document.getElementById('character');
    if (!character) return;

    // 创建计分板
    const scoreBoard = document.createElement('div');
    scoreBoard.className = 'score-board';
    scoreBoard.innerHTML = `
        <div class="score-label">接到花瓣</div>
        <div class="score-value" id="scoreValue">0</div>
    `;
    document.body.appendChild(scoreBoard);

    // AI自动寻找目标
    setInterval(findNearestPetal, 50);
    
    // 固定速度移动
    setInterval(moveToTarget, 30);

    // 更新角色动画帧
    setInterval(updateCharacterAnimation, 50);

    // 检测花瓣碰撞
    setInterval(checkPetalCollision, 100);
}

// 更新角色动画帧
function updateCharacterAnimation() {
    const character = document.getElementById('character');
    const sprite = document.getElementById('characterSprite');
    if (!sprite) return;

    // 计算移动方向
    const movementDelta = characterX - lastX;
    const isMoving = Math.abs(movementDelta) > 0.5;
    
    // 更新方向
    if (isMoving) {
        if (movementDelta < 0) {
            character.classList.add('moving-left');
        } else if (movementDelta > 0) {
            character.classList.remove('moving-left');
        }
    }
    
    // 状态机逻辑
    switch (characterState) {
        case 'idle':
            currentFrame = idleFrame;
            if (hasNearbyPetal && !isMoving) {
                // 有花瓣但没在移动，开始放下篮子
                characterState = 'puttingDown';
                currentFrame = basketDownEnd;
            } else if (isMoving) {
                // 开始移动，进入跑步状态
                characterState = 'pickingUp';
                currentFrame = basketUpStart;
            }
            break;
            
        case 'puttingDown':
            // 正在放下篮子（15->0）
            if (currentFrame > idleFrame) {
                currentFrame--;
            } else {
                // 放下完成，进入等待状态
                characterState = 'waiting';
            }
            
            // 中途接到花瓣或需要移动，举起篮子
            if (isMoving) {
                characterState = 'pickingUp';
                currentFrame = Math.max(currentFrame, basketUpStart);
            }
            break;
            
        case 'waiting':
            // 等待状态，保持在第0帧
            currentFrame = idleFrame;
            
            // 需要移动时，举起篮子
            if (isMoving || !hasNearbyPetal) {
                characterState = 'pickingUp';
                currentFrame = basketUpStart;
            }
            break;
            
        case 'pickingUp':
            // 举起篮子（15->18）
            if (currentFrame < basketUpEnd) {
                currentFrame++;
            } else {
                // 举起完成，进入跑步状态
                characterState = 'running';
                currentFrame = runStartFrame;
            }
            break;
            
        case 'running':
            // 跑步循环（19-60）
            currentFrame++;
            if (currentFrame > runEndFrame) {
                currentFrame = runStartFrame;
            }
            
            // 停止移动且有花瓣在附近，准备放下篮子
            if (!isMoving && hasNearbyPetal) {
                characterState = 'puttingDown';
                currentFrame = basketDownEnd;
            }
            // 停止移动且没有花瓣，回到静止
            else if (!isMoving && !hasNearbyPetal) {
                characterState = 'idle';
                currentFrame = idleFrame;
            }
            break;
    }
    
    sprite.src = `frames/frame_${String(currentFrame).padStart(4, '0')}.png`;
    lastX = characterX;
}

// AI寻找最近的花瓣
function findNearestPetal() {
    const character = document.getElementById('character');
    if (!character) return;

    const characterRect = character.getBoundingClientRect();
    const characterCenterX = characterRect.left + characterRect.width / 2;
    const petals = document.querySelectorAll('.petal');

    let nearestPetal = null;
    let minDistance = Infinity;
    let targetType = 'none'; // none, petal, blessing
    hasNearbyPetal = false;

    // 优先查找祝福爱心
    blessingHearts.forEach(bh => {
        const heartRect = bh.element.getBoundingClientRect();
        
        if (heartRect.top > window.innerHeight * 0.2) {
            const heartCenterX = heartRect.left + heartRect.width / 2;
            const horizontalDist = Math.abs(heartCenterX - characterCenterX);
            const verticalDist = window.innerHeight - heartRect.bottom;
            const priority = horizontalDist + verticalDist * 0.3; // 祝福优先级更高
            
            if (priority < minDistance) {
                minDistance = priority;
                nearestPetal = bh;
                targetType = 'blessing';
            }
            
            if (heartRect.top > window.innerHeight * 0.4) {
                hasNearbyPetal = true;
            }
        }
    });

    // 如果没有祝福，再找普通花瓣
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
                
                if (petalRect.top > window.innerHeight * 0.4) {
                    hasNearbyPetal = true;
                }
            }
        });
    }

    // 移动到目标位置
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

// 固定速度移动到目标位置
function moveToTarget() {
    const character = document.getElementById('character');
    if (!character) return;

    const distance = targetX - characterX;
    
    if (Math.abs(distance) > 0.5) {
        // 固定速度移动
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
    
    // 计算人物实际可见区域（排除透明边框）
    const actualCharacterLeft = characterRect.left + 100;
    const actualCharacterRight = characterRect.right - 100;
    const actualCharacterTop = characterRect.top + 100;
    const actualCharacterBottom = characterRect.bottom - 100;
    
    // 检测祝福爱心碰撞（优先）
    blessingHearts.forEach((bh, index) => {
        const heartRect = bh.element.getBoundingClientRect();
        const heartCenterX = heartRect.left + heartRect.width / 2;
        const heartCenterY = heartRect.top + heartRect.height / 2;
        
        // 使用爱心中心点判断，并给一定容差范围
        if (
            heartCenterY >= actualCharacterTop - 20 &&
            heartCenterY <= actualCharacterBottom + 20 &&
            heartCenterX >= actualCharacterLeft - 20 &&
            heartCenterX <= actualCharacterRight + 20
        ) {
            catchBlessing(bh, heartRect, index);
        }
    });
    
    // 检测普通花瓣碰撞
    const petals = document.querySelectorAll('.petal');
    petals.forEach(petal => {
        const petalRect = petal.getBoundingClientRect();
        const petalCenterX = petalRect.left + petalRect.width / 2;
        const petalCenterY = petalRect.top + petalRect.height / 2;
        
        // 使用花瓣中心点判断
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

// 接住祝福
function catchBlessing(blessingHeart, heartRect, index) {
    // 移除爱心
    blessingHeart.element.remove();
    blessingHearts.splice(index, 1);
    
    // 显示特效
    const effect = document.createElement('div');
    effect.className = 'catch-effect';
    effect.textContent = '💗祝福！';
    effect.style.left = heartRect.left + 'px';
    effect.style.top = heartRect.top + 'px';
    effect.style.fontSize = '2rem';
    document.body.appendChild(effect);

    setTimeout(() => effect.remove(), 1000);
    
    // 添加到祝福列表
    addBlessingToList(blessingHeart.blessing);
    
    // 接到祝福后，如果在等待或放下篮子状态，立即举起篮子继续跑
    if (characterState === 'waiting' || characterState === 'puttingDown') {
        characterState = 'pickingUp';
        currentFrame = Math.max(currentFrame, basketUpStart);
    }
}

function catchPetal(petal, petalRect) {
    // 移除花瓣
    petal.remove();
    
    // 增加分数
    score++;
    const scoreValue = document.getElementById('scoreValue');
    if (scoreValue) {
        scoreValue.textContent = score;
    }

    // 接到花瓣后，如果在等待或放下篮子状态，立即举起篮子继续跑
    if (characterState === 'waiting' || characterState === 'puttingDown') {
        characterState = 'pickingUp';
        currentFrame = Math.max(currentFrame, basketUpStart);
    }

    // 显示接住特效
    const effect = document.createElement('div');
    effect.className = 'catch-effect';
    effect.textContent = '🌸+1';
    effect.style.left = petalRect.left + 'px';
    effect.style.top = petalRect.top + 'px';
    document.body.appendChild(effect);

    setTimeout(() => effect.remove(), 1000);
}
