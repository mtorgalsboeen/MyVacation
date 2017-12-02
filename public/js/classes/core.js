var scotchTodo = angular.module('yelpApp', []);

function mainController($scope, $http) {
	params = {'term':'food','location':'90210'};
	$scope.listData = [];
	$scope.dataNotFound = false;
	// when landing on the page, get all todos and show them

	// var httpData = $http({
 //        method: 'GET',
 //        url: '/getInfo',
 //        dataType: 'json',
 //        data: params,
        
 //    });

    
    var dataFilterFunction = function(params){
    	var httpData = $http({
	        method: 'POST',
	        url: '/getInfo',
	        dataType: 'json',
	        data: params,
	        
	    });
	    httpData.success(function (response, status, headers) {
	         if(response.status){
	         	console.log("data::",response)
	         	if((response.data.businesses).length == 0){
	         		$scope.dataNotFound = true;
	         	}else{
	         		$scope.dataNotFound = false;
	         	}
				$scope.listData = response.data.businesses;	
	         	
			}
	    });	
    }
    $scope.searchData = function(){
    	console.log($scope.searchParam)
    	dataFilterFunction($scope.searchParam)
    }
    // dataFilterFunction(params);
 

}
