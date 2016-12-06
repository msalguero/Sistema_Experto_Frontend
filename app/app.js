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

  // .use(function(req, res){
  //   res.sendFile('index.html', {root : './'})
  // });

}());
