class Vacation{
    
    /*
        Takes in a Vacation model (from the database)
        and allows for controlled local manipulation of User-Vacation info
    */
    
    constructor(vacation){
        this._vacationId = vacation._id;
        this._vacationTitle = vacation.vacationTitle;
        this._locations = vacation.locations;
        this._toDoLists = vacation.toDoLists;
    }
    
    
    /* Getters and Setters */
    
    get vacationId() {
        return this._vacationId;
    }
    
    get vacationTitle() {
        return this._vacationTitle;
    }
    
    get locations() {
        return this._locations;
    }
    
    get toDoLists() {
        return this._toDoLists;
    }
    
    get locationsLength() {
        return this._locations.length;
    }
    
    get toDoListsLength() {
        return this._toDoLists.length;
    }
    
    set vacationId(vacationId) {
        this._vacationId = vacationId;
    }
    
    set vacationTitle(vacationTitle) {
        this._vacationTitle = vacationTitle;
    }
    
    set locations(locations) {
        this._locations = locations;
    }
    
    set toDoLists(toDoLists) {
        this._toDoLists = toDoLists;
    }


    /* Methods */
    
    
}    