(function () {

'use strict';


  angular.module('InvestigationApp', ['ngAnimate', 'ui.router', 'lbServices'])

  .config([
    '$stateProvider',
    'LoopBackResourceProvider',
    function($stateProvider, LoopBackResourceProvider) {

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

      var registerState = { 
        name: 'register', 
        url: '/register', 
        templateUrl: "./register/register.html",
        controller: 'Register'
      }

      $stateProvider.state(registerState);
      $stateProvider.state(loginState);
      $stateProvider.state(mainState);
      $stateProvider.state(investigationState);
      $stateProvider.state(createInvestigationState);
      $stateProvider.state(viewInvestigationState);
    }
  ]);

}());
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('InvestigationList', [
    '$scope', '$state', 'Investigation',
    function($scope, $state, Investigation) {
      var ctrl = this;

      $scope.investigations = Investigation.find({
        filter: { limit: 10 }
      });

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
            $scope.investigations = Investigation.find({
                filter: { limit: 10 }
              }); 
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
      if(!$rootScope.user)
        $state.go("login");
      else
        $scope.userName = $rootScope.user.username;
      $scope.logout = function(){
        $rootScope.user = false;
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

  .controller('CreateInvestigation', [
    '$scope', '$state', 'Investigation',
    function($scope, $state, Investigation) {
      var ctrl = this;
      $scope.investigation = {};

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

  .controller('ViewInvestigation', [
    '$scope', '$state', 'Investigation', '$stateParams', 'Variable', 'Expert',
    function($scope, $state, Investigation, $stateParams, Variable, Expert) {
      var ctrl = this;
      $scope.variablePanelExpanded = true;
      $scope.expertPanelExpanded = true;
      $scope.variables = [];
      $scope.experts = [];

      var loadExperts = function(){
        $scope.experts = Expert.find();
      }

      var loadVariables = function(){
        $scope.variables = Variable.find({ 
          filter: { where: { investigationId: $stateParams.id } }
        });
      }

      $scope.investigation = Investigation.find({ 
        filter: { where: { id: $stateParams.id } }
      });

      loadExperts();
      loadVariables();

      $scope.newVariable = {"weight": 0, "investigationId": $stateParams.id};
      $scope.newExpert = {};

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
        $scope.newExpert.show = true;
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
        Expert.create($scope.newExpert, 
          function(){
            $scope.newExpert.show = false;
            $scope.newExpert.name = "";
            $scope.newExpert.email = "";
            loadExperts();
          });
      }

      $scope.DeleteVariable = function(id){
        Variable.deleteById({ id: id })
          .$promise
          .then(loadVariables);
      }

      $scope.DeleteExpert = function(id){
        Expert.deleteById({ id: id })
          .$promise
          .then(loadExperts);
      }
    }
  ]);

}());