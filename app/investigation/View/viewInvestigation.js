(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('ViewInvestigation', [
    '$scope', '$state', 'Investigation', '$stateParams', 'Variable', 'Expert', '$mdDialog',
    function($scope, $state, Investigation, $stateParams, Variable, Expert, $mdDialog) {
      var ctrl = this;
      $scope.variablePanelExpanded = true;
      $scope.expertPanelExpanded = true;
      $scope.variables = [];
      $scope.experts = [];
      $scope.pollsAnsweredByExperts = 0;
      $scope.activeStep = {
        value: 1
      };
      $scope.steps = [
        {title: "Create Reserch Study", description: "Create and fill investigation data"},
        {title: "Select Experts", description: "Ranking poll to eliminate experts"},
        {title: "Find Dimensions", description: ""},
        {title: "Assign Weights", description: ""}
      ];

      var loadExperts = function(){
        $scope.experts = Investigation.experts({
          id: $stateParams.id
        }, function(){
          $scope.experts.forEach(function(entry) {
            if(entry.filled_poll)
            $scope.pollsAnsweredByExperts++;
          });
        });
      }

      var loadVariables = function(){
        $scope.variables = Variable.find({ 
          filter: { where: { investigationId: $stateParams.id } }
        });
      }

      $scope.investigation = Investigation.find({ 
        filter: { where: { id: $stateParams.id } }
      }, function(investigation){
        if(investigation[0].step === "3" || investigation[0].step === "4"){
          $scope.activeStep.value++;
        }
      });

      loadExperts();
      loadVariables();

      $scope.newVariable = {"weight": 0, "investigationId": $stateParams.id};
      $scope.newDimension = {};
      $scope.newExpert = { "send_poll": true, "filled_poll":false};

      $scope.toggleVariablePanel = function(){
        $scope.variablePanelExpanded = !$scope.variablePanelExpanded;
      }

      $scope.toggleExpertPanel = function(){
        $scope.expertPanelExpanded = !$scope.expertPanelExpanded;
      }

      $scope.addVariable = function(){
        $scope.newVariable.show = true;
      }

      $scope.addExpert = function(){
        showDialog();
      }

      $scope.saveVariable = function(){
        Variable.create($scope.newVariable, 
          function(){
            $scope.newVariable.show = false;
            $scope.newVariable.name = "";
            loadVariables();
          });
      }

      $scope.saveExpert = function(){
        Investigation.experts.create(
           { id: $stateParams.id },
          $scope.newExpert, 
          function(){
            $scope.newExpert.show = false;
            $scope.newExpert.name = "";
            $scope.newExpert.email = "";
            $mdDialog.hide();
            loadExperts();
          });
      }

      $scope.DeleteVariable = function(id){
        Variable.deleteById({ id: id })
          .$promise
          .then(loadVariables);
      }

      $scope.addDimension = function(variable){
        variable.showDimension = true;
        variable.showNewDimension = true;
      }

      $scope.saveDimension = function(variable){
        if(variable.dimensions)
          variable.dimensions.push(variable.newDimensionName);
        else
          variable.dimensions = [variable.newDimensionName];
        Variable.prototype$updateAttributes(
               {id:    variable.id},
               {dimensions: variable.dimensions}
            , function(){
              variable.showNewDimension = false;
              variable.newDimensionName = "";
              loadVariables();
            });
      }

      $scope.cancelSaveDimension = function(variable){
        variable.showNewDimension = false;
        variable.newDimensionName = "";
      }

      $scope.DeleteExpert = function(id){
        Expert.deleteById({ id: id })
          .$promise
          .then(loadExperts);
      }

      $scope.CreatePoll = function(type){
        $state.go('main.createPoll', {id: $stateParams.id, type: type});
      }
      $scope.ClosePoll = function(){
        $state.go('main.removeExperts', {id: $stateParams.id});
      }

      $scope.closeDialog = function() {
        $mdDialog.hide();
      }

      function showDialog() {

        $scope.alert = $mdDialog.alert({
          contentElement: '#add-expert-dialog',
          parent: angular.element(document.body),
          ok: 'Close'
        });

        $mdDialog
          .show( $scope.alert )
          .finally(function() {
            $scope.alert = undefined;
            $("body").css({"overflow":""});
          });
          $("body").css({"overflow":"initial"});
      }
    }
  ]);

}());