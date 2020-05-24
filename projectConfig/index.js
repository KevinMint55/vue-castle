// 可在根目录新建projectConfig.js文件，重新yarn start启动项目，应用会优先采用projectConfig.js配置文件，并且会忽略该文件的提交。（主要为避免多人协作的时候，无谓的配置属性的覆盖与冲突）

window.$projectConfig = {
  baseURL: 'http://localhost:8001',
  cdnURL: 'http://localhost:8888/assets/',
};
