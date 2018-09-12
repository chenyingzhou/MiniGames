namespace Navigation {
    export class Navigation extends egret.DisplayObjectContainer {
        public static focusY: number;
        protected static instance: Navigation;
        protected focus: Focus;
        protected list: List;
        protected touchArea: TouchArea;

        public static getInstance(): Navigation {
            if (!Navigation.instance) {
                Navigation.instance = new Navigation();
            }
            return Navigation.instance;
        }

        protected constructor() {
            super();
            let game = Main.getInstance();
            let stageWidth = game.stage.stageWidth;
            let stageHeight = game.stage.stageHeight;
            this.width = 130;
            this.x = stageWidth - 130;
            Navigation.focusY = stageHeight / 5 * 3;

            let bg = new BackGround();
            this.addChild(bg);

            this.focus = new Focus();
            this.focus.x = 105;
            this.focus.y = Navigation.focusY;
            this.addChild(this.focus);

            this.list = new List();
            this.list.x = 65;
            this.list.y = Navigation.focusY - ListGrid.height * DataProvider.getTopTask();
            this.addChild(this.list);

            this.touchArea = new TouchArea();
            this.addChild(this.touchArea);
        }

        public scrollList(distance: number) {
            this.list.y += distance;
            if (this.list.y > Navigation.focusY) {
                this.list.y = Navigation.focusY;
            }
            if (this.list.y < Navigation.focusY - ListGrid.height * DataProvider.getTopTask()) {
                this.list.y = Navigation.focusY - ListGrid.height * DataProvider.getTopTask();
            }
            let currentTaskNo: number = this.getCurrentTaskNo();
            let visibleMin = Math.max(0, currentTaskNo - 7);
            let visibleMax = Math.min(99, currentTaskNo + 5);
            for (let i = visibleMin; i <= visibleMax; i++) {
                this.list.listGrids[i].updateAlpha();
            }
            PlayArea.PlayArea.getInstance().switchTo(currentTaskNo, this.getPreviewSize());
        }

        public scrollAdjust() {
            egret.startTick(this.onAdjust, this);
        }

        protected onAdjust() {
            let currentTaskNo: number = this.getCurrentTaskNo();
            let targetY = Navigation.focusY - ListGrid.height * currentTaskNo;
            let step: number = 1;
            let direction = targetY - this.list.y > 0 ? 1 : -1;
            this.scrollList(step * direction);
            if (Math.abs(targetY - this.list.y) <= step) {
                let distance = targetY - this.list.y;
                this.scrollList(distance);
                egret.stopTick(this.onAdjust, this);
            }
            return true;
        }

        /**
         * 获取当前任务序号
         */
        public getCurrentTaskNo(): number {
            let deltaH = Navigation.focusY - this.list.y;
            return Math.round(deltaH / ListGrid.height);
        }

        /**
         * 获取当前预览图的缩放比例
         */
        public getPreviewSize() {
            let deltaH = Navigation.focusY - this.list.y;
            let taskNo = Math.round(deltaH / ListGrid.height);
            return 1 - Math.abs(taskNo - deltaH / ListGrid.height) * 2
        }
    }

    class Focus extends egret.Shape {
        public constructor() {
            super();
            this.drawBody();
        }

        public drawBody() {
            this.graphics.beginFill(0xffffff, 0.8);
            this.graphics.lineTo(18, -24);
            this.graphics.lineTo(18, 24);
            this.graphics.lineTo(0, 0);
            this.$graphics.endFill();
        }
    }

    class List extends egret.DisplayObjectContainer {
        public listGrids: ListGrid[] = [];

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        protected onAddToStage(e: egret.Event) {
            for (let i = 0; i < 100; i++) {
                let listGrid = new ListGrid(i.toString());
                listGrid.y = ListGrid.height * this.listGrids.length;
                this.listGrids.push(listGrid);
                this.addChild(listGrid);
            }
        }
    }

    class ListGrid extends egret.Sprite {
        public static height: number = 110;
        protected text: string;
        protected textField: egret.TextField;

        public constructor(text: string) {
            super();
            this.text = text;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        protected onAddToStage(e: egret.Event) {
            this.height = ListGrid.height;
            this.graphics.lineStyle(2, 0xffffff);
            this.graphics.drawRect(-30, -20, 60, 40);
            this.textField = new egret.TextField();
            this.textField.text = this.text;
            this.textField.anchorOffsetX = this.textField.width / 2;
            this.textField.anchorOffsetY = this.textField.height / 2;
            this.addChild(this.textField);
            this.updateAlpha();
        }

        public updateAlpha() {
            if (parseInt(this.text) > DataProvider.getTopTask()) {
                this.alpha = 0.1;
            } else {
                this.alpha = 4 / (Math.abs((this.y - (Navigation.focusY - this.parent.y)) / this.height) + 4);
            }
        }
    }

    class TouchArea extends egret.Shape {
        protected touchY: number = 0;
        protected speedY: number = 0;
        protected reduceCount: number = 0;

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        protected onAddToStage(e: egret.Event) {
            this.width = this.parent.width;
            this.height = this.parent.height;
            this.graphics.beginFill(0x000000, 0);
            this.graphics.drawRect(0, 0, this.width, this.height);
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        }

        protected onTouchBegin(e: egret.TouchEvent) {
            this.touchY = e.stageY;
            this.speedY = 0;
        }

        protected onTouchMove(e: egret.TouchEvent) {
            if (this.touchY) {
                let deltaY: number = e.localY - this.touchY;
                Navigation.getInstance().scrollList(deltaY);
                if (Math.abs(this.speedY) > Math.abs(deltaY) && this.reduceCount < 6) {
                    this.reduceCount++;
                } else {
                    this.speedY = deltaY;
                    this.reduceCount = 0;
                }
            }
            this.touchY = e.stageY;
        }

        protected onTouchEnd(e: egret.TouchEvent) {
            egret.startTick(this.onInertiaMove, this);
        }

        protected onInertiaMove() {
            let acceleration: number = 1;
            if (this.speedY > 0) {
                this.speedY -= acceleration;
            } else {
                this.speedY += acceleration;
            }
            if (Math.abs(this.speedY) <= acceleration) {
                this.speedY = 0;
                egret.stopTick(this.onInertiaMove, this);
                Navigation.getInstance().scrollAdjust();
            }
            Navigation.getInstance().scrollList(this.speedY);
            return true;
        }
    }
}