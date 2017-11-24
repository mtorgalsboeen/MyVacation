class User{
    
    /*
        Takes in a User model (from the database)
        and allows for controlled local manipulation of User info
    */
    
    constructor(user){
        this._userId = user._id;
        this._userToken = user.userToken;
        this._vacations = user.vacations;
    }
    
    
    /* Getters and Setters */
    
    get userId() {
        return this._userId;
    }
    
    get userToken() {
        return this._userToken;
    }
    
    get vacations() {
        return this._vacations;
    }
    
    get vacationsLength() {
        return this._vacations.length;
    }
    
    set userId(id) {
        this._userId = id;
    }
    
    set userToken(token) {
        this._userToken = token;
    }
    
    set vacations(vacations) {
        this._vacations = vacations;
    }
    
    
    /* Methods */
    
    getVacationByIndex(index) {
        if(this.vacationsLength < 1) {
            return -1;  // No vacations to get
        } else if (index-1 > this.vacationsLength) {
            return -1;  // Out of bounds 
        } else {
            return this._vacations[index];
        }
    }
    
    getVacationById(id) {
        if(this.vacationsLength < 1) {
            return -1;  // No vacations to get
        } else {
            for(var i = 0; i < this.vacationsLength; i++) {
                if(this._vacations[i]._id === id) { return this._vacations[i]; }
            }
            return -1; // Nothing found
        }
    }
}   

