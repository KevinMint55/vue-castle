### 前言

在闲余时间自己折腾了一个 [可编辑的表格组件](https://github.com/KevinMint55/vue-willtable)，于是基于编辑组件又开发了该实时共享编辑表格系统。

[Demo](https://castle.willwuwei.com/)

### 部分截图

#### 团队与项目列表

![image](https://qiniu.willwuwei.com/castle-list.png)

#### 表格与视图列表以及编辑表格

![image](https://qiniu.willwuwei.com/castle-view.png)

### 技术栈

Vue2 + Vuex + Vue-router + Webpack + axios + less + flex + socket.io

### 开发指南

``` bash
# install dependencies
npm install / yarn

# serve with hot reload at localhost:2003
npm run dev / yarn dev

# build for production with minification
npm run build / yarn start
```

### 项目目录结构

```
	castle                             # 项目名称
	│
  ├── dist                           # 生成的打包文件
	│
  ├── projectConfig                  
	│		└── index.js                    # 项目配置文件
  │
  ├── node_modules                   # 编译依赖的模块
  │
  ├── scripts			                   # 编译打包构建文件
	│	
  ├── src                            # 源码目录
  │	 ├── assets                	     # 资源目录
	│  ├── core                        # 核心文件目录
	|  |	├── apis                     # api列表
	|  |	├── directives							 # 自定义指令
	|  |	├── ajax.js                  # 请求拦截器与请求方法
	|  |	├── element.js               # 按需引用element UI组件
	|  |	├── index.js                 # 统一输出引用
	|  |	└── utils.js                 # 通用工具方法
  │  ├── static                      # 静态文件
	│  ├── router                      # 路由目录
	│  ├── store			                 # 状态管理目录
	│  ├── style			                 # 样式目录
	│  ├── views			                 # 页面目录
	│  ├── App.vue			               # 挂载实例
	│  ├── favicon.ico			           # 页面icon图标	
	│  ├── index.html			             # 页面HTML文件
	│	 └── main.js                     # 入口文件
	│
  ├── .gitignore                     # git文件忽略
	├── .gitlab-ci.yml                 # gitlab ci配置文件
	├── package.json                   # 项目依赖配置
	└── READMEAD.md             		   # 开发说明

```