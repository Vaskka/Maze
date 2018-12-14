
class MazeItem {

    constructor(id, width, height, x, y) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        // 墙的绘制情况
        this.top = true;
        this.left = true;
        this.right = true;
        this.bottom = true;

        this.topNode = null;
        this.rightNode = null;
        this.bottomNode = null;
        this.leftNode = null;

        // 标记填充的颜色
        this.fillColor = "#660000";
        this.isFill = false;

        this.addColor = 0x0;

        // 是否已经完成
        this.ok = false;
        
    }

    debug() {
        console.log(this.id);
        console.log(this.width);
        console.log(this.height);
    }

    /**
     * 获得x-index
     */
    getXIndex() {
        return this.x / this.width;
    }

    /**
     * 获得y-index
     */
    getYIndex() {
        return this.y / this.height;
    }

    /**
     * 绘制当前迷宫的顶部
     */
    drawTop() {
        line(this.x, this.y, this.x + this.width, this.y);
    }

    /**
     * 绘制当前迷宫的底部
     */
    drawBottom() {
        line(this.x, this.y + this.height, this.x + this.width, this.y + this.height);
    }

    /**
     * 绘制当前迷宫的左侧
     */
    drawLeft() {
        line(this.x, this.y, this.x, this.y + this.height);
    }

    /**
     * 绘制当前迷宫的右侧
     */
    drawRight() {
        line(this.x + this.width, this.y, this.x + this.width, this.y + this.height);
    }

    /**
     * 标记当前路径
     */
    drawCurrentPathNumber(color, pathNumber) {
        if (pathNumber != undefined) {
            noStroke();
            textSize(7);
            
            if (color == undefined) {
                color = this.fillColor;
            }
            fill(color);
            text(str(pathNumber), this.x + this.width / 4, this.y + this.height / 2);
        }

        // if (SHOW_COLOR) {
        //     fill(this.addColor);
        //     rect(this.x * 1.2, this.y * 1.2, this.width * 0.8, this.height * 0.8);
        // }

        this.isFill = true;
    }

    /**
     * 填充当前路径的颜色
     * @param {Number} color 
     */
    drawCurrentPathColor(color) {
        fill(color);
        rect(this.x + 2, this.y + 2, this.width * 0.8, this.height * 0.8);
    }
}


class Maze {
    constructor() {
        // 迷宫栈
        this.mazes = [];

        // 初始化迷宫
        let countId = 0;
        for (let i = 0; i < MAZE_X_NUMBER; i++) {
            for (let j = 0; j < MAZE_Y_NUMBER; j++) {
                this.mazes[i * MAZE_Y_NUMBER + j] = new MazeItem(countId, MAZE_ITEM_WIDTH, MAZE_ITEM_HEIGHT, i * MAZE_ITEM_WIDTH, j * MAZE_ITEM_HEIGHT);
                countId++;
            }
        }

        // 是否打印全部路径
        this.drawAllPathNumber = true;
        this.drawAllPathColor = false;

        // 初始化并查集
        this.unionSet = new UnionFindSet(this.mazes);
    }

    /**
     * 绘制全部迷宫
     */
    drawAllMaze() {
        for (let i = 0; i < MAZE_X_NUMBER; i++) {
            for (let j = 0; j < MAZE_Y_NUMBER; j++) {

                // 讨论入口
                if (i != 0 || j != 0) {
                    this.mazes[i * MAZE_Y_NUMBER + j].drawTop();
                }
                
                this.mazes[i * MAZE_Y_NUMBER + j].drawRight();
                this.mazes[i * MAZE_Y_NUMBER + j].drawLeft();

                // 讨论出口
                if (i != MAZE_X_NUMBER - 1 || j != MAZE_Y_NUMBER - 1) {
                    this.mazes[i * MAZE_Y_NUMBER + j].drawBottom();
                }
                
        
            }
        }
    }
    
