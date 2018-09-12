namespace ButtonSet {
    export class ButtonSet extends egret.DisplayObjectContainer {
        protected static instance: ButtonSet;
        protected buttons = {
            "start": new Button(Button.START)
        };

        public static getInstance(): ButtonSet {
            if (!ButtonSet.instance) {
                ButtonSet.instance = new ButtonSet();
            }
            return ButtonSet.instance;
        }

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        protected onAddToStage(e: egret.Event) {
            this.width = this.stage.stageWidth - 130;
            this.height = 80;
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 1);
            bg.graphics.drawRect(0, 0, this.width, this.height);
            bg.graphics.endFill();
            this.addChild(bg);
            this.buttons.start.x = this.width / 2;
            this.buttons.start.y = this.height / 2;
            this.addChild(this.buttons.start)
        }
    }

    class Button extends egret.Sprite {
        public static START: string = "start";

        public constructor(type: string) {
            super();
            this.touchEnabled = true;
            this.anchorOffsetX = this.anchorOffsetY = 40;
            switch (type) {
                case Button.START:
                    this.drawStart();
                    break;
                default:
                    throw new Error("");
            }
        }

        protected drawStart() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 80, 80);
            bg.graphics.endFill();
            this.addChild(bg);
            this.graphics.lineStyle(2, 0xffffff);
            this.graphics.drawCircle(40, 40, 40);
            this.graphics.moveTo(60, 40);
            this.graphics.lineTo(30, 26);
            this.graphics.lineTo(30, 54);
            this.graphics.lineTo(60, 40);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStart, this);
        }

        protected onStart(e: egret.TouchEvent) {
            this.touchEnabled = false;
            Main.getInstance().startTask();
        }
    }
}