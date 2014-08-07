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
      var tipPercentage = $scope.data.tipPercentage / 100 * mealPrice;

      // calculate individual values for subtotal and total charges so it can be render on customer charges section
      var subTotal = mealPrice * taxRate + mealPrice;
      var totalCharges = mealPrice + taxRate + tipPercentage;      

      // hold values for earnings info NOT WORKING
      var addTipTotal = tipPercentage;

      // If the form is valid, provide the calculated values
      if(validForm || validMealPrice || validTaxRate || validTipPercentage){
        $scope.subTotal = subTotal;
        $scope.tipPercentage = tipPercentage;
        $scope.totalCharges = subTotal + tipPercentage;
        $scope.tipTotal = addTipTotal;
      }
    };

    // not working
    $scope.mealCounter = function(){
      var mealCount = 1;
      this.mealCount = this.mealCount + 1;
      return this.mealCount;
    };

    $scope.resetForm = function(){
      if(confirm('are you sure?')){
        $scope.myForm.$setPristine();
        $scope.myForm.myMealPrice.$setPristine();
        $scope.myForm.myMealPrice.$error.number = '';
        $scope.myForm.myTaxRate.$setPristine();
        $scope.myForm.myTaxRate.$error.number = '';
        $scope.myForm.myTipPercentage.$setPristine();
        $scope.myForm.myTipPercentage.$error.number = '';
      }
    };

    $scope.startOver = function(){
      if(confirm('are you sure?')){
        $scope.myForm.$setPristine();
        $scope.myForm.myMealPrice.$setPristine();
        $scope.myForm.myMealPrice.$error.number = '';
        $scope.myForm.myTaxRate.$setPristine();
        $scope.myForm.myTaxRate.$error.number = '';
        $scope.myForm.myTipPercentage.$setPristine();
        $scope.myForm.myTipPercentage.$error.number = '';
      }
    };


    
  });










