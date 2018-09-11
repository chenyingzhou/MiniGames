import tr = egret.sys.tr;

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
        let playArea = PlayArea.PlayArea.getInstance();
        playArea.scaleX = playArea.scaleY = 0.8;
        playArea.touchChildren = false;
        playArea.touchEnabled = false;
        this.addChild(playArea);
        this.addChild(Navigation.Navigation.getInstance());

        let startButton = new Button(Button.START);
        startButton.x = 220;
        startButton.y = 640;
        this.addChild(startButton);
    }

    public startTask() {
        let navigation = Navigation.Navigation.getInstance();
        let playArea = PlayArea.PlayArea.getInstance();
        navigation.touchChildren = navigation.touchEnabled = false;
        playArea.touchChildren = playArea.touchEnabled = false;
        egret.startTick(this.onStartTask, this);
    }

    protected onStartTask() {
        Navigation.Navigation.getInstance().x += 7;
        let playArea = PlayArea.PlayArea.getInstance();
        playArea.scaleX += 0.01;
        playArea.scaleY += 0.01;
        if (playArea.scaleX >= 1) {
            playArea.scaleX = 1;
            playArea.scaleY = 1;
            playArea.touchEnabled = true;
            playArea.touchChildren = true;
            egret.stopTick(this.onStartTask, this);
        }
        return true;
    }
}