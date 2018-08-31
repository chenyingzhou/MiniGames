class PlayArea extends egret.DisplayObjectContainer {
    public activeDot: Dot;
    public activeLine: Line;
    public dotRelation: number[] = [];
    public static gridWidth = 40;  // 棋盘每格宽/高度
    public static reservedH = 100; // 上下预留空间
    protected currentTaskNo = 0;
    protected currentTask: [number, number][];
    protected static tasks: [number, number][][] = [
        [[4, 1], [1, 7], [7, 7], [4, 1]],
        [[2, 2], [2, 6], [6, 6], [6, 2], [2, 2]],
        [[3, 6], [1, 5], [4, 1], [3, 6], [5, 6], [4, 1], [7, 5], [5, 6]],
        [[4, 2], [1, 4], [7, 4], [4, 2], [3, 6], [5, 6], [4, 2]],
    ];

    public constructor(taskNo: number = 0) {
        super();
        this.touchEnabled = true;
        this.switchTo(taskNo);
    }

    /**
     * 切换关卡
     *
     * @param taskNo
     */
    private switchTo(taskNo: number): void {
        this.removeChildren();
        this.activeDot = null;
        this.activeLine = null;
        this.dotRelation = [];
        // 背景
        let bg: egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0x00FFFF);
        bg.graphics.drawRect(0, 0, Main.getInstance().stage.stageWidth, PlayArea.gridWidth * 8 + PlayArea.reservedH * 2);
        bg.alpha = 0;
        this.addChild(bg);

        this.currentTaskNo = taskNo;
        this.currentTask = PlayArea.tasks[this.currentTaskNo];

        for (let i = 0; i < this.currentTask.length - 1; i++) {
            let line = new Line(0X888888);
            let [pointStartX, pointStartY] = PlayArea.computeXY(this.currentTask[i]);
            let [pointEndX, pointEndY] = PlayArea.computeXY(this.currentTask[i + 1]);
            line.setPoints(pointStartX, pointStartY, pointEndX, pointEndY);
            this.addChild(line);
        }

        // 点去重并添加
        let pointArr: string[] = [];
        for (let i = 0; i < this.currentTask.length; i++) {
            if (-1 === pointArr.indexOf(this.currentTask[i].toString())) {
                pointArr.push(this.currentTask[i].toString());
                let dot: Dot = new Dot();
                dot.tablePos = this.currentTask[i];
                [dot.x, dot.y] = PlayArea.computeXY(this.currentTask[i]);
                this.addChild(dot);
            }
        }
    }

    /**
     * 根据点的宫格位置计算像素位置
     *
     * @param grid
     */
    public static computeXY(grid: [number, number]) {
        return [
            grid[0] * PlayArea.gridWidth + (Main.getInstance().stage.stageWidth - PlayArea.gridWidth * 8) / 2,
            grid[1] * PlayArea.gridWidth + PlayArea.reservedH,
        ];
    }

    public onTouchMove(evt: egret.TouchEvent) {
        this.drawActiveLine(evt.stageX - this.x, evt.stageY - this.y);
    }

    public onTouchEnd(evt: egret.TouchEvent) {
        this.clearActiveLine();
    }

    public onTouchReleaseOutside(evt: egret.TouchEvent) {
        this.clearActiveLine();
    }

    /**
     * 准备画活动线
     */
    public preDrawActiveLine() {
        if (this.activeLine) {
            this.clearActiveLine();
        }
        // 所有连线都已完成，不再继续准备连线
        if (this.dotRelation.length === this.currentTask.length - 1) {
            TaskFinish.getInstance().show();
            return;
        }
        this.activeLine = new Line();
        this.activeLine.setPointStart(this.activeDot.x, this.activeDot.y);
        this.addChildAt(this.activeLine, this.currentTask.length);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaseOutside, this);
    }

    public drawActiveLine(endX: number, endY: number) {
        this.activeLine.setPointEnd(endX, endY);
    }

    /**
     * 清除当前活动的线
     */
    public clearActiveLine() {
        this.removeChild(this.activeLine);
        this.activeLine = null;
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaseOutside, this);
    }

    /**
     * 在2个点之间画线
     *
     * @param dot1
     * @param dot2
     */
    public drawLineBetween(dot1: Dot, dot2: Dot) {
        let pos1 = dot1.tablePos;
        let pos2 = dot2.tablePos;
        let index = -1;
        for (let i = 0; i < this.currentTask.length - 1; i++) {
            if (-1 !== this.dotRelation.indexOf(i)) {  // 已经连线的不再继续
                continue;
            }
            // 检查是否可以连线，可以则记录
            if ((this.currentTask[i].toString() === pos1.toString() && this.currentTask[i + 1].toString() === pos2.toString()) ||
                (this.currentTask[i].toString() === pos2.toString() && this.currentTask[i + 1].toString() === pos1.toString())) {
                index = i;
                this.dotRelation.push(i);
                break;
            }
        }
        // 不可连线则不执行操作
        if (-1 === index) {
            return;
        }

        // 画线
        let line = new Line();
        line.setPoints(dot1.x, dot1.y, dot2.x, dot2.y);
        this.addChildAt(line, this.currentTask.length);
    }

    /**
     * 检查2点是否可以连线
     *
     * @param dot1
     * @param dot2
     */
    public isNeighbor(dot1: Dot, dot2: Dot): boolean {
        let pos1 = dot1.tablePos;
        let pos2 = dot2.tablePos;
        for (let i = 0; i < this.currentTask.length - 1; i++) {
            if (-1 !== this.dotRelation.indexOf(i)) {
                continue;
            }
            if ((this.currentTask[i].toString() === pos1.toString() && this.currentTask[i + 1].toString() === pos2.toString()) ||
                (this.currentTask[i].toString() === pos2.toString() && this.currentTask[i + 1].toString() === pos1.toString())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 跳到下一关
     */
    public switchToNext():boolean {
        if (this.currentTaskNo >= PlayArea.tasks.length - 1) {
            return false;
        }
        this.currentTaskNo++;
        this.switchTo(this.currentTaskNo);
        return true;
    }


}