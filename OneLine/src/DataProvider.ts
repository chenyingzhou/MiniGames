class DataProvider {
    protected static topTask: number = 26;
    protected static tasks: [number, number][][] = [
        [[4, 1], [1, 7], [7, 7], [4, 1]],
        [[2, 2], [2, 6], [6, 6], [6, 2], [2, 2]],
        [[3, 6], [1, 5], [4, 1], [3, 6], [5, 6], [4, 1], [7, 5], [5, 6]],
        [[4, 2], [1, 4], [7, 4], [4, 2], [3, 6], [5, 6], [4, 2]],
    ];

    public static getTasks(): [number, number][][] {
        let tasks: [number, number][][] = [];
        for (let i = 0; i < 100; i++) {
            tasks.push(DataProvider.tasks[i % 4]);
        }
        return tasks;
    }

    public static getTopTask() {
        return DataProvider.topTask;
    }

    public static setTopTask(passTask: number) {
        DataProvider.topTask = Math.max(passTask, DataProvider.topTask);
    }
}