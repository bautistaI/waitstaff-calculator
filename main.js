angular.module('myApp', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'views/home.html'
	})
	.when('/new_meal', {
		templateUrl: 'views/new_meal.html',
		controller: 'MealsCtrl'
	})
	.when('/my_earnings', {
		templateUrl: 'views/my_earnings.html',
		controller: 'EarningsCtrl'
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
.service('earningService',function($rootScope){
	var template_earning= {
		totalTip : 0.00,
		mealCount : 0,
		averageTip : 0.00
	};

	var my_earnings = angular.copy(template_earning);

	// this doesn't work
	// this.reset = function(){
	// angular.copy(template_earning,my_earnings);
	// };

	this.getEarnings = function(){
		return my_earnings;
	};

	this.updateEarning = function(tip, subTotal){
		my_earnings.totalTip += tip;
		my_earnings.mealCount += 1;
		my_earnings.averageTip = my_earnings.totalTip / my_earnings.mealCount ;
	};
})

.controller('MealsCtrl', function($scope, earningService){
	"use strict";

	$scope.submit = function(){
		var validForm          = $scope.myForm.$valid;
		var validMealPrice     = $scope.myForm.myMealPrice.$dirty;
		var validTaxRate       = $scope.myForm.myTaxRate.$dirty;
		var validTipPercentage = $scope.myForm.myTipPercentage.$dirty;

		// If the form is valid, provide the calculated values
		if(validForm && validMealPrice && validTaxRate && validTipPercentage){
			// create variables to hold scope for meal price, tax rate and tip percentage directly from the Form
			var mealPrice = $scope.data.mealPrice;
			var taxRate = $scope.data.taxRate / 100;
			var tip = $scope.data.tipPercentage / 100 * mealPrice;

			// calculate individual values for subtotal and total charges so it can be render on customer charges section
			var subTotal = mealPrice * taxRate + mealPrice;
			
			$scope.subTotal = subTotal;
			$scope.tip = tip;
			$scope.totalCharges = tip + subTotal;
			
			earningService.updateEarning(tip, subTotal);
		}
	};
	$scope.resetForm = function(){
		$scope.myForm.$setPristine();
		$scope.myForm.myMealPrice.$setPristine();
		$scope.myForm.myMealPrice.$error.number = '';
		$scope.myForm.myTaxRate.$setPristine();
		$scope.myForm.myTaxRate.$error.number = '';
		$scope.myForm.myTipPercentage.$setPristine();
		$scope.myForm.myTipPercentage.$error.number = '';
		$scope.data.mealPrice = undefined;
		$scope.data.taxRate = undefined;
		$scope.data.tipPercentage = undefined;
	};

	// setting default values
	$scope.subTotal = 0.00;
	$scope.tip = 0.00;
	$scope.totalCharges = 0.00;
})
.controller('EarningsCtrl', function($scope,earningService){
	"use strict";
	// setting default values
	var my_earnings = earningService.getEarnings();
	$scope.tipTotal = my_earnings.totalTip;
	$scope.mealCounter = my_earnings.mealCount;
	$scope.averageTip = my_earnings.averageTip;

	// startOver broadcasts the resetForm function above to outside controller
	$scope.startOver = function(){
		// earningService.reset();
		$scope.tipTotal = 0.00;
		$scope.mealCounter = 0;
		$scope.averageTip = 0.00;
	};
});