    /**
     * 生成迷宫
     * 思路：
     * 对于每个Item检查与上下左右是否联通，如果联通就画那一侧的边，不联通就用随机数随即决定是否画这条边，画了就continue，不画就union (error)
     * 删边
     */
    initMaze() {
        translate(OFFSET_X, OFFSET_Y);
        this.drawAllMaze();
    
        // 规定出口
        let mazeItemExit = this.mazes[this.mazes.length - 1];
    
        // 规定入口
        let mazeItemIn = this.mazes[0];
    
        // 删边
        stroke(MAZE_BACKGROUND_COLOR);
    
        while (!this.unionSet.isSameRoot(mazeItemIn.id, mazeItemExit.id)) {
            let rx = floor(random(1, MAZE_X_NUMBER));
            let ry = floor(random(1, MAZE_Y_NUMBER));
            
            let rDir = floor(random(0, 4));
        
            // base point
            let baseMazeItem = null;
            let deMazeItem = null;
        
            if (rDir == 0) {
                baseMazeItem = this.mazes[(rx - 1) * MAZE_Y_NUMBER + ry - 1];
                deMazeItem = this.mazes[rx * MAZE_Y_NUMBER + ry - 1];
        
                if (this.doEraseOrNot(baseMazeItem, deMazeItem)) {
                    line(rx * MAZE_ITEM_WIDTH, ry * MAZE_ITEM_HEIGHT, rx * MAZE_ITEM_WIDTH, (ry - 1) * MAZE_ITEM_HEIGHT);
                    this.unionSet.union(baseMazeItem.id, deMazeItem.id);
                    
                    // 完成链接
                    baseMazeItem.rightNode = deMazeItem;
                    deMazeItem.leftNode = baseMazeItem;

                    // 无墙标志
                    baseMazeItem.right = false;
                    deMazeItem.left = false;
                }
            }
            else if (rDir == 1) {
                baseMazeItem = this.mazes[rx * MAZE_Y_NUMBER + ry - 1];
                deMazeItem = this.mazes[rx * MAZE_Y_NUMBER + ry];
        
                if (this.doEraseOrNot(baseMazeItem, deMazeItem)) {
                    line(rx * MAZE_ITEM_WIDTH, ry * MAZE_ITEM_HEIGHT, (rx + 1) * MAZE_ITEM_WIDTH, ry * MAZE_ITEM_HEIGHT);
                    this.unionSet.union(baseMazeItem.id, deMazeItem.id);
            
                    // 完成链接
                    baseMazeItem.bottomNode = deMazeItem;
                    deMazeItem.topNode = baseMazeItem;

                    // 无墙标志
                    baseMazeItem.bottom = false;
                    deMazeItem.top = false;
                }
            }
            else if (rDir == 2) {
                baseMazeItem = this.mazes[rx * MAZE_Y_NUMBER + ry];
                deMazeItem = this.mazes[(rx - 1) * MAZE_Y_NUMBER + ry];
        
                if (this.doEraseOrNot(baseMazeItem, deMazeItem)) {
                    line(rx * MAZE_ITEM_WIDTH, ry * MAZE_ITEM_HEIGHT, rx * MAZE_ITEM_WIDTH, (ry + 1) * MAZE_ITEM_HEIGHT);
                    this.unionSet.union(baseMazeItem.id, deMazeItem.id);
            
                    // 完成链接
                    baseMazeItem.leftNode = deMazeItem;
                    deMazeItem.rightNode = baseMazeItem;

                    // 无墙标志
                    baseMazeItem.left = false;
                    deMazeItem.right = false;
                }
            }
            else {
                baseMazeItem = this.mazes[(rx - 1) * MAZE_Y_NUMBER + ry];
                deMazeItem = this.mazes[(rx - 1) * MAZE_Y_NUMBER + ry - 1];
        
                if (this.doEraseOrNot(baseMazeItem, deMazeItem)) {
                    line(rx * MAZE_ITEM_WIDTH, ry * MAZE_ITEM_HEIGHT, (rx - 1) * MAZE_ITEM_WIDTH, ry * MAZE_ITEM_HEIGHT);
                    this.unionSet.union(baseMazeItem.id, deMazeItem.id);
            
                    // 完成链接
                    baseMazeItem.topNode = deMazeItem;
                    deMazeItem.bottomNode = baseMazeItem;

                    // 无墙标志
                    baseMazeItem.top = false;
                    deMazeItem.bottom = false;
                }
            }
    
        }
    
    }


