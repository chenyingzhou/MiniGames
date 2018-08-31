class TaskSwitch extends egret.Sprite {
    private taskNo: number;

    public constructor(taskNo = 0) {
        super();
        this.taskNo = taskNo;
        this.graphics.beginFill(0XFF00FF);
        this.graphics.drawRect(0, 0, 100, 60);
        this.graphics.endFill();
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTo, this);

        let text: egret.TextField = new egret.TextField();
        text.text = "下一关";
		text.fontFamily = "微软雅黑";
		text.y = 10;
		text.textColor = 0Xffffff;
        this.addChild(text);
    }

    private switchTo(e: egret.Event) {
        Main.loadScene("play");
        Main.getInstance().playArea.switchToNext();
    }
}
