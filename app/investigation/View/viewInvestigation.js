

(function () {

'use strict';
  // var randomColor = require('./randomColor');
  angular.module('InvestigationApp')

  .controller('ViewInvestigation', [
    '$scope', '$state', 'Investigation', '$stateParams', 'Variable', 'Expert', 'Poll', '$mdDialog', 'Result', '$translate','$rootScope',
    function($scope, $state, Investigation, $stateParams, Variable, Expert, Poll, $mdDialog, Result, $translate, $rootScope) {
      var ctrl = this;
$scope.myChartObject = [];
    

      $scope.variablePanelExpanded = true;
      $scope.expertPanelExpanded = true;
      $scope.variables = [];
      $scope.experts = [];
      $scope.poll = {};
      $scope.currentKappa = 0;
      $scope.pollsAnsweredByExperts = 0;
      $scope.activeStep = {
        value: 1
      };
      $scope.poll;
      $scope.closePollMessage = "Your kappa is too low, are you sure you want to close the poll?"
      $scope.steps = [
        {title: $translate.instant('CREATE_RESEARCH_STUDY'), description: ""},
        {title: $translate.instant('SELECT-EXPERTS'), description: "Ranking poll to eliminate experts"},
        {title: $translate.instant('FIND-DIMENSIONS'), description: ""},
        {title: $translate.instant('ASSIGN-WEIGHTS'), description: ""},
        {title: $translate.instant('RUBRIC_FINISHED'), description: ""}
      ];
      $scope.nfLines = {};

      $rootScope.$on('$translateChangeSuccess', function () {
        $scope.steps[0] = $translate.instant('CREATE_RESEARCH_STUDY');
        $scope.steps[1] = $translate.instant('SELECT-EXPERTS');
        $scope.steps[2] = $translate.instant('FIND-DIMENSIONS');
        $scope.steps[3] = $translate.instant('ASSIGN-WEIGHTS');
        $scope.steps[4] = $translate.instant('RUBRIC_FINISHED');

      });

      var parseChartData = function(variables){
        var getRandomColor = function() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        try{
          $scope.myChartObject = variables.map((variable,idx)=>{
          return {
              name: variable.name,
              type: 'PieChart',

              options: {
                'title': variable.name,
                colors: variable.dimensions.map((dimension)=> getRandomColor()),
                "displayExactValues": true,
                "height": 400,
                "is3D": true,
              },
              data: {
                  "cols": [
                    {id: "t", label: "Dimension", type: "string"},
                    {id: "s", label: "Weight", type: "number"},
                ], 
                "rows": variable.dimensions.map((dimension)=>{
                  return{
                    c:[
                      {v: dimension.name},
                      {v: dimension.weight},
                    ]}
                })
              }
            }
        });

          console.log("myChartObject ",$scope.myChartObject);
          
        }catch(e){
          console.log(e);
        }


      }
     

      var loadKappa = function(){
        Poll.findOne({filter:{where: { and:[{ investigationId: $stateParams.id}, {type: "2"}]}}},function(poll){
          try{
            console.log("cargando poll ",poll);
            $scope.poll = poll;
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
        Variable.find({ 
          filter: { where: { investigationId: $stateParams.id } }
        },(result)=>{
          $scope.variables = result;
          console.log("variables: ", result);
          parseChartData(result);
        });
      }

      

      $scope.investigation = Investigation.find({ 
        filter: { where: { id: $stateParams.id } }
      }, function(investigation){
        console.log(investigation[0].step);
        if(investigation[0].step === "3" || investigation[0].step === "4"){
          $scope.activeStep.value++;
        }else if(investigation[0].step === "5" || investigation[0].step === "6"){
          $scope.activeStep.value = 3;
        }
        else if(investigation[0].step === "7"){
          $scope.activeStep.value = 4;
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

      $scope.ResendPollPressed = function(){
        showDialog('#resend-alert-dialog');
      }

      $scope.ResendPoll = function(){
        console.log("current poll: ",$scope.poll.id);

        Poll.prototype$updateAttributes(
               {id: $scope.poll.id},
               {iteration: ++$scope.poll.iteration}
            ,function(pollUpdated, cb){
              Poll.sendEmails({ id: $scope.poll.id });
            });
        $mdDialog.hide();
      }


      $scope.goToSelectDimensions = function(){
        $state.go('main.removeDimensions', {id: $stateParams.id});
      }

      $scope.GoToAssignWeights = function(){
        $state.go('main.assignWeights', {id: $stateParams.id});
      }
      
      $scope.closeDelphiMethod = function(){
        if($scope.currentKappa < 0.5){
          showDialog('#kappa-alert-dialog');
        }else{
          $scope.goToSelectDimensions();
        }
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
          clickOutsideToClose: true,
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
              showWarning("Variable has a minimum limit of 2 dimensions.")
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