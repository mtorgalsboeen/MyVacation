class Location{
    constructor(){
        this.title = "Testing Location";
        this.descr= "Info of location";
        this.address = "Address";
        this.imageURL = "Link to image";
    }
    
    //Getter
    get title(){
        return this.title;
    }
    get descr(){
        return this.descr;
    }
    get address(){
        return this.address; 
    }
    get image(){
        return this.imageURL;
    }
    
    //Setter
    set title(name){
        this.title = name;
    }
    set descr(info){
        this.descr = info;
    }
    set address(value){
        this.address = value;
    }
    set image(url){
        this.imageURL = url;
    }
    
    //Method
}