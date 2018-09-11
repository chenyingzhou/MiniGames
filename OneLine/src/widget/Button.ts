class Button extends egret.Sprite {
    static START = "start";
    private type: string;

    public constructor(type: string) {
        super();
        this.touchEnabled = true;
        this.type = type;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onAddToStage(e: egret.TouchEvent) {
        switch (this.type) {
            case Button.START:
                this.drawStart();
                break;
            default:
                throw new Error("");
        }
    }

    protected drawStart() {
        let bg = new egret.Shape();
        bg.graphics.beginFill(0x000000, 0);
        bg.graphics.drawRect(0, 0, 80, 60);
        bg.graphics.endFill();
        this.addChild(bg);
        this.graphics.lineStyle(2, 0xffffff);
        this.graphics.drawRect(0, 0, 80, 60);
        this.graphics.moveTo(20, 10);
        this.graphics.lineTo(20, 50);
        this.graphics.lineTo(60, 30);
        this.graphics.lineTo(20, 10);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStart, this);
    }

    protected onStart(e: egret.TouchEvent) {
        this.touchEnabled = false;
        Main.getInstance().startTask();
    }
}
