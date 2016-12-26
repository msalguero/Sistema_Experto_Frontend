(function () {

'use strict';


  angular.module('InvestigationApp', ['ngAnimate', 'ngAria', 'ui.router', 'lbServices', 'ui.sortable', 'ngMaterial'])

  .config([
    '$stateProvider',
    'LoopBackResourceProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, LoopBackResourceProvider,$urlRouterProvider,$locationProvider) {

      LoopBackResourceProvider.setUrlBase('https://rubric-expert.herokuapp.com/api');
      //LoopBackResourceProvider.setUrlBase('http://localhost:3000/api');


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

      var surveyDashboardState = { 
        name: 'main.surveyDashboard', 
        url: 'open-investigation/:id', 
        templateUrl: "./investigation/Survey/surveyList.html",
        controller: 'SurveyList'
      };

      var choosePollTypeState = { 
        name: 'main.pollType', 
        url: 'choose-poll-type/:id', 
        templateUrl: "./investigation/Survey/choosePollType.html",
        controller: 'ChoosePollType'
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

      var removeDimensionsState = { 
        name: 'main.removeDimensions', 
        url: 'remove-dimensions/:id', 
        templateUrl: "./investigation/RemoveDimensions/removeDimensions.html",
        controller: 'RemoveDimensions'
      };

      var assignWeightsState = { 
        name: 'main.assignWeights', 
        url: 'assign-weights/:id', 
        templateUrl: "./investigation/AssignWeights/assignWeights.html",
        controller: 'AssignWeights'
      };

      $urlRouterProvider.otherwise('/');


      $stateProvider.state(registerState);
      $stateProvider.state(loginState);
      $stateProvider.state(mainState);
      $stateProvider.state(investigationState);
      $stateProvider.state(surveyDashboardState);
      $stateProvider.state(choosePollTypeState);
      $stateProvider.state(createInvestigationState);
      $stateProvider.state(viewInvestigationState);
      $stateProvider.state(pollState);
      $stateProvider.state(createPollState);
      $stateProvider.state(answerPollAbstractState);
      $stateProvider.state(answerPollState);
      $stateProvider.state(removeExpertsState);
      $stateProvider.state(removeDimensionsState);
      $stateProvider.state(assignWeightsState);
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }
  ])



  .run(function ($rootScope, Account, $state ) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var authorizedUser = Account.isAuthenticated();
      if (!authorizedUser && next.name !== 'login') {
        $state.go("login");
        
      }

    });
  })

}());
