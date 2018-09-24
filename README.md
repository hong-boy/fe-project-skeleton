# 项目脚手架
- 项目脚手架制作的意义
- 如何制作

## 意义
> 提升开发效率、推进团队开发规范落地，统一的开发规范有利于新人快速融入。通过如下形式体现：
1. 节省重复劳动
2. 内置eslint\commitlint规范，配合git hooks强制团队成员遵守规范

## 如何制作
- 思路
- 相关知识点/模块
- 发布到私有npm仓库

### 思路
> 脚手架由两部分组成：```bin/cli.js```和```tempaltes/```
- ```templates/```: 
> 存放待生成的项目模板
- ```bin/cli.js```: 
> 脚手架主要逻辑代码：接收命令参数、生成项目文件夹、拷贝项目模板、安装依赖包

### 相关知识点/模块
- 如何生成脚手架命令？
> 脚手架全局安装后，会扫描package.json，寻找bin字段，若找到，则自动生成cmd命令脚本到全局目录。
- cross-spawn
> 执行命令
- which
> 检测客户端环境下npm/yarn的安装路径
- commander
> 提供命令行工具
- readline-sync/inquirer
> 提供用户对话交互
- kopy
> 复制文件夹，同时支持模板编译
- ora
> 实现交互动效

### 脚手架目录结构说明
```
bin: 存放可执行文件
bin/cli.js: 入口文件
bin/util.js: 存放工具方法
bin/cmd.init.js: 存放init命令实现

templates: 存放项目模板
templates/plugin: 存放通用组件项目模板
tempaltes/web: 存放web项目模板
```

### 项目模板目录说明
- plugin
- web

### 如何调试
> 项目开发时，我们可以使用```node ./bin/cli.js init -h```命令来进行本地调试。  
当然也可以使用```npm link```关联到全局目录，然后打开命令行工具窗口，执行```scaffold init -h```  
还可以使用```npm pack```打成tar包，然后执行```npm install -g ./fe-project-skeleton.tar.gz```全局安装

### 发布到私有npm仓库
1. 添加.npmignore文件，忽略不需要发布的文件
2. 切换npm registry（可以使用nrm或yrm来管理）
3. 登录：```npm login```
4. 发布：```npm publish```

## 如何使用
1. 全局安装模块
```
// 临时指定镜像地址
npm install -g fe-skeleton-cli --registry=https:your-npm-registry

// 使用nrm或yrm配置镜像地址
npm install -g nrm
nrm add my-registry https://your-npm-registry
nrm use my-registry
npm install -g fe-skeleton-cli
```
2. 查看命令提示
```
scaffold --help

scaffold init --help
```
3. 新建项目，根据提示补充项目信息
```
scaffold init --web your-project-name
```

## 项目计划
1. 支持生成浏览器端项目 - 进行中
2. 支持生成小程序项目
3. 支持生成PC端桌面应用项目
