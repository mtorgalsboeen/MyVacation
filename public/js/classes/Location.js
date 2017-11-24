class Location{
    
    /*
        Takes in a Task model (from the database)
            The task model contains a yelp api id variable which
            will be used to retrieve the locations corresponding
            information from the yelp api.
    */
    
    constructor(location){
        this._locationId = location._id;
        this._yelpApiId = location.yelpApiId;
    }


    /* Getters and Setters */
    
    get locationId() {
        return this._locationId;
    }
    
    get yelpApiId() {
        return this._yelpApiId;
    }
    
    set locationId(locationId) {
        this._locationId = locationId;
    }
    
    set yelpApiId(yelpApiId) {
        this._yelpApiId = yelpApiId;
    }
    
    
    /* Methods */
}