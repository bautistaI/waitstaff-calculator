angular.module('myApp', [])
  .controller('MealsCtrl', function($scope){
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
        $scope.subTotal = subTotal;
        $scope.totalCharges = tip + subTotal;      
        $scope.tip = tip;
        $scope.$broadcast('updateEarning', tip, subTotal);
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
    };

    $scope.startOver = function(){
      $scope.myForm.$setPristine();
      $scope.$broadcast('reset');
      $scope.resetForm();
    };
  })

  .controller('ChargesCtrl', function($scope){
    $scope.subTotal = 0.00;
    $scope.tip = 0.00;
    $scope.totalCharges = 0.00;

    $scope.$on('reset', function(){
      $scope.subTotal = 0.00;
      $scope.tip = 0.00;
      $scope.totalCharges = 0.00;
    });

    $scope.$on('updateEarning', function(evt, tip, subTotal){
      $scope.subTotal = subTotal;
      $scope.tip = tip;
      $scope.totalCharges = tip + subTotal; 
    });
  })

  
  .controller('EarningsCtrl', function($scope){
    $scope.tipTotal = 0.00;
    $scope.mealCounter = 0;
    $scope.averageTip = 0.00;
    
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
  })

  