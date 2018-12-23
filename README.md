# Maze

> 使用BFS和DFS的迷宫演示示例

# 使用框架
+ electron ^3.0.7
+ bootstrap 4.1.3
+ jquery 3.3.1
+ p5.js 0.5.13

# 主要思路

## UI部分

使用electron框架，基于前端技术简化桌面应用开发流程

项目入口为index.html

## 绘图部分

主要使用p5.js提供api进行绘图

## 迷宫部分

### 生成迷宫

利用擦除的思路，在擦除墙壁之前，检查即将联通的Item的连通性

### 解决迷宫

BFS：解决与当前的Item相连的全部Item后再进行下次迭代

DFS：直到解决某一个分支的全部分支后再进行下一分支
