'use strict';
// 画布width
let width = 1000;

// 画布高
let height = 1000;

// 迷宫宽度(格数)
var MAZE_X_NUMBER = 40;

// 迷宫高度(格数)
var MAZE_Y_NUMBER = 40;

// 每个迷宫房间的宽度
let MAZE_ITEM_WIDTH = 20;

// 每个迷宫房间的高度
let MAZE_ITEM_HEIGHT = 20;

// 迷宫的背景参数
let MAZE_BACKGROUND_COLOR  = "#CCCCCC";

// 迷宫实例
let maze = null;

// 迷宫解决方案list
let solveList = null;

// show color
let SHOW_COLOR = true;

// x偏移量
let OFFSET_X = 30;

// y偏移量
let OFFSET_Y = 30;

/**
 * 初始化迷宫
 */
function initMaze() {
  // 迷宫微调，适应画布
  translate(OFFSET_X, OFFSET_Y);

  // 绘制全部迷宫
  maze.initMaze();
}

/**
 * 深度优先
 */
function DFS() {
    translate(OFFSET_X, OFFSET_Y);
    solveList = maze._solveMazeWithDeepPriority(maze.mazes[0], 0, 0, new Array());

    // // 展示迷宫
    // maze.showResult(solveList);
}

/**
 * 广度优先
 */
function BFS() {
  translate(OFFSET_X, OFFSET_Y);
  maze._solveMazeWithWidthPriority(0, maze.mazes.length - 1);
}


/**
 * p5.js setup
 */
function setup() {
  // put setup code here
  createCanvas(width, height);
  background(MAZE_BACKGROUND_COLOR);

}


/**
 * p5.js draw
 */
function draw() {
  // put drawing code here
  //noLoop();
}