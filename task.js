class Task{
    constructor(){
        this.title = "TestVacation";
        this.when = "Nov.9, 2017";
        this.where = "Mexico";
        this.details = "Going for a week";
        this.completed = false;
    }
    
    //Getter
    get title(){
        return this.title;
    }
    get when(){
        return this.when;
    }
    get where(){
        return this.where;
    }
    get details(){
        return this.details;
    }
    get completed(){
        return this.completed;
    }
    
    //Setter
    set title(name){
        this.title = name;
    }
    set when(date){
        this.when = date;
    }
    set where(location){
        this.where = location;
    }
    set details(info)
    {
        this.details = info;
    }
    set completed(done){
        this.completed = done;
    }
    
    //Method
    toggleComplete(){
        if(this.completed)
        {
            this.completed(true);
        }
    }
    
}