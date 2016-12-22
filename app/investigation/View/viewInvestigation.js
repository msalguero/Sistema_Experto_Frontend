(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('ViewInvestigation', [
    '$scope', '$state', 'Investigation', '$stateParams', 'Variable', 'Expert', 'Poll', '$mdDialog', 'Result',
    function($scope, $state, Investigation, $stateParams, Variable, Expert, Poll, $mdDialog, Result) {
      var ctrl = this;
      $scope.variablePanelExpanded = true;
      $scope.expertPanelExpanded = true;
      $scope.variables = [];
      $scope.experts = [];
      $scope.currentKappa = 0;
      $scope.pollsAnsweredByExperts = 0;
      $scope.activeStep = {
        value: 1
      };
      $scope.steps = [
        {title: "Create Research Study", description: "Create and fill investigation data"},
        {title: "Select Experts", description: "Ranking poll to eliminate experts"},
        {title: "Find Dimensions", description: ""},
        {title: "Assign Weights", description: ""}
      ];

      var loadKappa = function(){
        Poll.findOne({filter:{where: { and:[{ investigationId: $stateParams.id}, {type: "2"}]}}},function(poll){
          try{
            console.log(Poll.sendEmailsToExperts);
            Poll.getConcordance({ id: poll.id },function(data){
              $scope.currentKappa = data.kappa.toFixed(2);
              });
          }catch(e){
            console.log("Error, ",e);
          }
          
        });
      }

      var loadExperts = function(){
        $scope.experts = Investigation.experts({
          id: $stateParams.id
        }, function(){
          $scope.experts.forEach(function(entry) {
            if(entry.filled_poll)
            $scope.pollsAnsweredByExperts++;
          });
          if($scope.pollsAnsweredByExperts>1)
            loadKappa();
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
      // if(pollsAnsweredByExperts>1)
      //   loadKappa();


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
        showDialog('#add-expert-dialog');
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
        var _dimension = {
          name: variable.newDimensionName,
          weight: 0,
          votes: 0
        }
        if(variable.dimensions)
          variable.dimensions.push(_dimension);
        else
          variable.dimensions = [_dimension];
        variable.showNewDimension = true;
        variable.newDimensionName = "";
        Variable.prototype$updateAttributes(
               {id:    variable.id},
               {dimensions: variable.dimensions}
            , function(){
              
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
        if(validPoll(type))
          $state.go('main.createPoll', {id: $stateParams.id, type: type});
      }
      $scope.ClosePoll = function(){
        $state.go('main.removeExperts', {id: $stateParams.id});
      }

      $scope.closeDialog = function() {
        $scope.answers = [];
        $scope.showAnswers = false;
        $scope.selectedExpert = null;
        $mdDialog.hide();
      }

      function showDialog(contentId) {

        $scope.alert = $mdDialog.alert({
          contentElement: contentId,
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

      var validPoll = function(type){
        if(type === 1){
          if($scope.variables.length < 2 || $scope.experts.length < 2){
            showWarning("Not enough variables or experts to conduct research study.")
            return false;
          }
        }else if(type === 2){
          for (var i = 0; i < $scope.variables.length; i++) {
            if(!$scope.variables[i].dimensions || $scope.variables[i].dimensions.length < 2){
              showWarning("Variable has minimum of 2 dimensions.")
              return false;
            }
          };
        }
        return true;
      }

      var showWarning = function(text){
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('Warning')
            .textContent(text)
            .ariaLabel('Alert Dialog Demo')
            .ok('Ok')
        );
      }

      $scope.ShowExperts = function(){
        showDialog("#experts-list-dialog");
      }

      $scope.ShowExpertAnswers = function(expert){
        $scope.loadingAnswers = true;
         Result.findOne({filter:{where: { expertId: expert.id }}}, function(result){
          $scope.loadingAnswers = false;
          $scope.answers = result.answers;
          $scope.showAnswers = true;
          $scope.selectedExpert = expert;
        });
      }

      $scope.BackToExpertList = function(){
          $scope.loadingAnswers = false;
          $scope.answers = [];
          $scope.showAnswers = false;
          $scope.selectedExpert = null;
      }
  }]);
}());