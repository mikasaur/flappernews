angular.module('flapperNews', ['ui.router']) //first param is name of module, second is array of dependencies

.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {	//state is a function invocation where 1st param is name, second is obj of options
				url: '/home',		//can look at ui.router documenation to get better understanding
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve: {
				  postPromise: ['postsFactory', function(postsFactory){
				    return postsFactory.getAll();
				  }]
				}
			})
			.state('posts', {
				url: '/posts/{id}',
				templateUrl: '/posts.html',
				controller: 'PostsCtrl',
				resolve: {
					post: ['$stateParams', 'postsFactory', function($stateParams, postsFactory){
						return postsFactory.get($stateParams.id);
					}]
				}
			});
		$urlRouterProvider.otherwise('home');
	}
])

.factory('postsFactory', ['$http', function($http){		//first param is name of factory, second is array of dependencies (dpncy injection)
	var o = {																			//Nth item in array is function declaration
		posts: []
	};
	o.getAll = function() {
		return $http.get('/posts').success(function(data){
			angular.copy(data, o.posts);
		});
	};
	o.create = function(post) {
		return $http.post('/posts', post).success(function(data) {
			o.posts.push(data);
		});
	};
	o.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote')
			.success(function(data){
				post.upvotes += 1;
			});
	}
	o.get = function(id) {
		return $http.get('/posts/' + id).then(function(res){
			return res.data;
		});
	};
	o.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	};
	o.upvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
			.success(function(data){
				comment.upvotes += 1;
			});
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
			postsFactory.create({
				title: $scope.title,
				link: $scope.link,
			});
			$scope.title = '';
			$scope.link = '';
		};
		$scope.incrementUpvotes = function(post) {
			postsFactory.upvote(post);
		}
	}
])

.controller('PostsCtrl', [
	'$scope',
	'postsFactory',
	'post',
	function($scope, postsFactory, post){
		$scope.post = post;
		$scope.addComment = function(){
			if($scope.body === '') { return; }
			postsFactory.addComment(post._id, {
				body: $scope.body,
				author: 'user',
			}).success(function(comment) {
				$scope.post.comments.push(comment);
			});
			$scope.body = '';
		};
		$scope.incrementUpvotes = function(comment) {
			postsFactory.upvoteComment(post, comment);
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