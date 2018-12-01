namespace ButtonSet {
    export class ButtonSet extends egret.DisplayObjectContainer {
        protected static instance: ButtonSet;
        protected currentScene: string;
        public buttons = {
            "begin": new Button(Button.BEGIN),
            "start": new Button(Button.START),
            "rank": new Button(Button.RANK),
            "music": new Button(Button.MUSIC),
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
            // this.loadCover();
        }

        public loadCover() {
            this.removeChildren();
            this.y = this.stage.stageHeight / 5 * 4;
            this.buttons.share.x = this.width / 3;
            this.buttons.share.y = this.height / 2;
            this.addChild(this.buttons.share);
            this.buttons.music.x = this.width / 3 * 2;
            this.buttons.music.y = this.height / 2;
            this.addChild(this.buttons.music);
        }

        public loadCommon(animation: boolean = true) {
            let load = () => {
                this.removeChildren();
                this.buttons.share.x = this.width / 3;
                this.buttons.share.y = this.height / 2;
                this.addChild(this.buttons.share);
                this.buttons.start.x = this.width / 3 * 2;
                this.buttons.start.y = this.height / 2;
                this.addChild(this.buttons.start);
            };
            let onAnimationOut = () => {
                if (this.alpha > 0) {
                    this.scaleX -= 0.01;
                    this.scaleY -= 0.01;
                    this.alpha -= 0.1;
                } else {
                    this.alpha = 0;
                    this.currentScene = "common";
                    load();
                    egret.stopTick(onAnimationOut, this);
                }
                return true;
            };
            let onAnimationIn = () => {
                if ("common" != this.currentScene) {
                    return false;
                }
                if (this.alpha < 1) {
                    this.scaleX -= 0.01;
                    this.scaleY -= 0.01;
                    this.alpha += 0.1;
                } else {
                    this.scaleX = this.scaleY = 0.8;
                    this.alpha = 1;
                    this.currentScene = "";
                    egret.stopTick(onAnimationIn, this);
                }
                return true;
            };

            if (!animation) {
                this.scaleX = this.scaleY = 0.8;
                this.alpha = 1;
                load();
            } else {
                egret.startTick(onAnimationOut, this);
                egret.startTick(onAnimationIn, this);
            }
        }

        public loadStart(animation: boolean = true) {
            let load = () => {
                this.removeChildren();
                this.buttons.share.x = this.width / 4;
                this.buttons.share.y = this.height / 2;
                this.addChild(this.buttons.share);
                this.buttons.reset.x = this.width / 4 * 2;
                this.buttons.reset.y = this.height / 2;
                this.addChild(this.buttons.reset);
                this.buttons.back.x = this.width / 4 * 3;
                this.buttons.back.y = this.height / 2;
                this.addChild(this.buttons.back);
            };
            let onAnimationOut = () => {
                if (this.alpha > 0) {
                    this.scaleX += 0.01;
                    this.scaleY += 0.01;
                    this.alpha -= 0.1;
                } else {
                    this.alpha = 0;
                    this.currentScene = "start";
                    load();
                    egret.stopTick(onAnimationOut, this);
                }
                return true;
            };
            let onAnimationIn = () => {
                if ("start" != this.currentScene) {
                    return false;
                }
                if (this.alpha < 1) {
                    this.scaleX += 0.01;
                    this.scaleY += 0.01;
                    this.alpha += 0.1;
                } else {
                    this.scaleX = this.scaleY = 1;
                    this.alpha = 1;
                    this.currentScene = "";
                    egret.stopTick(onAnimationIn, this);
                }
                return true;
            };

            if (!animation) {
                this.scaleX = this.scaleY = 1;
                this.alpha = 1;
                load();
            } else {
                egret.startTick(onAnimationOut, this);
                egret.startTick(onAnimationIn, this);
            }
        }
    }

    class Button extends egret.Sprite {
        public static BEGIN: string = "begin";
        public static START: string = "start";
        public static RANK: string = "rank";
        public static SHARE: string = "music";
        public static MUSIC: string = "share";
        public static RESET: string = "reset";
        public static BACK: string = "back";

        public constructor(type: string) {
            super();
            this.touchEnabled = true;
            this.anchorOffsetX = this.anchorOffsetY = 60;
            this.scaleX = this.scaleY = 0.8;
            switch (type) {
                case Button.BEGIN:
                    this.drawBegin();
                    break;
                case Button.START:
                    this.drawStart();
                    break;
                case Button.RANK:
                    this.drawRank();
                    break;
                case Button.MUSIC:
                    this.drawMusic();
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

        protected drawBegin() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 120, 120);
            bg.graphics.endFill();
            this.addChild(bg);

            this.graphics.lineStyle(3, 0xffffff);
            this.graphics.drawCircle(60, 60, 60);

            let img: egret.Bitmap = new egret.Bitmap();
            img.texture = RES.getRes("play_png");
            img.width = 60;
            img.height = 80;
            img.x = 35;
            img.y = 20;
            this.addChild(img);

            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                Main.getInstance().loadBegin();
            }, this);
        }

        protected drawStart() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 120, 120);
            bg.graphics.endFill();
            this.addChild(bg);

            this.graphics.beginFill(0x75BEFF, 0.7);
            this.graphics.lineStyle(3, 0x75BEFF);
            this.graphics.drawCircle(60, 60, 60);
            this.graphics.endFill();

            let img: egret.Bitmap = new egret.Bitmap();
            img.texture = RES.getRes("play_png");
            img.width = 60;
            img.height = 80;
            img.x = 35;
            img.y = 20;
            this.addChild(img);

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

            this.graphics.beginFill(0x75BEFF, 0.7);
            this.graphics.lineStyle(3, 0x75BEFF);
            this.graphics.drawCircle(60, 60, 60);
            this.graphics.endFill();

            let img: egret.Bitmap = new egret.Bitmap();
            img.texture = RES.getRes("rank_png");
            img.width = img.height = 80;
            img.x = img.y = 20;
            this.addChild(img);

            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                //TODO: 排行榜
            }, this);
        }

        protected drawMusic() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 120, 120);
            bg.graphics.endFill();
            this.addChild(bg);

            this.graphics.beginFill(0x75BEFF, 0.7);
            this.graphics.lineStyle(3, 0x75BEFF);
            this.graphics.drawCircle(60, 60, 60);
            this.graphics.endFill();

            let img: egret.Bitmap = new egret.Bitmap();
            img.texture = RES.getRes("music_png");
            img.width = img.height = 80;
            img.x = img.y = 20;
            this.addChild(img);

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

            this.graphics.beginFill(0x75BEFF, 0.7);
            this.graphics.lineStyle(3, 0x75BEFF);
            this.graphics.drawCircle(60, 60, 60);
            this.graphics.endFill();

            let img: egret.Bitmap = new egret.Bitmap();
            img.texture = RES.getRes("share_png");
            img.width = img.height = 80;
            img.x = img.y = 20;
            this.addChild(img);

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

            this.graphics.beginFill(0x75BEFF, 0.7);
            this.graphics.lineStyle(3, 0x75BEFF);
            this.graphics.drawCircle(60, 60, 60);
            this.graphics.endFill();

            this.graphics.lineStyle(5, 0xffffff);
            this.graphics.drawArc(60, 60, 35, Math.PI * (-0.5), Math.PI);

            this.graphics.moveTo(17, 71);
            this.graphics.lineTo(25, 60);
            this.graphics.lineTo(35, 68);

            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                PlayArea.PlayArea.getInstance().reset();
            }, this);
        }

        protected drawBack() {
            let bg = new egret.Shape();
            bg.graphics.beginFill(0x000000, 0);
            bg.graphics.drawRect(0, 0, 120, 120);
            bg.graphics.endFill();
            this.addChild(bg);

            this.graphics.beginFill(0x75BEFF, 0.7);
            this.graphics.lineStyle(3, 0x75BEFF);
            this.graphics.drawCircle(60, 60, 60);
            this.graphics.endFill();

            this.graphics.lineStyle(5, 0xffffff);
            this.graphics.moveTo(100, 60);
            this.graphics.lineTo(20, 60);
            this.graphics.moveTo(40, 40);
            this.graphics.lineTo(20, 60);
            this.graphics.lineTo(40, 80);

            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                PlayArea.PlayArea.getInstance().reset();
                Main.getInstance().endTask(false);
            }, this);
        }
    }
}