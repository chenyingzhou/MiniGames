namespace Scene {
    export class Play extends egret.DisplayObjectContainer {
        protected static instance: Scene.Play;

        public static getInstance() {
            if (!Scene.Play.instance) {
                Scene.Play.instance = new Scene.Play();
            }
            return Scene.Play.instance;
        }

        protected constructor() {
            super();
            let game = Main.getInstance();
            if (!game.playArea) {
                game.playArea = new PlayArea();
                game.playArea.x = (game.stage.stageWidth - game.playArea.width) / 2;
            }
            this.addChild(game.playArea);
        }

        public show()
        {
            let game = Main.getInstance();
            game.removeChildren();
            game.addChild(game.backGround);
            game.addChild(this);
        }
    }
}
