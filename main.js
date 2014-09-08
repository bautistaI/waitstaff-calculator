angular.module('myApp', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider){
	$routeProvider
	.when('/home', {
		templateUrl: 'views/home.html',
		activetab: 'home'
	})
	.when('/new_meal', {
		templateUrl: 'views/new_meal.html',
		controller: 'MealsCtrl',
		activetab: 'newmeal'
	})
	.when('/my_earnings', {
		templateUrl: 'views/my_earnings.html',
		controller: 'EarningsCtrl',
		activetab: 'myearnings'
	})
	.when('/error', {
    template : '<p>Error Page Not Found</p>'
	})
	.otherwise({
		redirectTo: '/'
	});
})
.run(function($rootScope, $location, $timeout) {
  $rootScope.$on('$routeChangeError', function() {
    $location.path("/error");
  });
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.isLoading = true;
  });
  $rootScope.$on('$routeChangeSuccess', function() {
    $timeout(function() {
      $rootScope.isLoading = false;
    }, 1000);
  });
})
// A factory retunr a single object, array, or function
.factory('earningService', function(){
	// create object data to pass data that can be used to set the values
	var data = {
		// empty values for the meal details, using the placeholder values
		mealPrice: '',
		taxRate: '',
		tipPercentage: '',

		// default values for customer charges
    subTotal: 0.00,
    tip: 0,
    totalCharges: 0.00,

    // default values for my earnings
    tipTotal: 0,
    mealCounter: 0,
    averageTip: 0
  };

  // return our data via get to make it accessible
  return{
	get: function(){
		return data;
	},
		// calculate the meal details
		calculate: function(){
			// data.mealPrice, taxRate and tipPercentage coming from new meal's ng-model
			// make note of the use of data. Using two-way data binding and processing the
			// calculations to get the tax rate and tip value, then store them on variables
			var mealPrice = data.mealPrice;
			var taxRate = data.taxRate / 100;
			var tip = data.tipPercentage / 100 * data.mealPrice;

			// after creating the calculations we know how to get the subtotal
			var subTotal = mealPrice * taxRate + mealPrice;

			// passing the values to the customer charges
			// this also allows the data to be persistent when going back
			// and forth from my earnings tab to new meal's tab
			// this is coming from our object data
			data.subTotal = subTotal;
			data.tip = tip;
			data.totalCharges = tip + subTotal;

			data.tipTotal += data.tip;
			data.mealCounter++;
			data.averageTip = data.tipTotal / data.mealCounter;
		},
		// reset the meal details form on click
		resetForm: function(){
			data.mealPrice = '';
			data.taxRate = '';
			data.tipPercentage = '';
		},
		// reset everything when clicking Start Over button
		resetEarnings: function(){
			confirm('Are you sure you want to start over?');
			data.tipTotal = 0;
			data.mealCounter = 0;
			data.averageTip = 0;
			data.subTotal = 0.00;
			data.tip = 0;
			data.totalCharges = 0.00;
		}
  };
})
// allows to set the active tab to the current route
.controller('MainCtrl', function($scope, $route){
	$scope.$route = $route;
})
// Dependency Injection the factory earningService
.controller('MealsCtrl', function($scope, earningService){
	// bring the data from the factory to make it available on this controller
	$scope.data = earningService.get();
	$scope.submit = function(){
		if($scope.myForm.$valid){
			// call the calculate function from the factory
			earningService.calculate();
			// on click Cancel reset the meals detail form
			$scope.resetForm();
		}else{
			alert('Invalid Form');
		}
	};
	// keeping the logic out of the controller and bringing it from
	// the factory ( earningService.resetForm(); ) to create the reset form
	$scope.resetForm = function(){
    earningService.resetForm();
    $scope.myForm.$setPristine();
  };
})
// bring the logic/data from the factory, then on click start over
// call the resetEarnings() function from the factory and applied to the $scope.resetEarnings
.controller('EarningsCtrl', function($scope, earningService){
	$scope.data = earningService.get();
	$scope.resetEarnings = earningService.resetEarnings;
});