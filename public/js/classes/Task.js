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
    
    static createTask(taskTitle, completed=false, callback){
        
        var sendData = {
            'taskTitle' : taskTitle, 
            'completed' : completed
        };
        
        $.ajax({
            url : '/tasks/create', 
            method : 'POST',
            contentType : 'application/json',
            data : JSON.stringify(sendData)
            
        }).done(function(response){
            
            response = JSON.parse(response);
            if(response.error){
                callback(response.error, {}); 
            }
            else{
                callback(null, new Task(response));
            }
            
        }).fail(function(err){
            callback("Ajax failure", {});
            
        }).always(function(){
            console.log("Created CS Task obj.");
        });
        
    }
    
    static updateTask(vacationId, toDoListId, taskTitle, completed=null, callback){
        
        var sendData = {
            
            'vacationID' : vacationId, 
            'toDoListId' : toDoListId, 
            'taskTitle' : taskTitle, 
            'completed' : completed
        }
        
        $.ajax({
            
            url : '/tasks/update', 
            method : 'POST', 
            contentType : 'application/json', 
            data : JSON.parse(sendData)
            
        }).done(function(response){
            
            response = JSON.parse(response); 
            if(response.error){
                callback(response.error, {}); 
            }
            else{
                // replace the obj all together  
                callback(null, new Task(response)); 
            }
            
        }).fail(function(err){
            
            callback("Ajax Task update failure", {}); 
        }).always(function(){
            
            console.log("Update CS object Task obj."); 
        })
    }
    
    
   
}