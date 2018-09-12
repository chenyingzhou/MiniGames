class Main extends egret.DisplayObjectContainer {
    protected static instance: Main;
    public backGround: BackGround;
    public playArea: PlayArea.PlayArea;
    public navigation: Navigation.Navigation;
    public buttonSet: ButtonSet.ButtonSet;

    public constructor() {
        super();
        Main.instance = this;
        this.touchEnabled = true;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public static getInstance(): Main {
        return Main.instance;
    }

    private static async loadRes() {
        await RES.loadConfig("resource/default.res.json", "resource/");
        await RES.loadGroup("preload");
    }

    private async onAddToStage(event: egret.Event) {
        await Main.loadRes();
        this.backGround = new BackGround();
        this.playArea = PlayArea.PlayArea.getInstance();
        this.navigation = Navigation.Navigation.getInstance();
        this.buttonSet = ButtonSet.ButtonSet.getInstance();
        this.addChild(this.backGround);
        this.playArea.scaleX = this.playArea.scaleY = 0.8;
        this.playArea.touchChildren = false;
        this.playArea.touchEnabled = false;
        this.addChild(this.playArea);
        this.addChild(this.navigation);
        this.buttonSet.y = 640;
        this.addChild(this.buttonSet);
    }

    public startTask() {
        this.navigation.touchChildren = this.navigation.touchEnabled = false;
        this.playArea.touchChildren = this.playArea.touchEnabled = false;
        egret.startTick(this.onStartTask, this);
    }

    protected onStartTask() {
        this.navigation.x += 7;
        this.playArea.scaleX += 0.01;
        this.playArea.scaleY += 0.01;
        if (this.playArea.scaleX >= 1) {
            this.playArea.scaleX = 1;
            this.playArea.scaleY = 1;
            this.playArea.touchEnabled = true;
            this.playArea.touchChildren = true;
            egret.stopTick(this.onStartTask, this);
        }
        return true;
    }
}