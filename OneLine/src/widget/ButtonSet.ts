namespace ButtonSet {
    export class ButtonSet extends egret.DisplayObjectContainer {
        protected static instance: ButtonSet;
        protected buttons = {
            "start": new Button(Button.START),
            "rank": new Button(Button.RANK),
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
            this.buttons.rank.x = this.width / 3;
            this.buttons.rank.y = this.height / 2;
            this.addChild(this.buttons.rank);
            this.buttons.start.x = this.width / 3 * 2;
            this.buttons.start.y = this.height / 2;
            this.addChild(this.buttons.start)
        }
    }

    class Button extends egret.Sprite {
        public static START: string = "start";
        public static RANK: string = "rank";
        public static SHARE: string = "share";

        public constructor(type: string) {
            super();
            this.touchEnabled = true;
            this.anchorOffsetX = this.anchorOffsetY = 60;
            switch (type) {
                case Button.START:
                    this.drawStart();
                    break;
                case Button.RANK:
                    this.drawRank();
                    break;
                case Button.SHARE:
                    // this.drawShare();
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
            this.graphics.moveTo(93.75, 97.5);
            this.graphics.lineTo(26.25, 97.5);
            this.graphics.lineTo(26.25, 45);
            this.graphics.lineTo(48.75, 45);
            this.graphics.moveTo(48.75, 97.5);
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
    }
}