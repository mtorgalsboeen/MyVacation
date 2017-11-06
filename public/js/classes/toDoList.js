class ToDoList{
    
    constructor(title, description, tasks, completed){
        
        let title = title; 
        let desc = description; 
        let tasks = tasks; 
        let completed = completed; 
    }
    get title(){
        return this.title; 
    }
    get desc(){
        return this.desc; 
    }
    get tasks(){
        return this.tasks; 
    }
    get completed(){
        return this.completed; 
    }
    
    set title(title){
        this.title = title; 
    }
    set desc(description){
        this.desc = description;
    }
    set completed(completed){
        this.completed = completed;
    }
    getTask(index){
        return this.tasks[index];
    }
    addTask(task){
        var end = this.tasks.length + 1;
        this.tasks[end] = task;
        this.tasks.length += 1; 
        
    }
    deleteTask(index){
        
        var newTs = []; 
        var count = 0; 
        
        for(var i = 0; i < this.tasks.length; i++){
            
            if(i != index){
                
                newTs[count] = this.tasks[i]; 
                count++; 
            }
        }
        this.tasks = newTs;
        return this.tasks;
    }
    
}    