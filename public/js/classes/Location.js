class Location {

    /*
        Takes in a Location model (from the database)
            The Location model contains a yelp api id variable which
            will be used to retrieve the corresponding
            information from the yelp api.
    */

    constructor(location) {
        this._locationId = location._id;
        this._yelpApiId = location.yelpApiId;

        // Location Data (Retrieved from Yelp)
        // this._loadSuccess = false;
        // this._name = "";
        // this._image_url = "";
        // this._url = "";
        // this._rating = "";
        // this._address = "";
        // this._phone = "";

        // Load yelp data
        var self = this; // save instance of self (Changes in ajax calls)
        this.loadLocationData(function(err, response) {
            if (err) {
                // Loaded successfully
                self.loadSuccess = false;
                self.failedLoad = true;
            }
            else {
                // Loaded successfully
                self.loadSuccess = true;
                self.name = response.name;
                self.image_url = response.image_url;
                self.url = response.url;
                self.rating = response.rating;
                self.address = response.location.display_address[0];
                self.address += " " + response.location.display_address[1];
                self.phone = response.display_phone;
            }
        });
    }


    /* Getters and Setters */

    get address() {
        return this._address;
    }

    get image_url() {
        return this._image_url;
    }

    get loadSuccess() {
        return this._loadSuccess;
    }

    get locationId() {
        return this._locationId;
    }

    get name() {
        return this._name;
    }

    get phone() {
        return this._phone;
    }

    get rating() {
        return this._rating;
    }

    get url() {
        return this._url;
    }

    get yelpApiId() {
        return this._yelpApiId;
    }


    set address(address) {
        this._address = address;
    }

    set image_url(image_url) {
        this._image_url = image_url;
    }

    set loadSuccess(success) {
        this._loadSuccess = success;
    }

    set locationId(locationId) {
        this._locationId = locationId;
    }

    set name(name) {
        this._name = name;
    }

    set phone(phone) {
        this._phone = phone;
    }

    set rating(rating) {
        this._rating = rating;
    }

    set url(url) {
        this._url = url;
    }

    set yelpApiId(yelpApiId) {
        this._yelpApiId = yelpApiId;
    }


    /* Methods */

    /***** Static *****/

    static addToVacation(vacationId, yelpApiId, callback) {
        var dataToSend = {
            'vacationId': vacationId,
            'yelpApiId': yelpApiId
        };

        //Ajax request to create new vacation for current user
        $.ajax({
                url: '/vacations/addLocation',
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
                    callback(null, "Successfully added to vacation.");
                }
            })
            .fail(function(err) {
                callback("Ajax error", {});
            })
            .always(function() {
                // console.log( "Completed" );
            });
    }


    /**
     *  Create a new favorite (location) for the current user (in session)
     *   Callback: function(err, location)
     */
    static createFavorite(yelpApiId, callback) {
        var dataToSend = {
            'yelpApiId': yelpApiId
        };

        //Ajax request to create new vacation for current user
        $.ajax({
                url: '/entertainment/createFavorite',
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
                    // console.log("Response to createFavorite Function: " + JSON.stringify(response));
                    var newLocation = new Location(response);
                    callback(null, newLocation);
                }
            })
            .fail(function(err) {
                callback("Ajax error", {});
            })
            .always(function() {
                // console.log( "Completed" );
            });
    }


    /**
     *  Gets the yelp data of the location with the id provided
     *      Callback: function(err, YelpObjectResponseParsed)
     */
    static getYelpLocationData(yelpApiId, callback) {
        //Ajax request to create new vacation for current user
        $.ajax({
                url: '/entertainment/getYelpLocation/' + yelpApiId,
                method: 'GET',
                contentType: 'application/json'
            })
            .done(function(response) {
                response = JSON.parse(response);
                if (response.error) {
                    callback(response.error, {});
                }
                else {
                    callback(null, response);
                }
            })
            .fail(function(err) {
                callback("Ajax error", {});
            })
            .always(function() {
                // console.log( "Completed" );
            });

    }


    /**
     *  Search the yelp api with filter parameters
     *      ex: Location.yelpSearch("Food", "Marina", 5, callback)
     *      Callback: function(err, YelpArrayResponseParsed)
     */
    static yelpSearch(term, location, limit = 20, callback) {
        limit = (limit == null) ? 20 : limit;

        var dataToSend = {
            'term': term,
            'location': location,
            'limit': limit
        };

        //Ajax request to create new vacation for current user
        $.ajax({
                url: '/entertainment/yelpSearch',
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
                    // Convert response data to an array of locations
                    Location.yelpEasyFormatArray(response.businesses, function(formattedArray) {
                        callback(null, formattedArray);
                    });

                }
            })
            .fail(function(err) {
                callback("Ajax error", {});
            })
            .always(function() {
                // console.log( "Completed" );
            });

    }

    static yelpEasyFormatArray(unformattedArray, callback) {

        var formatedLocationArray = [];
        for (var i = 0; i < unformattedArray.length; i++) {
            var self = {
                "yelpApiId": unformattedArray[i].id,
                "name": unformattedArray[i].name,
                "image_url": unformattedArray[i].image_url,
                "url": unformattedArray[i].url,
                "rating": unformattedArray[i].rating,
                "address": unformattedArray[i].location.display_address,
                "phone": unformattedArray[i].display_phone
            };
            formatedLocationArray[i] = self;
        }

        callback(formatedLocationArray);
    }

}


/***** Instance *****/

/**
 * Loads this location's data from the yelp api
 *      uses the location's yelpApiId
 */
Location.prototype.loadLocationData = function(callback) {
    var self = this;
    // Get yelp api data for this.yelpApiId
    Location.getYelpLocationData(self.yelpApiId, function(err, response) {
        if (err) {
            callback("Failed To Load Yelp Data", null);
        }
        else {
            callback(null, response);
        }
    });
}