### 环境准备

- nodejs 10+

建议将npm源指向taobao源，否则容易产生依赖安装错误。执行如下命令：
```bash
npm config set registry https://registry.npm.taobao.org
```

### 开发指南

``` bash
# install dependencies
npm install / yarn

# serve with hot reload at localhost:1000
npm run dev / yarn dev

# build for production with minification
npm run build / yarn start
```

### 项目目录结构

```
	projectName                        # 项目名称
	│
  ├── dist                           # 生成的打包文件
  │
  ├── node_modules                   # 编译依赖的模块
  │
  ├── scripts			                   # 编译打包构建文件
	│	
  ├── src                            # 源码目录
  │	 ├── assets                	     # 资源目录
	│  ├── core                        # 核心文件目录
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
	├── package.json                   # 项目依赖配置
	└── READMEAD.md             		   # 开发说明

```