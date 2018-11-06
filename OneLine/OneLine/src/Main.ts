class Main extends egret.DisplayObjectContainer {
    protected static instance: Main;
    public backGround: BackGround;
    public autoArea: PlayArea.PlayArea;
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
        this.autoArea = new PlayArea.PlayArea();
        this.playArea = new PlayArea.PlayArea();
        this.navigation = Navigation.Navigation.getInstance();
        this.buttonSet = ButtonSet.ButtonSet.getInstance();
        this.loadCover();
        // this.playArea.scaleX = this.playArea.scaleY = 0.8;
        // this.playArea.touchChildren = false;
        // this.playArea.touchEnabled = false;
        // this.addChild(this.playArea);
        // this.addChild(this.navigation);
        // this.buttonSet.y = 640;
        // this.addChild(this.buttonSet);
    }

    public async loadCover() {
        this.addChild(this.backGround);
        this.addChild(this.autoArea);
        this.autoArea.touchEnabled = false;
        this.autoArea.x = this.stage.stageWidth * 0.1;
        this.autoArea.scaleX = this.autoArea.scaleY = 0.8;
        let beginButton = this.buttonSet.buttons.begin;
        this.addChild(beginButton);
        beginButton.scaleX = beginButton.scaleY = 1.5;
        beginButton.x = this.stage.stageWidth / 2;
        beginButton.y = this.stage.stageHeight / 5 * 3;
        this.addChild(this.buttonSet);
        this.buttonSet.loadCover();
        while (PlayArea.PlayArea.isAutoPlay) {
            await this.autoArea.autoPlay();
        }
    }

    public loadBegin() {
        PlayArea.PlayArea.isAutoPlay = false;

    }

    public startTask() {
        this.navigation.touchChildren = this.navigation.touchEnabled = false;
        this.playArea.touchChildren = this.playArea.touchEnabled = false;
        this.buttonSet.touchChildren = this.buttonSet.touchEnabled = false;
        this.buttonSet.loadStart();
        let onStartTask = () => {
            this.navigation.x += 7;
            this.playArea.scaleX += 0.01;
            this.playArea.scaleY += 0.01;
            if (this.playArea.scaleX >= 1) {
                this.playArea.scaleX = 1;
                this.playArea.scaleY = 1;
                this.playArea.touchChildren = this.playArea.touchEnabled = true;
                this.buttonSet.touchChildren = this.buttonSet.touchEnabled = true;
                egret.stopTick(onStartTask, this);
            }
            return true;
        };
        egret.startTick(onStartTask, this);
    }

    public endTask(pass: boolean = true) {
        this.navigation.touchChildren = this.navigation.touchEnabled = false;
        this.playArea.touchChildren = this.playArea.touchEnabled = false;
        this.buttonSet.touchChildren = this.buttonSet.touchEnabled = false;
        this.buttonSet.loadCommon();
        let onEndTask = () => {
            this.navigation.x -= 7;
            this.playArea.scaleX -= 0.01;
            this.playArea.scaleY -= 0.01;
            if (this.playArea.scaleX <= 0.8) {
                this.playArea.scaleX = 0.8;
                this.playArea.scaleY = 0.8;
                this.navigation.touchChildren = this.navigation.touchEnabled = true;
                this.buttonSet.touchChildren = this.buttonSet.touchEnabled = true;
                if (pass) {  // 过关则切换到下一关
                    setTimeout(() => {
                        this.navigation.scrollToNext();
                    }, 200);
                }
                egret.stopTick(onEndTask, this);
            }
            return true;
        };
        egret.startTick(onEndTask, this);
    }
}