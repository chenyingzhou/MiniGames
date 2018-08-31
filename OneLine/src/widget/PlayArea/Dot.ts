class Dot extends egret.Shape {
    public static bodyR = 26;
    public parent: PlayArea;
    public tablePos: [number, number]; // 棋盘中的位置

    public constructor() {
        super();
        this.drawBody();
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMove,this); // 点击事件视为TOUCH_MOVE
    }

    public drawBody(): void {
        this.graphics.beginFill(0XFFFFFF);
        this.graphics.drawCircle(0, 0, Dot.bodyR);
        this.graphics.endFill();
    }

    public onTouchBegin(evt: egret.TouchEvent) {
        if (!this.parent.activeDot || this === this.parent.activeDot) {
            this.preDrawLine();
        }
    }

    public onTouchMove(evt: egret.TouchEvent) {
        if (this.isNeighborWith(this.parent.activeDot)) {
            this.parent.drawLineBetween(this.parent.activeDot, this);
            this.preDrawLine();
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
