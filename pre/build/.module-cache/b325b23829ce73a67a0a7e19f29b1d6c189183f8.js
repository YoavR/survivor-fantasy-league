var React = require('react');
var PropTypes = React.PropTypes;
var I = require('immutable');
var ImmutablePropTypes = require('react-immutable-proptypes');
// TODO: Do I need `bindActionCreators`? Should I use it?
var bindActionCreators = require('redux').bindActionCreators;
var connect = require('react-redux').connect; // Connect react container to redux.

// Components. // TODO: Add proptypes to components (in their files).
var Week = require('../components/Week'); // Explain...
var Navigation = require('../components/Navigation'); // Explain...
var Profile = require('../components/Profile'); // Explain...
var Tribes = require('../components/Tribes'); // Explain...
var Quiz = require('../components/Quiz'); // Explain...
var Questions = require('../components/Questions'); // Explain...
var Admin = require('../components/Admin'); // Explain...
var computerOfState = require('../helpers/compute-state');
var act = require('../actions'); // Give dispatch an action payload.
// Handle the phase between passportJS sign-in to when the page loads. will
// return false once everything is clear.
var userLoading = require('../helpers/user-loading');
var forcedLogger = require('../helpers/forced-logger');


var Fantasy = React.createClass({displayName: "Fantasy",
	render: function () {
		var p = this.props;
		forcedLogger(p);
		var computedState = computerOfState(p);
		var dispatch = p.dispatch;
		var fullContestants = p.contestants.get('status').mergeDeep(p.contestants.get('info'));
		var circumstances = {
			weekNumber: p.navigation.get('selectedWeek')
		};
		var whatIsLoading = userLoading(p.controller, dispatch, act);
		if (whatIsLoading) {
			return whatIsLoading;
		}
		return (
			React.createElement("div", null, 
				React.createElement(Navigation, {
					key: "navigation", 
					user: p.controller.get('user'), 
					navigation: p.navigation, 
					navigate: function (target) {
						return dispatch(act.navigate(target));
					}}
				), 
				React.createElement(Admin, {
					key: "admin", 
					user: p.controller.get('user'), 
					serverFail: p.controller.get('error'), 
					createQuestion: function (type) {
						return dispatch(act.createQuestion(circumstances, type));
					}}
				), 
				React.createElement("div", {style: {display: p.navigation.get('location') === 'profile' ? 'initial' : 'none'}}, 
				React.createElement(Profile, {
					key: "profile", 
					user: p.controller.get('user'), 
					chosen: p.profile.get('chosen'), 
					info: fullContestants, 
					selector: function (id) {
						return dispatch(act.chooseContestant(id));
					}}
				)
				)
			)
		);
	}
	,
	propTypes: {
		week: ImmutablePropTypes.contains({
			selected: PropTypes.number,
			count: PropTypes.number,
			contestantStatus: ImmutablePropTypes.mapOf(
				ImmutablePropTypes.contains({
					tribe: PropTypes.string.isRequired,
					votedFor: PropTypes.string.isRequired,
					achievements: ImmutablePropTypes.mapOf(PropTypes.bool).isRequired
				})
			)
		}).isRequired
		,
		contestants: ImmutablePropTypes.mapOf(
			ImmutablePropTypes.contains({
				firstName: PropTypes.string.isRequired,
				lastName: PropTypes.string.isRequired,
				age: PropTypes.string.isRequired,
				occupation: PropTypes.string.isRequired,
				previousSeason: PropTypes.string.isRequired,
				place: PropTypes.string.isRequired
			})
		).isRequired
		,
		questions: ImmutablePropTypes.mapOf(
			ImmutablePropTypes.contains({
				question: PropTypes.string.isRequired,
				answer: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
				type: PropTypes.string.isRequired
			})
		).isRequired
		,
		user: ImmutablePropTypes.contains({
			userId: PropTypes.string,
			isAdmin: PropTypes.bool,
			attempting: PropTypes.bool
		}).isRequired
	}
});

// The function `connect` takes a function as argument for
// currying, which dictates how to select properties from
// the state.
var select = function (state) {
	return {
		controller: state.controller,
		navigation: state.navigation,
		profile: state.profile,
		contestants: state.contestants,
		questions: state.questions
	}
};

module.exports = connect(select)(Fantasy);
