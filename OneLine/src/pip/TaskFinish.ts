namespace Pip {
    export class TaskFinish extends egret.DisplayObjectContainer {
        protected static instance: Scene.Play;
        protected taskSwitch: TaskSwitch;
        protected passImg: egret.Bitmap;
        protected backGround: egret.Shape;

        public static getInstance() {
            if (!Pip.TaskFinish.instance) {
                Pip.TaskFinish.instance = new Pip.TaskFinish();
            }
            return Pip.TaskFinish.instance;
        }

        protected constructor() {
            super();
            this.backGround = new egret.Shape();
            this.backGround.graphics.beginFill(0XFF0000);
            this.backGround.graphics.drawRect(0, 0, Main.getInstance().stage.stageWidth, Main.getInstance().stage.stageHeight);
            this.backGround.graphics.endFill();
            this.backGround.alpha = 0.5;

            this.passImg = new egret.Bitmap();
            this.passImg.texture = RES.getRes("pass_png");
            this.passImg.height = 400;
            this.passImg.width = 400;
            this.passImg.x = 120;
            this.passImg.y = 300;

            this.taskSwitch = new TaskSwitch();
            this.taskSwitch.x = 270;
            this.taskSwitch.y = 550;

            this.addChild(this.backGround);
            this.addChild(this.passImg);
            this.addChild(this.taskSwitch);

            [this.anchorOffsetX, this.anchorOffsetY] = [Main.getInstance().stage.stageWidth / 2, Main.getInstance().stage.stageHeight / 2];
            [this.x, this.y] = [this.anchorOffsetX, this.anchorOffsetY];
        }

        public show() {
            this.scaleX = this.scaleY = 0;
            let game = Main.getInstance();
            game.addChild(this);
            egret.startTick(this.animation, this);
        }

        public animation(time: number) {
            if (this.parent) {
                this.scaleX += 0.05;
                this.scaleY += 0.05;
            } else {
                this.scaleX -= 0.05;
                this.scaleY -= 0.05;
            }
            if (this.scaleX <= 0 ||this.scaleX >= 1) {
                egret.stopTick(this.animation, this);
            }
            return true;
        }

        public hide() {
            let game = Main.getInstance();
            game.removeChild(this);
        }
    }
}
