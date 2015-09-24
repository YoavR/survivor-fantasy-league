var React = require('react');
var Contestant = require('./Contestant');
var Achievements = require('./Achievements');

var Tribes = React.createClass({displayName: "Tribes",
	render: function () {
		return (
			React.createElement("div", {className: "row"}, 
				this.tribes()
			)
		);
	}
	,
	tribes: function () {
		var that = this;
		return this.props.contestants
			.groupBy(function (contestant) {
				return contestant.get('tribe');
			}).map(function (tribe, name) {
				return (
					React.createElement("div", {className: "col-xs-12", key: name}, 
						React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("h2", null, name))), 
						that.membersOf(tribe)
					)
				);
			});
	}
	,
	membersOf: function (tribe) {
		var that = this;
		// var gotVotesFrom = tribe
		// 	.groupBy(function (contestant) {
		// 		return contestant.get('votedFor');
		// 	})
		// 	.map(function (voteOrigins) {
		// 		return voteOrigins.keySeq();
		// 	});
		// var votedOut = gotVotesFrom
		// 	.maxBy(function (voteOrigins) {
		// 		return voteOrigin.count();
		// 	}, function (a, b) {
		// 		a > b;
		// 	});
		// console.log(gotVotesFrom.toString());
		// console.log(votedOut);
		return tribe.map(function (contestant, id) {
			return (
				React.createElement("div", {className: "row", key: id}, 
					React.createElement(Contestant, {
						contestant: id, 
						name: contestant.get('firstName') + " " + contestant.get('lastName'), 
						age: contestant.get('age'), 
						occupation: contestant.get('occupation'), 
						previousSeason: contestant.get('previousSeason'), 
						place: contestant.get('place'), 
						scores: that.props.scores.get(id)}
					), 
					React.createElement(Achievements, {
						contestant: id, 
						isAdmin: that.props.user.get('isAdmin'), 
						achievements: contestant.get('achievements'), 
						scores: that.props.scores.get(id), 
						toggleAchievement: that.props.toggleAchievement}
					)
				)
			);
		});
	}
});

module.exports = Tribes;
