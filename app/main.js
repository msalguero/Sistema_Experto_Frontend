(function () {

'use strict';


  angular.module('InvestigationApp', ['ngAnimate', 'ngAria', 'ui.router', 'lbServices', 'ui.sortable', 'ngMaterial'])

  .config([
    '$stateProvider',
    'LoopBackResourceProvider',
    '$urlRouterProvider',
    function($stateProvider, LoopBackResourceProvider,$urlRouterProvider) {

      LoopBackResourceProvider.setUrlBase('http://localhost:3000/api/');


      var loginState = {
        name: 'login',
        url: '/login',
        templateUrl: "./login/login.html",
        controller: 'Login',
        controllerAs: 'login'
      };

      var mainState = {
        name: 'main',
        url: '/',
        templateUrl: "./layout/layout.html",
        controller: 'Layout',
      }

      var investigationState = { 
        name: 'main.investigations', 
        url: 'investigations', 
        templateUrl: "./investigation/investigation.html",
        controller: 'InvestigationList'
      };

      var createInvestigationState = { 
        name: 'main.createInvestigation', 
        url: 'investigations/create', 
        templateUrl: "./investigation/Create/CreateInvestigation.html",
        controller: 'CreateInvestigation'
      };

      var viewInvestigationState = { 
        name: 'main.viewInvestigation', 
        url: 'investigations/:id', 
        templateUrl: "./investigation/View/investigation.html",
        controller: 'ViewInvestigation'
      };

      var pollState = { 
        name: 'main.poll', 
        url: 'polls', 
        templateUrl: "./poll/poll.html",
        controller: 'PollList'
      };

      var createPollState = { 
        name: 'main.createPoll', 
        url: 'polls/create/:id&:type', 
        templateUrl: "./poll/Create/CreatePoll.html",
        controller: 'CreatePoll'
      };

      var answerPollAbstractState = {
          abstract: true,
          name: 'answerPoll',
          url: '/fill-poll/:pollId',
          template: '<ui-view/>'
      }

      var answerPollState = { 
        name: 'answerPoll.expert', 
        url: '/expert/:expertId', 
        templateUrl: "./poll/Answer/AnswerPoll.html",
        controller: 'AnswerPoll'
      };

      var removeExpertsState = { 
        name: 'main.removeExperts', 
        url: 'remove-experts/:id', 
        templateUrl: "./investigation/RemoveExperts/removeExperts.html",
        controller: 'RemoveExperts'
      };

      var registerState = { 
        name: 'register', 
        url: '/register', 
        templateUrl: "./register/register.html",
        controller: 'Register'
      }


      $urlRouterProvider.otherwise('/');


      $stateProvider.state(registerState);
      $stateProvider.state(loginState);
      $stateProvider.state(mainState);
      $stateProvider.state(investigationState);
      $stateProvider.state(createInvestigationState);
      $stateProvider.state(viewInvestigationState);
      $stateProvider.state(pollState);
      $stateProvider.state(createPollState);
      $stateProvider.state(answerPollAbstractState);
      $stateProvider.state(answerPollState);
      $stateProvider.state(removeExpertsState);
    }
  ])



  .run(function ($rootScope, Account, $state ) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var authorizedUser = Account.isAuthenticated();
      if (!authorizedUser && next.name !== 'login') {
        $state.go("login");
        
      }

    });
  });

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('InvestigationList', [
    '$scope', '$state', 'Investigation',
    function($scope, $state, Investigation) {
      var ctrl = this;

      $scope.investigations = Investigation.find({filter:{include:  ['experts', 'variables']}});

      $scope.Create = function(){
        $state.go('main.createInvestigation');
      };

      $scope.ViewDetails = function(id){
        console.log(id);
        $state.go('main.viewInvestigation',{id: id} );
      };

      $scope.Delete = function(id){
        Investigation.deleteById({ id: id })
          .$promise
          .then(function() { 
            $scope.investigations = Investigation.find({filter:{include:  ['experts', 'variables']}}); 
          });
      };
    }
  ]);

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('Layout', [
    '$rootScope', '$scope', '$state', 'Account',
    function($rootScope, $scope, $state, Account) {
      var ctrl = this;
      
      $scope.logout = function(){
        Account.logout(
          function() {
            $state.go("login");
          }, function(res) {
            $scope.error = true;
          });
      };

      $scope.investigations = function(){
        $state.go("main.investigations");
      };

      $scope.init = function(){
        Account.getCurrent(
          function(response) {
              var user = response;
              $scope.userName = user.username;
            }, function(res) {
              $state.go("login");
            });
      }

      $scope.init();
    }
  ]);

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('Login', [
    '$rootScope', '$scope', '$state', 'Account',
    function($rootScope, $scope, $state, Account) {
      var ctrl = this;
      $scope.credentials = {};
      $scope.error = false;

      $scope.submit = function(){
      	$scope.loginResult = Account.login($scope.credentials,
        function(res) {
          $rootScope.user = res.user;
          $state.go("main.investigations");
        }, function(res) {
          $scope.error = true;
        });
      };

      $scope.register = function(){
      	$state.go("register");
      };

    }
  ]);

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('PollList', [
    '$scope', '$state', 'Poll',
    function($scope, $state, Poll) {
      var ctrl = this;

      $scope.data = {
        label: "75%",
        percentage: 75
      }

      $scope.polls = Poll.find();

      $scope.Create = function(){
        $state.go('main.createPoll');
      };

      /*
      $scope.ViewDetails = function(id){
        console.log(id);
        $state.go('main.viewInvestigation',{id: id} );
      };

      $scope.Delete = function(id){
        Investigation.deleteById({ id: id })
          .$promise
          .then(function() { 
            $scope.investigations = Investigation.find({
                filter: { limit: 10 }
              }); 
          });
      };*/
    }
  ]);

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('Register', [
    '$scope', '$state', 'Account',
    function($scope, $state, Account) {
      var ctrl = this;
      $scope.user = {};
      $scope.submit = function(){
      	$scope.registerResult = Account.create($scope.user,
        function() {
          $state.go("login");
        }, function(res) {
          $scope.error = true;
        });
      };

      $scope.login = function(){
        $state.go("login");
      };
    }
  ]);

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .directive('stepProgressBar', function() {

		return {
			restrict: 'E',
			scope: {
			  steps: '=steps',
			  activeStep: '=activeStep'
			},
			link: function (scope, element, attrs) {
				scope.$watch(attrs.activeStep, function(value) {
					//$( "#" + (value-1)  ).removeClass( "active" ).addClass( "complete" );
				   //$( "#" + value  ).removeClass( "disable" ).addClass( "active" );
				});
				scope.getNumber = function(num) {
					return new Array(num);   
				};
			},
			templateUrl: './directives/StepProgressBar/stepProgressBar.html'
	    };
	});

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('CreateInvestigation', [
    '$scope', '$state', 'Investigation',
    function($scope, $state, Investigation) {
      var ctrl = this;
      $scope.investigation = {step:1};

      $scope.submit = function(){
        Investigation.create($scope.investigation, 
          function(){
            $state.go("main.investigations");
          });
      };
    }
  ]);

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('RemoveExperts', [
    '$scope', '$state', '$stateParams' , 'Investigation', 'Expert',
    function($scope, $state, $stateParams, Investigation, Expert) {
      var ctrl = this;

      $scope.investigation = Investigation.findById({
        id: $stateParams.id,
        filter:{include:  ['experts']}
      });

      $scope.submit =function(){
        for (var i = 0; i < $scope.investigation.experts.length; i++) {
          if(!$scope.investigation.experts[i].checked){
            Expert.deleteById({ id: $scope.investigation.experts[i].id });
          }
        }
        Investigation.prototype$updateAttributes(
           {id:    $stateParams.id},
           {step: 3}
        );
        $state.go('main.viewInvestigation',{id: $stateParams.id} );
      }
    }
  ]);

}());
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
        {title: "Create Investigation", description: "Create and fill investigation data"},
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
        if(investigation[0].step === 3){
          $scope.activeStep.value = 2;
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
        $scope.expertPanelExpanded = !$scope.variablePanelExpanded;
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

      $scope.addDimension = function(id){
        $scope.newDimension.show = true;
      }

      $scope.saveDimension = function(variable){
        if(variable.dimensions)
          variable.dimensions.push($scope.newDimension.name);
        else
          variable.dimensions = [$scope.newDimension.name];
        Variable.prototype$updateAttributes(
               {id:    variable.id},
               {dimensions: variable.dimensions}
            , function(){
              $scope.newDimension.show = false;
              $scope.newDimension.name = "";
              loadVariables();
            });
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
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('AnswerPoll', [
    '$scope', '$state', 'Poll', '$stateParams', 'Result', 'Expert',
    function($scope, $state, Poll, $stateParams, Result, Expert) {
      var ctrl = this;
      $scope.hideItemInput = true;
      $scope.poll = Poll.findById({ 
        id: $stateParams.pollId 
      });

      $scope.result = {
        "answers": [],
        "expertId": $stateParams.expertId ,
        "pollId": $stateParams.pollId 
      }

      $scope.itemInput = "";

      $scope.submit = function(){
        $scope.result.answers = $scope.poll.questions;
        Result.create($scope.result, function(){
          $scope.pollFilled = true;
          Expert.prototype$updateAttributes(
               {id:    $stateParams.expertId},
               {filled_poll: true}
            );
        });
      };
    }
  ]);

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('CreatePoll', [
    '$scope', '$state', 'Poll', '$stateParams', 'Investigation',
    function($scope, $state, Poll, $stateParams,  Investigation) {
      var ctrl = this;
      $scope.hideItemInput = true;
      $scope.poll = {
        questions:[],
        type: $stateParams.type
      };
      console.log($stateParams);
      $scope.itemInput = "";
      $scope.type = $stateParams.type;

      if($scope.type === "1")
        $scope.pollName = "Ranking";
      else if($scope.type === "2")
        $scope.pollName = "Dichotomic";

      $scope.submit = function(){
        Investigation.polls.create(
           { id: $stateParams.id },
          $scope.poll, 
          function(poll){
            console.log(poll);
            Investigation.prototype$updateAttributes(
               {id:    $stateParams.id},
               {step: 2}
            );
            Poll.sendEmails(
              { id: poll.id }
            );
            $state.go('main.viewInvestigation',{id: $stateParams.id} );
          });
      };

      $scope.addItem = function(){
        if(event.which === 13) {
          $scope.poll.questions.push($scope.itemInput);
          $scope.hideItemInput = true;
          $scope.itemInput = "";
          
        }
      };

      $scope.showItemInput = function(){
        $scope.hideItemInput = false;
        setTimeout(function() { $( "#new-item-input" ).focus(); }, 100);
      }

      var loadVariables = function(){
         Investigation.variables({
          id: $stateParams.id
        }, function(variables){
          console.log(variables);
          $scope.poll.questions = variables.map(function(variable){
            return variable.name;
          });
        });
      }

      loadVariables();
    }
  ]);

}());