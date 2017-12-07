class User{
    
    /*
        Takes in a User model (from the database)
        and allows for controlled local manipulation of User info
    */
    
    constructor(user){
        this._userId = user._id;
        this._vacations = user.vacations;
        this._favorites = user.favorites;
    }
    
    
    /* Getters and Setters */
    
    
    get favorites() {
        // var classFavorites = [];
        // for(var i = 0; i < this.favoritesLength; i++) {
        //     classFavorites[i] = this.getFavoriteByIndex(i);
        // }
        // return classFavorites;
        return this._favorites;
    }
    
    get favoritesLength() {
         return this._favorites.length;
    }
    
    get userId() {
        return this._userId;
    }
    
    get vacations() {
        var classVacations = [];
        for(var i = 0; i < this.vacationsLength; i++) {
            classVacations[i] = this.getVacationByIndex(i);
        }
        return classVacations;
    }
    
    get vacationsLength() {
        return this._vacations.length;
    }
    
    
    set favorites(favorites) {
        this._favorites = favorites;
    }
    
    set userId(id) {
        this._userId = id;
    }
    
    set vacations(vacations) {
        this._vacations = vacations;
    }
    
    
    /* Methods */
    getFavoriteByIndex(index) {
        if(this.favoritesLength < 1) {
            return -1;  // No favorites to get
        } else if (index-1 > this.favoritesLength) {
            return -1;  // Out of bounds 
        } else {
            // console.log("Internal format: " + JSON.stringify(this._favorites[index]));
            var newLocation = new Location(this._favorites[index]);
            return newLocation;
        }
    }
    
    getFavoriteById(id) {
        if(this.favoritesLength < 1) {
            return -1;  // No Favorites to get
        } else {
            for(var i = 0; i < this.favoritesLength; i++) {
                if(this._favorites[i]._id === id) { return new Location(this._favorites[i]); }
            }
            return -1; // Nothing found
        }
    }
    
    getVacationByIndex(index) {
        if(this.vacationsLength < 1) {
            return -1;  // No vacations to get
        } else if (index-1 > this.vacationsLength) {
            return -1;  // Out of bounds 
        } else {
            return new Vacation(this._vacations[index]);
        }
    }
    
    getVacationById(id) {
        if(this.vacationsLength < 1) {
            return -1;  // No vacations to get
        } else {
            for(var i = 0; i < this.vacationsLength; i++) {
                if(this._vacations[i]._id === id) { return new Vacation(this._vacations[i]); }
            }
            return -1; // Nothing found
        }
    }
}   

