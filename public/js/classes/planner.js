// Class Test
class Planner {
    constructor(size) {
        this.locations = [];
        for(let i = 0; i < size; i++) {
            this.locations[i] = Math.random();
        }
    }
    
    getLocation(i) {
        return this.locations[i];
    }
}

module.exports = Planner;