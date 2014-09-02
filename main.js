angular.module('myApp', ['ngRoute'])
  .config(function($routeProvider){
    $routeProvider
    .when('/home', {
      templateUrl: 'views/home.html',
    })
    .when('/new_meal', {
      templateUrl: 'views/new_meal.html',
      controller: 'MealsCtrl'
    })
    .when('/my_earnings', {
      templateUrl: 'views/my_earnings.html',
      controller: 'EarningsCtrl'
    })
    .otherwise({
      redirectTo: '/home'
    });
  })

// find a way to link the MealsCtrl and the EarningsCtrl 
  .factory('updateService', function($rootScope){

  })

  .controller('MealsCtrl', function($scope, updateService){
    "use strict";

    $scope.submit = function(){
      var validForm          = $scope.myForm.$valid;
      var validMealPrice     = $scope.myForm.myMealPrice.$dirty;
      var validTaxRate       = $scope.myForm.myTaxRate.$dirty;
      var validTipPercentage = $scope.myForm.myTipPercentage.$dirty;

      // create variables to hold scope for meal price, tax rate and tip percentage directly from the Form
      var mealPrice = $scope.data.mealPrice;
      var taxRate = $scope.data.taxRate / 100;
      var tip = $scope.data.tipPercentage / 100 * mealPrice;

      // calculate individual values for subtotal and total charges so it can be render on customer charges section
      var subTotal = mealPrice * taxRate + mealPrice;
     
      // If the form is valid, provide the calculated values
      if(validForm && validMealPrice && validTaxRate && validTipPercentage){
        $scope.$broadcast('updateEarning', tip, subTotal);
      }
    };

    // resetForm only works within the scope of the Form, to broadcast this function to other
    // scopes like the reset button with ng-click=('startOver') which is outside the scope of
    // ng-click=('resetForm') we'll need the startOver function to broadcast the functionality of
    // $scope.resetForm
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

    // startOver broadcasts the resetForm function above to outside controller
    $scope.startOver = function(){
      $scope.$broadcast('reset');
      $scope.resetForm();
    };
  
  })
  // ===================== @ends MealsCtrl
  

  .controller('ChargesCtrl', function($scope){
    "use strict";

    // setting default values
    $scope.subTotal = 0.00;
    $scope.tip = 0.00;
    $scope.totalCharges = 0.00;

    // listening for the resetForm alias "reset" by the startOver function
    $scope.$on('reset', function(){
      $scope.subTotal = 0.00;
      $scope.tip = 0.00;
      $scope.totalCharges = 0.00;
    });

    // updates customer charges based on the if statement on the submit function
    $scope.$on('updateEarning', function(evt, tip, subTotal){
      $scope.subTotal = subTotal;
      $scope.tip = tip;
      $scope.totalCharges = tip + subTotal;
    });
  })
  
  
  .controller('EarningsCtrl', function($scope, updateService){
    "use strict";
    console.log();
    // setting default values
    $scope.tipTotal = 0.00;
    $scope.mealCounter = 0;
    $scope.averageTip = 0.00;
    
    // listening for the resetForm alias "reset" by the startOver function
    $scope.$on('reset', function(){
      $scope.tipTotal = 0.00;
      $scope.averageTip = 0.00;
      $scope.mealCounter = 0;
    });

    $scope.$on('updateEarning', function(evt, tip){
      $scope.tipTotal += tip;
      $scope.mealCounter += 1;
      $scope.averageTip = $scope.tipTotal / $scope.mealCounter;
    });
  });
  