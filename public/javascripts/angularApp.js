angular.module('flapperNews', ['ui.router']) //first param is name of module, second is array of dependencies

.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {	//state is a function invocation where 1st param is name, second is obj of options
				url: '/home',		//can look at ui.router documenation to get better understanding
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			})
			.state('posts', {
				url: '/posts/{id}',
				templateUrl: '/posts.html',
				controller: 'PostsCtrl'
			});
		$urlRouterProvider.otherwise('home');
	}
])

.factory('postsFactory', [function(){		//first param is name of factory, second is array of dependencies (dpncy injection)
	var o = {																			//Nth item in array is function declaration
		posts: []
	};
	return o;
}])

.controller('MainCtrl', [
	'$scope',
	'postsFactory',
	function($scope, postsFactory){
		$scope.posts = postsFactory.posts;
		$scope.addPost = function(){
			if(!$scope.title || $scope.title === '') { return; }
			$scope.posts.push({
				title: $scope.title, 
				link: $scope.link,
				upvotes: 1,
				comments: [
					{author: 'Joe', body: 'Cool post!', upvotes: 1},
					{author: 'Bob', body: 'Great idea', upvotes: 1},
				]});
			$scope.title = '';
			$scope.link = '';
		};
		$scope.incrementUpvotes = function(post) {
			post.upvotes += 1;
		}
	}
])

.controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'postsFactory',
	function($scope, $stateParams, postsFactory){
		$scope.post = postsFactory.posts[$stateParams.id];
		$scope.addComment = function(){
			if($scope.body === '') { return; }
			$scope.post.comments.push({
				body: $scope.body,
				author: 'user',
				upvotes: 1
			});
			$scope.body = '';
		};
		$scope.incrementUpvotes = function(comment) {
			comment.upvotes += 1;
		}
	}
]);
/*
var factories = {
	'posts' : {
     posts : []
	},
	'users' : function() {
		return {
			name : 'Bob'
		};
	}
}
*/