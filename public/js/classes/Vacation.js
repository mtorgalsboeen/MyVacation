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
    
    // Create a vacation for the current user, requires callback and vacationTitle
    // 
    static createVacation(vacationTitle, locations=[], toDoLists=[], callback) {
        locations = (locations == null)? [] : locations; 
        toDoLists = (toDoLists == null)? [] : toDoLists; 
        
        var url = window.location.origin+"/vacations/create";
        var dataToSend = {
            'vacationTitle' : vacationTitle,
            'locations' : locations,
            'toDoLists' : toDoLists
        };
        
        //Ajax request to create new vacation for current user
        $.ajax({
            url: '/vacations/create',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataToSend)
        })
        .done(function(response) {
            response=JSON.parse(response);
            if(response.error) {
                callback(response.error, {});
            } else {
                callback(null, new Vacation(response));
            }
        })
        .fail(function(err) {
            callback("Ajax error",{});
        })
        .always(function() {
            // console.log( "Completed" );
        });
        
    }
    
    
    static deleteVacation(vacationId, callback=null) {
        var url = window.location.origin+"/vacations/delete";
        var dataToSend = {
            'vacationId' : vacationId
        };
        
        //Ajax request to delete vacation for current user
        $.ajax({
            url: '/vacations/delete',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataToSend)
        })
        .done(function(response) {
            if(callback !=null) {
                response=JSON.parse(response);
                if(response.error) {
                    callback(response.error, {});
                } else {
                    callback(null, new Vacation(response));
                }
            }
        })
        .fail(function(err) {
            if(callback!=null) {callback("Ajax error",{});}
        })
        .always(function() {
            // console.log( "Completed" );
        });
    }
    
    
    static updateVacation(vacationId, newVacationTitle, callback=null) {
        var url = window.location.origin+"/vacations/delete";
        var dataToSend = {
            'vacationId' : vacationId,
            'vacationTitle' : newVacationTitle
        };
        
        //Ajax request to create update vacation for current user
        $.ajax({
            url: '/vacations/update',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataToSend)
        })
        .done(function(response) {
            if(callback !=null) {
                response=JSON.parse(response);
                if(response.error) {
                    callback(response.error, {});
                } else {
                    callback(null, new Vacation(response));
                }
            }
        })
        .fail(function(err) {
            if(callback!=null) {callback("Ajax error",{});}
        })
        .always(function() {
            // console.log( "Completed" );
        });
    }
}    