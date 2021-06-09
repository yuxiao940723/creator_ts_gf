

interface Task {
    func:Function,
    resolve:Function,
}

const OtherProgressSpent = 2;           //留给除cocos的mainloop外其他进程的时间

class TaskDispatcher {

    tasks:Task[] = [];

    constructor() {
        
    }

    init() {
        // let schedule = cc.director.getScheduler();
        // schedule.enableForTarget(this);
        // schedule.schedule(this.update, this, 0);
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.update, this);
    }

    update(dt) {
        let len = this.tasks.length;
        if (len === 0) {
            return ;
        }
        let lastUpdate = cc.director._lastUpdate;
        let frameTime = 1000.0/cc.game.getFrameRate();
        let task = null;
        while (this.tasks.length > 0) {
            let now = performance.now();
            if (CC_DEBUG && task && now - lastUpdate > frameTime) {
                console.warn("TaskDispatcher: "+task.func.name + " spent a lot of time");
                break;
            }
            if (now - lastUpdate >= frameTime-OtherProgressSpent) {
                break ;
            }
            task = this.tasks.shift();
            task.resolve(task.func());
        }
    }

    dispatch(func:Function, idx?:number) {
        return new Promise((resolve, reject)=>{
            let task:Task = {func, resolve};
            if (typeof idx === 'number'  && idx < this.tasks.length) {
                this.tasks.splice(idx, 0, task);
            } else {
                this.tasks.push(task);
            }
        });
    }

}

export default new TaskDispatcher();
