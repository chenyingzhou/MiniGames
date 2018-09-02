class Line extends egret.Shape {
    public static lineW = 14;
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    public color: number;

    public constructor(color: number = 0XDDDDDD) {
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
}