class ToDoList{
    
    /*
        Takes in a ToDoList model (from the database)
        and allows for controlled local manipulation of User-Vacation-ToDoList info
    */
    
    constructor(toDoList){
        this._toDoListId = toDoList._id;
        this._title = toDoList.title;
        this._tasks = toDoList.tasks;
    }
    
    
    /* Getters and Setters */
    
    get toDoListId() {
        return this._toDoListId;    
    }
    
    get title(){
        return this._title; 
    }
    
    get tasks(){
        return this._tasks; 
    }
    
    get tasksLength() {
        return this._tasks.length;
    }
    
    set toDoListId(toDoListId) {
        this._toDoListId = toDoListId;    
    }
    
    set title(title){
        this._title = title; 
    }
    
    set tasks(tasks) {
        this._tasks = tasks;
    }
    
    
    /* Methods */
    
    getTask(index){
        if(this.tasksLength < 1) {
            return -1;  // No tasks to get
        } else if (index-1 > this.tasksLength) {
            return -1;  // Out of bounds 
        } else {
            return this._tasks[index];
        }
    }
    
    addTask(task){
        var end = this.tasksLength + 1;
        this._tasks[end] = task;
        this._tasks.length += 1; 
    }
    
    deleteTask(index){
        var newTs = []; 
        var count = 0; 
        
        for(var i = 0; i < this.tasksLength; i++){
            if(i != index){
                newTs[count] = this._tasks[i]; 
                count++; 
            }
        }
        this._tasks = newTs;
        return this._tasks;
    }
    
    static createToDoList(title, tasks=[], callback){
      
        // Organize data to be send within a JSON File
        tasks = (tasks == null)? [] : tasks; 
        var sendData = {
            
            'toDoListTitle' : title,
            'tasks' : tasks
        }
        // Sends info to the file that maanges the Database 
        $.ajax({
             
             url : "/toDoList/create", 
             method : 'POST', 
             contentType : 'application/json', 
             data : JSON.parse(sendData)
             
        }).done(function(response){
            
            response = JSON.parse(response);
            if(response.error){
                
                callback(response.error, {});
            }
            else{
                
                callback(null, new ToDoList(response)); 
            }
        }).fail(function(err){
            
            callback("Ajax ToDoList create odj.");
            
        }).always(function(){
            
            console.log("Create CS object ToDoList."); 
        })
    }
    
    
    static updateToDoList(title, tasks=[], callback){
        
         // Organize data to be send within a JSON File
        tasks = (tasks == null)? [] : tasks; 
        var sendData = {
            
            'toDoListTitle' : title,
            'tasks' : tasks
        }
        // Sends info to the file that maanges the Database 
        $.ajax({
             
             url : "/toDoList/create", 
             method : 'POST', 
             contentType : 'application/json', 
             data : JSON.parse(sendData)
             
        }).done(function(response){
            
            response = JSON.parse(response);
            if(response.error){
                
                callback(response.error, {});
            }
            else{
                
                callback(null, new ToDoList(response)); 
            }
        }).fail(function(err){
            
            callback("Ajax ToDoList create odj.");
            
        }).always(function(){
            
            console.log("Create CS object ToDoList."); 
        })
    }
    
}    