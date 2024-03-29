var React = require('react/addons');
var Bs = require('react-bootstrap');
var Contestant = require('./Contestant');
var Achievements = require('./Achievements');

var Tribes = React.createClass({displayName: "Tribes",
	shouldComponentUpdate: function (nextProps) {
		return !!this.props.user.get('isAdmin') || this.props.weekNumber !== nextProps.weekNumber;
	}
	,
	render: function () {
		console.info('Tribes');
		return (
			React.createElement(Bs.Row, null, 
				this.tribes()
			)
		);
	}
	,
	tribes: function () {
		var that = this;
		var byTribe = that.props.contestants
			.groupBy(function (contestant) {
				return contestant.getIn(['weeks', that.props.weekNumber, 'tribe']);
			})
			.filter(function (tribe, name) {return !!name;}); // Works for empty string and undefined.
		return React.addons.createFragment(
			byTribe
				.map(function (tribe, name) {
					if (!name) { // Remove filter for this to not be vacant.
						name = "Voted Out";
					}
					var columns = byTribe.count(); // Remove -1 when removing filter.
					return (
						React.createElement(Bs.Col, {sm: 12, md: 12/columns, key: name}, 
							React.createElement("h2", null, name), 
							React.createElement(Bs.Accordion, null, 
								that.membersOf(tribe)
							)
						)
					);
				}).toJS()
		);
	}
	,
	membersOf: function (tribe) {
		var that = this;
		return React.addons.createFragment(
			tribe.map(function (contestant, id) {
				var name = contestant.get('firstName') + " " + contestant.get('lastName');
				return (
					React.createElement(Bs.Panel, {header: name, eventKey: id}, 
						React.createElement(Contestant, {
							contestant: id, 
							name: name, 
							age: contestant.get('age'), 
							occupation: contestant.get('occupation'), 
							previousSeason: contestant.get('previousSeason'), 
							place: contestant.get('place'), 
							scores: that.props.scores.get(id), 
							votedOut: contestant.getIn(['weeks', that.props.weekNumber, 'achievements', 'VOTED-OUT'])}
						), 
						React.createElement(Achievements, {
							contestant: id, 
							weekNumber: that.props.weekNumber, // For `VOTED-OUT` achievement
							isAdmin: that.props.user.get('isAdmin'), 
							achievements: contestant.getIn(['weeks', that.props.weekNumber, 'achievements']), 
							scores: that.props.scores.get(id), 
							toggleAchievement: that.props.toggleAchievement}
						)
					)
				);
			}).toJS()
		);
	}
});

module.exports = Tribes;