    /**
     * 解决迷宫
     * @param {MazeItem} currentItem 当前item
     */
    _solveMazeWithDeepPriority(currentItem, color, pathNumber, resultList) {

        // 标记路径颜色
        if (this.drawAllPathColor) {
            currentItem.drawCurrentPathColor("#" + hex((color * 1.8) % 255), pathNumber); 
        }

        // 标记路径颜色 
        if (this.drawAllPathNumber) {
            currentItem.drawCurrentPathNumber(color, pathNumber);
        }
        

        // 添加当前路径块
        currentItem.isFill = true;
        resultList.push(currentItem);
    
        if (currentItem.id == this.mazes[this.mazes.length - 1].id) {
            return {code: 0, data: resultList};
        }
    
        // 深度优先
        let itemList = [];
    
        let currentItemXIndex = currentItem.getXIndex();
        let currentItemYIndex = currentItem.getYIndex();
    
        // 拿到上下左右全部相邻节点
        itemList.push({data: this.mazes[currentItemXIndex * MAZE_Y_NUMBER + currentItemYIndex - 1], direction: "top"});
        itemList.push({data: this.mazes[(currentItemXIndex + 1) * MAZE_Y_NUMBER + currentItemYIndex], direction: "right"});
        itemList.push({data: this.mazes[currentItemXIndex * MAZE_Y_NUMBER + currentItemYIndex + 1], direction: "bottom"});
        itemList.push({data: this.mazes[(currentItemXIndex - 1) * MAZE_Y_NUMBER + currentItemYIndex], direction: "left"});
    
        for (let item of itemList) {
            if (item.data != undefined) {
                let result = {};
        
                if (item.direction == "top" && !currentItem.top && !item.data.isFill) {
                    result = this._solveMazeWithDeepPriority(item.data, color++, ++pathNumber, resultList.concat());
                }
                else if (item.direction == "right" && !currentItem.right && !item.data.isFill) {
                    result = this._solveMazeWithDeepPriority(item.data, color++, ++pathNumber, resultList.concat());
                }
                else if (item.direction == "bottom" && !currentItem.bottom && !item.data.isFill) {
                    result = this._solveMazeWithDeepPriority(item.data, color++, ++pathNumber, resultList.concat());
                }
                else if (item.direction == "left" && !currentItem.left && !item.data.isFill) {
                    result = this._solveMazeWithDeepPriority(item.data, color++, ++pathNumber, resultList.concat());
                }
        
                if (result.code == 0 && !this.drawAllPathNumber) {
                    return result;
                }
            }
        }
        return {code: 1, data: undefined};
    
    }
    
    /**
     * 广度优先
     * @param {Number} startNodeIndex  开始Node索引
     * @param {Number} endNodeIndex    结束Node索引
     */
    _solveMazeWithWidthPriority(startNodeIndex, endNodeIndex, color) {
        let startNode = this.mazes[startNodeIndex];
        let endNode = this.mazes[endNodeIndex];

        startNode.isFill = true;
        let list = this._getNodeAllNotNullNode(startNode);
        let i = 0;

        // 标记路径字符
        if (this.drawAllPathNumber) {
            startNode.drawCurrentPathNumber("#000000", i);
        }

        // 标记路径颜色 
        if (this.drawAllPathColor) {
            startNode.drawCurrentPathColor("#" + hex((i * 1.8) % 255), i);
        }

        i++;

        while (!endNode.isFill) {
            let new_list = []

            for (let item of list) {
                
                item.isFill = true;
                
                // 标记路径字符
                if (this.drawAllPathNumber) {
                    item.drawCurrentPathNumber("#000000", i);
                }

                // 标记路径颜色 
                if (this.drawAllPathColor) {
                    item.drawCurrentPathColor("#" + hex((i * 1.8) % 255), i);
                }
                i++;

                if (item == endNode) {
                    return;
                }

                new_list = new_list.concat(this._getNodeAllNotNullNode(item));
            }

            list = new_list;
        }

    }


    /**
     * 展示路径
     * @param {Array} list 记录路径的数组
     */
    showResult(list) {
        let k = 0;  
        if (list.data == undefined) {
            console.log(undefined);
            return;
        }
        for (let i of list.data) {
            i.drawCurrentPathNumber("#FF0000" , k);
            k++;
        }
    }

    /**
     * 根据联合情况进行擦除
     * @param {MazeItem} itemA MazeItem
     * @param {MazeItem} itemB MazeItem
     */
    doEraseOrNot(itemA, itemB) {
        // 已经联通不擦除
        if (this.unionSet.isSameRoot(itemA.id, itemB.id)) {
            return false;
        }

        // 不联通随机决定是否擦除
        if (floor(random(0, 20)) % 2 == 0) {
            return true;
        }

        return false;



    }

    /**
     * 得到某个节点全部的相邻非空节点
     * @param {MazeItem} mazeItem 
     */
    _getNodeAllNotNullNode(mazeItem) {
        let result = []

        if (mazeItem.topNode != null && !mazeItem.topNode.isFill) {
            result.push(mazeItem.topNode);
        }
        if (mazeItem.rightNode != null && !mazeItem.rightNode.isFill) {
            result.push(mazeItem.rightNode);
        }
        if (mazeItem.bottomNode != null && !mazeItem.bottomNode.isFill) {
            result.push(mazeItem.bottomNode);
        }
        if (mazeItem.leftNode != null && !mazeItem.leftNode.isFill) {
            result.push(mazeItem.leftNode);
        }

        return result;

    }
  
}