class Main extends egret.DisplayObjectContainer {
    protected static instance: Main;
    public backGround: BackGround;
    public playArea: PlayArea.PlayArea;

    public constructor() {
        super();
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
        Main.instance = this;
        await Main.loadRes();
        this.backGround = new BackGround();
        this.addChild(this.backGround);
        this.addChild(Navigation.Navigation.getInstance());
        this.addChild(PlayArea.PlayArea.getInstance());
    }
}