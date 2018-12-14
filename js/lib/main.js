
/**
 * 展示信息
 * @param {String} txt 进行展示的信息
 */
function showInfo(txt) {
    $("#info-content").text(txt);
    $("#info-content").fadeIn();

}


/**
 * 初始化视图
 */
function initView() {
    $(".start-sign").hide();
    $(".end-sign").hide();
}


/**
 * 清空输入
 */
function clearInput() {
    $("#input-x").text("");
    $("#input-y").text("");
}


/**
 * 展示出口入口文字
 */
function showAccessExitText() {
    $(".start-sign").fadeIn();
    $(".end-sign").fadeIn();

    $(".start-sign").css("left", OFFSET_X);
    $(".start-sign").css("top", OFFSET_Y - MAZE_ITEM_HEIGHT - 5);

    $(".end-sign").css("left", OFFSET_X + (MAZE_X_NUMBER - 1) * MAZE_ITEM_WIDTH - 5);
    $(".end-sign").css("top", OFFSET_Y + MAZE_Y_NUMBER * MAZE_ITEM_HEIGHT);
}


function main() {

    initView();

    $("#info-content").hide();

    $("#init").click(function() {

        // 检查输入是否合法
        xInput = $("#input-x").val();
        yInput = $("#input-y").val();

        realX = int(xInput);
        realY = int(yInput);

        if (((!(/^[0-9]+$/.test(xInput))) && xInput != "") || realX < 2) {
            
            showInfo("输入的宽度数不合法!");
            clearInput();
            return;
        }

        if (((!(/^[0-9]+$/.test(yInput))) && yInput != "") || realY < 2) {
            showInfo("输入的高度数不合法!");
            clearInput();
            return;
        }

        MAZE_X_NUMBER = xInput == "" ? 40 : realX;
        MAZE_Y_NUMBER = yInput == "" ? 40 : realY;

        // 显示入口出口
        showAccessExitText();

        // 初始化迷宫
        maze = new Maze();
        maze.initMaze();

        $("#deep").removeAttr("disabled");
        $("#width").removeAttr("disabled");

        // 构造响应提示信息
        let msg = "";
        if (xInput == "" && yInput == "") {
            
            msg = "迷宫生成成功! 宽度格数:" + str(MAZE_X_NUMBER) + "(默认宽度)" + ", 高度格数:" + str(MAZE_Y_NUMBER) + "(默认高度)" ;
        }
        else if (xInput == "" && yInput != "") {
            msg = "迷宫生成成功! 宽度格数:" + str(MAZE_X_NUMBER) + "(默认宽度)" + ", 高度格数:" + str(MAZE_Y_NUMBER);
        }
        else if (xInput != "" && yInput == "") {
            msg = "迷宫生成成功! 宽度格数:" + str(MAZE_X_NUMBER) + ", 高度格数:" + str(MAZE_Y_NUMBER) + "(默认高度)" ;   
        }
        else {
            msg = "迷宫生成成功! 宽度格数:" + str(MAZE_X_NUMBER) + ", 高度格数:" + str(MAZE_Y_NUMBER);
        }
    
        // 展示提示信息       
        showInfo(msg);

    })

    $("#deep").click(function() {

        DFS();
        $("#width").attr("disabled", "disabled");
        $("#init").attr("disabled", "disabled");

        showInfo("使用深度优先已解决迷宫!");
    })

    $("#width").click(function() {
        BFS();
        $("#deep").attr("disabled", "disabled");
        $("#init").attr("disabled", "disabled");

        showInfo("使用广度优先已解决迷宫!");
        
    })

    $("#reload").click(function () {
        window.location.reload();
    })



}


$(document).ready(function(){
    main();
});