class Task{
    
    /*
        Takes in a Task model (from the database)
        and allows for controlled local manipulation of User-Vacation-ToDoList-Task info
    */
    
    constructor(task){
        this._taskId = task._id;
        this._taskTitle = task.taskTitle;
        this._completed = task.completed;
    }
    
    /* Getters and Setters */
    
    get taskId() {
        return this._taskId;
    }
    
    get taskTitle(){
        return this._taskTitle;
    }
    
    get completed(){
        return this._completed;
    }
    
    set taskId(taskId) {
        this._taskId = taskId;
    }
    
    set taskTitle(taskTitle){
        this._taskTitle = taskTitle;
    }
    
    set completed(completed){
        this._completed = completed;
    }
    
    
    /* Methods */
    
    toggleComplete(){
        this.completed = !(this.completed);
    }
    
}