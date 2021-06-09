import TaskDispatcher from "./TaskDispatcher";

cc.game.on(cc.game.EVENT_ENGINE_INITED, ()=>{
    TaskDispatcher.init();
});

