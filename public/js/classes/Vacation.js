class Vacation {

    /*
        Takes in a Vacation model (from the database)
        and allows for controlled local manipulation of User-Vacation info
    */

    constructor(vacation) {
        this._vacationId = vacation._id;
        this._vacationTitle = vacation.vacationTitle;
        this._vacationDescription = vacation.vacationDescription;
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

    get vacationDescription() {
        return this._vacationDescription;
    }

    get locations() {
        var classLocations = [];
        for (var i = 0; i < this.locationsLength; i++) {
            classLocations[i] = this.getLocationByIndex(i);
        }
        return classLocations;
    }

    get locationsLength() {
        return this._locations.length;
    }

    get toDoLists() {
        var classToDoLists = [];
        for (var i = 0; i < this.toDoListsLength; i++) {
            classToDoLists[i] = this.getToDoListByIndex(i);
        }
        return classToDoLists;
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

    set vacationDescription(vacationDescription) {
        this._vacationDescription = vacationDescription;
    }

    set locations(locations) {
        this._locations = locations;
    }

    set toDoLists(toDoLists) {
        this._toDoLists = toDoLists;
    }


    /********** Methods **********/

    getLocationByIndex(index) {
        if (this.locationsLength < 1) {
            return -1; // No locations to get
        }
        else if (index - 1 > this.locationsLength) {
            return -1; // Out of bounds 
        }
        else {
            var newLocation = new Location(this._locations[index]);
            return newLocation;
        }
    }

    getLocationById(id) {
        if (this.locationsLength < 1) {
            return -1; // No Favorites to get
        }
        else {
            for (var i = 0; i < this.locationsLength; i++) {
                if (this._locations[i]._id === id) { return new Location(this._locations[i]); }
            }
            return -1; // Nothing found
        }
    }

    getToDoListByIndex(index) {
        if (this.toDoListsLength < 1) {
            return -1; // No locations to get
        }
        else if (index - 1 > this.toDoListsLength) {
            return -1; // Out of bounds 
        }
        else {
            var newToDoList = new ToDoList(this._toDoLists[index]);
            return newToDoList;
        }
    }

    getToDoListById(id) {
        if (this.toDoListsLength < 1) {
            return -1; // No Favorites to get
        }
        else {
            for (var i = 0; i < this.toDoListsLength; i++) {
                if (this._toDoLists[i]._id === id) { return new ToDoList(this._toDoLists[i]); }
            }
            return -1; // Nothing found
        }
    }

    /***** Static *****/
    /*
        Create a vacation for the current user (in session), requires callback and vacationTitle
        Callback: function(err, vacation)
    */
    static createVacation(vacationTitle, vacationDescription = null, locations = [], toDoLists = [], callback) {
        vacationDescription = (vacationDescription == null) ? "" : vacationDescription;
        locations = (locations == null) ? [] : locations;
        toDoLists = (toDoLists == null) ? [] : toDoLists;

        var url = window.location.origin + "/vacations/create";
        var dataToSend = {
            'vacationTitle': vacationTitle,
            'vacationDescription': vacationDescription,
            'locations': locations,
            'toDoLists': toDoLists
        };

        //Ajax request to create new vacation for current user
        $.ajax({
                url: '/vacations/create',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataToSend)
            })
            .done(function(response) {
                response = JSON.parse(response);
                if (response.error) {
                    callback(response.error, {});
                }
                else {
                    callback(null, new Vacation(response));
                }
            })
            .fail(function(err) {
                callback("Ajax error", {});
            })
            .always(function() {
                // console.log( "Completed" );
            });

    }

    /*
        Delete a vacation for the current user (in session), requires vacationId
        Optional Callback: function(err, deletedVacation)
    */
    static deleteVacation(vacationId, callback = null) {
        var dataToSend = {
            'vacationId': vacationId
        };

        //Ajax request to delete vacation for current user
        $.ajax({
                url: '/vacations/delete',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataToSend)
            })
            .done(function(response) {
                if (callback != null) {
                    response = JSON.parse(response);
                    if (response.error) {
                        callback(response.error, {});
                    }
                    else {
                        callback(null, new Vacation(response));
                    }
                }
            })
            .fail(function(err) {
                if (callback != null) { callback("Ajax error", {}); }
            })
            .always(function() {
                // console.log( "Completed" );
            });
    }

    /*
        Set (overwrite) a vacation's data for the current user (in session)
             requires vacationId and vacationTitle. locations and toDoLists default to []
        Optional Callback: function(err, updatedVacation)
    */
    static setVacation(vacationId, vacationTitle, locations = [], toDoLists = [], callback = null) {
        vacationDescription = (vacationDescription == null) ? "" : vacationDescription;
        locations = (locations == null) ? [] : locations;
        toDoLists = (toDoLists == null) ? [] : toDoLists;

        var url = window.location.origin + "/vacations/update";
        var dataToSend = {
            'vacationId': vacationId,
            'vacationTitle': vacationTitle,
            'vacationDescription': vacationDescription,
            'locations': locations,
            'toDoLists': toDoLists
        };

        //Ajax request to create update vacation for current user
        $.ajax({
                url: '/vacations/update',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataToSend)
            })
            .done(function(response) {
                if (callback != null) {
                    response = JSON.parse(response);
                    if (response.error) {
                        callback(response.error, {});
                    }
                    else {
                        callback(null, new Vacation(response));
                    }
                }
            })
            .fail(function(err) {
                if (callback != null) { callback("Ajax error", {}); }
            })
            .always(function() {
                // console.log( "Completed" );
            });
    }
}



/***** Instance Methods *****/
// Class.prototype.functionName defines a function for instances of the class

// Push changes function updates the database with the current details in this vacation
Vacation.prototype.pushChanges = function(callback = null) {
    Vacation.setVacation(this.vacationId, this.vacationDescription, this.vacationTitle, this.locations, this.toDoLists, function(err, vacation) {
        if (callback != null) {
            callback(err, vacation);
        }
    });
};