class BackGround extends egret.Shape {
    public constructor() {
        super();
        this.drawBody();
    }

    public drawBody(): void {
        this.graphics.beginFill(0X333333);
        this.graphics.drawRect(0, 0, Main.getInstance().stage.stageWidth, Main.getInstance().stage.stageHeight);
        this.graphics.endFill();
    }
}
