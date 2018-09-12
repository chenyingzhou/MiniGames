namespace ButtonSet {
    export class ButtonSet extends egret.DisplayObjectContainer {
        protected static instance: ButtonSet;
        protected buttons = {
            "start": new Button(Button.START),
            "rank": new Button(Button.RANK),
            "share": new Button(Button.SHARE),
            "reset": new Button(Button.RESET),
            "back": new Button(Button.BACK),
        };

        public static getInstance(): ButtonSet {
            if (!ButtonSet.instance) {
                ButtonSet.instance = new ButtonSet();
            }
            return ButtonSet.instance;
        }

        protected constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        protected onAddToStage(e: egret.Event) {
            this.width = this.stage.stageWidth;
            this.height = 120;
            this.loadCommon();
        }

        public loadCommon() {
            this.scaleX = this.scaleY = 0.8;
            this.buttons.share.x = this.width / 4;
            this.buttons.share.y = this.height / 2;
            this.addChild(this.buttons.share);
            this.buttons.rank.x = this.width / 4 * 2;
            this.buttons.rank.y = this.height / 2;
            this.addChild(this.buttons.rank);
            this.buttons.start.x = this.width / 4 * 3;
            this.buttons.start.y = this.height / 2;
            this.addChild(this.buttons.start)
        }
    }

    class Button extends egret.Sprite {
        public static START: string = "start";
        public static RANK: string = "rank";
        public static SHARE: string = "share";
        public static RESET: string = "reset";
        public static BACK: string = "back";

        public constructor(type: string) {
            super();
            this.touchEnabled = true;
            this.anchorOffsetX = this.anchorOffsetY = 60;
            this.scaleX = this.scaleY = 0.8;
            switch (type) {
                case Button.START:
                    this.drawStart();
                    break;
                case Button.RANK:
                    this.drawRank();
                    break;
                case Button.SHARE:
                    this.drawShare();
                    break;
                case Button.RESET:
                    this.drawReset();
                    break;
                case Button.BACK:
                    this.drawBack();
                    break;
                default:
                    throw new Error("");
            }
        }

        protected drawStart() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 120, 120);
            bg.graphics.endFill();
            this.addChild(bg);

            this.graphics.lineStyle(3, 0xffffff);
            this.graphics.drawCircle(60, 60, 60);

            this.graphics.lineStyle(5, 0xffffff);
            this.graphics.moveTo(105, 60);
            this.graphics.lineTo(37.5, 18.75);
            this.graphics.lineTo(37.5, 101.25);
            this.graphics.lineTo(105, 60);

            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                Main.getInstance().startTask();
            }, this);
        }

        protected drawRank() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 120, 120);
            bg.graphics.endFill();
            this.addChild(bg);

            this.graphics.lineStyle(3, 0xffffff);
            this.graphics.drawCircle(60, 60, 60);

            this.graphics.lineStyle(4, 0xffffff);
            this.graphics.moveTo(93.75, 97.5);
            this.graphics.lineTo(26.25, 97.5);
            this.graphics.lineTo(26.25, 45);
            this.graphics.lineTo(48.75, 45);
            this.graphics.lineTo(48.75, 97.5);
            this.graphics.lineTo(48.75, 22.5);
            this.graphics.lineTo(71.25, 22.7);
            this.graphics.lineTo(71.25, 97.5);
            this.graphics.lineTo(71.25, 60);
            this.graphics.lineTo(93.75, 60);
            this.graphics.lineTo(93.75, 97.5);

            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //TODO: 排行榜
            }, this);
        }

        protected drawShare() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 120, 120);
            bg.graphics.endFill();
            this.addChild(bg);

            this.graphics.lineStyle(3, 0xffffff);
            this.graphics.drawCircle(60, 60, 60);

            this.graphics.lineStyle(10, 0xffffff);
            this.graphics.drawCircle(75, 30, 5);
            this.graphics.drawCircle(22.5, 60, 5);
            this.graphics.drawCircle(75, 90, 5);

            this.graphics.lineStyle(5, 0xffffff);
            this.graphics.moveTo(75, 30);
            this.graphics.lineTo(22.5, 60);
            this.graphics.lineTo(75, 90);

            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //TODO: 分享
            }, this);
        }

        protected drawReset() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 120, 120);
            bg.graphics.endFill();
            this.addChild(bg);

            this.graphics.lineStyle(3, 0xffffff);
            this.graphics.drawCircle(60, 60, 60);

            this.graphics.lineStyle(5, 0xffffff);
            this.graphics.drawArc(60, 60, 35, Math.PI * (-0.5), Math.PI);

            this.graphics.moveTo(17, 71);
            this.graphics.lineTo(25, 60);
            this.graphics.lineTo(35, 68);

            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //TODO: 重新开始
            }, this);
        }

        protected drawBack() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 120, 120);
            bg.graphics.endFill();
            this.addChild(bg);

            this.graphics.lineStyle(3, 0xffffff);
            this.graphics.drawCircle(60, 60, 60);

            this.graphics.lineStyle(5, 0xffffff);
            this.graphics.moveTo(100, 60);
            this.graphics.lineTo(20, 60);
            this.graphics.moveTo(40, 40);
            this.graphics.lineTo(20, 60);
            this.graphics.lineTo(40, 80);

            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //TODO: 返回
            }, this);
        }
    }
}