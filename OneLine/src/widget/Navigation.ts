namespace Navigation {
    export class Navigation extends egret.DisplayObjectContainer {
        public static focusY: number;
        protected static instance: Navigation;
        protected focus: Focus;
        protected list: List;

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
            this.list.y = Navigation.focusY;
            this.addChild(this.list);
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
        protected listGrids: ListGrid[] = [];

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
            this.alpha = 1 / (Math.abs((this.y - (Navigation.focusY - this.parent.y)) / this.height) + 1);
        }
    }
}