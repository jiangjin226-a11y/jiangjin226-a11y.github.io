# 蒋红梅的个人主页

个人主页：[jiangjin226-a11y.github.io](https://jiangjin226-a11y.github.io)

## 页面结构

```
index.html              ← 主页（单页）
assets/css/homepage.css ← 样式
assets/js/homepage.js   ← 动画
images/                 ← 头像、图标
```

## 本地预览

```bash
python3 -m http.server 8079
```

然后打开 `http://localhost:8079`。

## 更新内容

直接编辑 `index.html` 即可。

## 部署

```bash
git add -A
git commit -m "更新主页"
git push
```

通过 GitHub Pages 自动部署。

## 鸣谢

- 基于 [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io) 开发
- 动画由 [GSAP](https://greensock.com/gsap/) 驱动
- 配色方案灵感来自 [Nord](https://www.nordtheme.com/)
