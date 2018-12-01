namespace PlayArea {
    export class PlayArea extends egret.DisplayObjectContainer {
        public touchToStart = false;
        public activeDot: Dot;
        public activeLine: Line;
        public background: egret.Shape;
        public dotRelation: number[] = [];
        public static gridWidth = 60;  // 棋盘每格宽/高度
        public static reservedH = 100; // 上下预留空间
        protected static instance;
        protected currentTaskNo;
        protected currentTask: [number, number][];
        protected dots: Dot[] = [];
        protected lines: Line[] = [];
        protected static tasks: [number, number][][] = DataProvider.getTasks();
        public static isAutoPlay: boolean = true;

        public static getInstance(): PlayArea {
            if (!PlayArea.instance) {
                PlayArea.instance = new PlayArea();
            }
            return PlayArea.instance;
        }

        public constructor() {
            super();
            this.touchEnabled = true;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        protected onAddToStage(e: egret.Event) {
            this.background = new egret.Shape();
            this.background.graphics.beginFill(0x00FFFF);
            this.background.graphics.drawRect(0, 0, Main.getInstance().stage.stageWidth, PlayArea.gridWidth * 8 + PlayArea.reservedH * 2);
            this.background.alpha = 0;
            this.switchTo(DataProvider.getTopTask(), 1);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        /**
         * 切换关卡
         *
         * @param taskNo
         * @param alpha
         */
        public switchTo(taskNo: number, alpha: number): void {
            if (taskNo != this.currentTaskNo) {
                this.currentTaskNo = taskNo;
                this.reset();
            }
            for (let line of this.lines) {
                line.alpha = (alpha - 0.5) * 2;
            }
            for (let dot of this.dots) {
                dot.scaleX = dot.scaleY = alpha;
            }
        }

        /**
         * 重新加载当前关卡
         */
        public reset() {
            this.removeChildren();
            this.activeDot = null;
            this.activeLine = null;
            this.dotRelation = [];
            this.lines = [];
            this.dots = [];
            // 背景
            this.addChild(this.background);
            this.currentTask = PlayArea.tasks[this.currentTaskNo];

            for (let i = 0; i < this.currentTask.length - 1; i++) {
                let line = new Line(0XAAAAAA);
                let [pointStartX, pointStartY] = PlayArea.computeXY(this.currentTask[i]);
                let [pointEndX, pointEndY] = PlayArea.computeXY(this.currentTask[i + 1]);
                line.setPoints(pointStartX, pointStartY, pointEndX, pointEndY);
                this.lines.push(line);
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
                    this.dots.push(dot);
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

        public onTouchBegin(evt: egret.TouchEvent) {
            if (this.touchToStart) {
                Main.getInstance().startTask();
            }
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
                this.touchEnabled = false;
                this.touchChildren = false;
                setTimeout(() => {
                    DataProvider.setTopTask(this.currentTaskNo + 1);
                    this.reset();
                    Main.getInstance().endTask();
                }, 1000);
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
         * 自动播放一次
         */
        public async autoPlay(): Promise<any > {
            let autoLines: Line[] =  [];
            for (let i = 0; i < this.currentTask.length - 1; ++i) {
                let line = new Line();
                [line.x1, line.y1, line.x2, line.y2] = [...PlayArea.computeXY(this.currentTask[i]), ...PlayArea.computeXY(this.currentTask[i + 1])];
                autoLines.push(line);
                this.addChildAt(line, this.getChildIndex(this.dots[0]));
                await line.drawBodyGradually();
            }
            let waitTime = 0;
            let callback = () => {
                waitTime++;
                if (60 === waitTime) {
                    this.dispatchEvent(new egret.Event("WAIT_COMPLETE"));
                    egret.stopTick(callback, this);
                }
                return false;
            };
            egret.startTick(callback, this);
            return new Promise((resolve, reject) => {
                this.addEventListener("WAIT_COMPLETE", () => {
                    for (let i = autoLines.length - 1; i >= 0; --i) {
                        this.removeChild(autoLines.pop());
                    }
                    resolve();
                }, this);
            });
        }
    }
    

    class Dot extends egret.Shape {
        public static bodyR = 26;
        public parent: PlayArea;
        public tablePos: [number, number]; // 棋盘中的位置

        public constructor() {
            super();
            this.drawBody();
            this.touchEnabled = true;
            // this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMove, this); // 点击事件视为TOUCH_MOVE
        }

        public drawBody(): void {
            this.graphics.beginFill(0XFFFFFF);
            this.graphics.drawCircle(0, 0, Dot.bodyR);
            this.graphics.endFill();
        }

        // public onTouchBegin(evt: egret.TouchEvent) {
        //     if (!this.parent.activeDot || this === this.parent.activeDot) {
        //         this.preDrawLine();
        //     }
        // }

        public onTouchMove(evt: egret.TouchEvent) {
            if (!this.parent.activeDot || this === this.parent.activeDot) {
                this.preDrawLine();
                return;
            }
            if (this.isNeighborWith(this.parent.activeDot)) {
                this.parent.drawLineBetween(this.parent.activeDot, this);
                this.preDrawLine();
                return;
            }
        }

        public preDrawLine() {
            this.parent.activeDot = this;
            this.parent.preDrawActiveLine();
        }

        public isNeighborWith(dot: Dot): boolean {
            return this.parent.isNeighbor(this, dot);
        }
    }

    class Line extends egret.Shape {
        public static lineW = 14;
        public x1: number;
        public y1: number;
        public x2: number;
        public y2: number;
        public color: number;

        public constructor(color: number = 0x75BEFF) {
            super();
            this.color = color;
        }

        public setPoints(x1: number, y1: number, x2: number, y2: number) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.drawBody();
        }

        public setPointStart(x1: number, y1: number) {
            this.x1 = x1;
            this.y1 = y1;
        }

        public setPointEnd(x2: number, y2: number) {
            this.x2 = x2;
            this.y2 = y2;
            this.drawBody();
        }

        public drawBody(): void {
            this.graphics.clear();
            this.graphics.lineStyle(Line.lineW, this.color);
            this.graphics.moveTo(this.x1, this.y1);
            this.graphics.lineTo(this.x2, this.y2);
            this.graphics.endFill();
        }

        public async drawBodyGradually() :Promise<any> {
            let speed: number = 4;
            let distance: number = Math.pow(Math.pow(this.y2 - this.y1, 2) + Math.pow(this.x2 - this.x1, 2), 0.5);
            let autoTotal = Math.floor(distance / speed);
            let autoPass = 0;
            let callback = () => {
                let endPoint: number[] = [this.x1 + (this.x2 - this.x1) / autoTotal * autoPass, this.y1 + (this.y2 - this.y1) / autoTotal * autoPass];
                this.graphics.clear();
                this.graphics.lineStyle(Line.lineW, 0x75BEFF);
                this.graphics.moveTo(this.x1, this.y1);
                this.graphics.lineTo(endPoint[0], endPoint[1]);
                this.graphics.endFill();
                autoPass++;
                if (autoPass === autoTotal) {
                    this.dispatchEvent(new egret.Event("LINE_COMPLETE"));
                    egret.stopTick(callback, this);
                }
                return true;
            };
            egret.startTick(callback, this);
            return new Promise((resolve, reject) => {
                this.addEventListener("LINE_COMPLETE", () => {
                    resolve();
                }, this);
            });
        }
    }
}