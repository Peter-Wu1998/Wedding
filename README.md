# 婚礼请柬网页

一个精美的婚礼请柬单页网站，包含动画效果、倒计时和响应式设计。

## 功能特点

✨ **精美设计**
- 渐变色背景和动画效果
- 飘落花瓣特效
- 流畅的页面过渡动画

💑 **新人展示**
- 新郎新娘信息展示
- 心形跳动动画

📅 **婚礼信息**
- 日期、时间、地点详细展示
- 图标化信息展示

⏰ **实时倒计时**
- 距离婚礼的天、时、分、秒倒计时
- 自动更新

🗺️ **地图导航**
- 一键打开地图应用
- 支持高德地图、百度地图

📱 **响应式设计**
- 完美适配手机、平板、电脑
- 优雅的移动端体验

## 使用方法

### 1. 修改个人信息

编辑 `index.html` 文件，修改以下内容：

```html
<!-- 新郎新娘姓名 -->
<h2 class="name">新郎姓名</h2>
<h2 class="name">新娘姓名</h2>

<!-- 婚礼日期 -->
<p class="value">2026年10月1日 星期四</p>

<!-- 婚礼时间 -->
<p class="value">上午 11:00</p>

<!-- 婚礼地点 -->
<p class="value">XX酒店 XX厅</p>
<p class="address">详细地址：某市某区某街道123号</p>
```

### 2. 设置倒计时日期

编辑 `script.js` 文件，修改婚礼日期：

```javascript
// 修改为实际婚礼日期和时间
const weddingDate = new Date('2026-10-01T11:00:00').getTime();
```

### 3. 设置地图导航

编辑 `script.js` 文件中的 `openMap()` 函数，填入实际地址：

```javascript
const address = 'XX酒店 XX厅'; // 修改为实际地址
```

### 4. 部署网站

有多种方式可以部署这个网页：

#### 方式一：直接打开文件
- 直接在浏览器中打开 `index.html` 文件即可预览

#### 方式二：使用 GitHub Pages（免费）
1. 在 GitHub 创建一个新仓库
2. 上传所有文件到仓库
3. 在仓库 Settings → Pages 中启用 GitHub Pages
4. 获得网址：`https://你的用户名.github.io/仓库名/`

#### 方式三：使用 Vercel（免费）
1. 访问 [Vercel](https://vercel.com)
2. 导入你的项目文件
3. 一键部署，获得专属网址

#### 方式四：使用 Netlify（免费）
1. 访问 [Netlify](https://netlify.com)
2. 拖放项目文件夹到网站
3. 自动部署，获得专属网址

## 文件结构

```
wedding-invitation/
│
├── index.html          # 主页面文件
├── style.css           # 样式文件
├── script.js           # 脚本文件
└── README.md           # 说明文档
```

## 自定义建议

### 更换配色方案
编辑 `style.css` 中的颜色值：
- 主色调：`#ff6b9d`（粉色）
- 辅助色：`#feca57`（金色）

### 添加背景音乐
在 `index.html` 的 `<body>` 标签中添加：

```html
<audio autoplay loop>
    <source src="your-music.mp3" type="audio/mpeg">
</audio>
```

### 添加照片
在相应位置添加 `<img>` 标签展示新人照片。

## 浏览器兼容性

- ✅ Chrome (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ 移动端浏览器

## 技术栈

- HTML5
- CSS3 (动画、渐变、响应式)
- JavaScript (原生，无需框架)

## 注意事项

1. 记得修改所有个人信息和日期
2. 测试地图导航链接是否正确
3. 在多个设备上测试显示效果
4. 部署前检查所有链接是否有效

## 联系与支持

如有问题或需要定制，欢迎联系！

---

祝新人百年好合，白头偕老！💕
