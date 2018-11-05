class BackGround extends egret.Sprite {
    private img: egret.Bitmap;
    public constructor() {
        super();
        this.drawBody();
    }

    public drawBody(): void {
        let game = Main.getInstance();
        let stageWidth: number = game.stage.stageWidth;
        let stageHeight: number = game.stage.stageHeight;
        let img: egret.Bitmap = new egret.Bitmap();
        img.texture = RES.getRes("cover_png");
        this.width = img.width = stageWidth;
        this.height = img.height = stageHeight;
        this.img = img;
        this.addChild(this.img);
    }
}
