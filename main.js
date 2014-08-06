angular.module('myApp', [])
  .controller('MealsCtrl', function($scope){
    "use strict";
    
    $scope.madLib = true;

    $scope.submit = function(){
      var validForm          = $scope.myForm.$valid;
      var validMealPrice     = $scope.myForm.myMealPrice.$dirty;
      var validTaxRate       = $scope.myForm.myTaxRate.$dirty;
      var validTipPercentage = $scope.myForm.myTipPercentage.$dirty;

      if(validForm || validMealPrice || validTaxRate || validTipPercentage){

      }
    };
    // on click startover hide mad lib content, show inputs, and reset the form
    $scope.startOver = function(){
      // hide madLib content
      $scope.madLib = true; 
      // show form inputs
      $scope.formInputs = false;
    };
  })  