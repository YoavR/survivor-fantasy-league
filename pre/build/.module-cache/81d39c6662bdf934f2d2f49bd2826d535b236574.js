var combineReducers = require('redux').combineReducers;
var _ = require('lodash');
var I = require('immutable');
var List = I.List;
var Map = I.Map;
var Promise = this.Promise || require('promise');
var request = require('superagent-promise')(require('superagent'), Promise);

var initialState = {};
initialState.user = Map({userId: null, isAdmin: false, attempting: false});
// TODO: Install react-router (and react-redux-router) to change week switches
// to URL path's.
initialState.week = Map({selected: null, count: 0});
/* initialState.contestants example:
initialState.contestants = Map({
	"id:1": Map({
		name: "Spencer",
		tribe: "Abu",
		votedFor: "Kass",
		achievements: Map({
			"CRIED": true,
			"HASHTAG": false
		}),
	}),
	"id:2": Map({
		name: "Kass",
		tribe: "Abu",
		votedFor: "Spencer",
		achievements: Map({
			"TREE-MAIL": true
		}),
	})
});
*/
initialState.contestants = Map({
	"id:1": Map({
		name: "Spencer",
		tribe: "Abu",
		votedFor: "Kass",
		achievements: Map({
			"CRIED": true,
			"HASHTAG": false
		}),
	}),
	"id:2": Map({
		name: "Kass",
		tribe: "Abu",
		votedFor: "Spencer",
		achievements: Map({
			"TREE-MAIL": true
		}),
	})
});
initialState.questions = Map({
	"123624": Map({
		question: 'Will Mike eat a banana?',
		type: 'boolean',
		answer: false,
	}),
	"1373457": Map({
		question: 'Who is the one they were talking about?',
		type: 'contestant',
		answer: 'Oren'
	})
});

// A reducer, which takes the state of the store an action passed from the
// store, and returns a new state of the store. It will only return something
// different if the action was relevant.

// State represents log-in status.
var user = function (prev, action) {
	if (typeof prev === 'undefined') {
		return initialState.user;
	}
	switch (action.type) {
		case 'SIGN-OUT':
		return initialState.user
		case 'SIGN-IN-PEND':
		return initialState
			.set(attempting, true);
		case 'SIGN-IN-DONE':
		return initialState
			.set(userId, payload.username)
			.set(isAdmin, payload.isAdmin);
		case 'SIGN-IN-FAIL':
		return initialState
			.set(error, 'Sign-in failed!');
		default:
		return prev;
	}
};
var checkAdminStatus = function (userId) {
	// TODO: Request from server. Default to `false`.
	return false;
};

// State represents week.
var week = function (prev, action) {
	if (typeof prev === 'undefined') {
		return initialState.week;
	}
	switch (action.type) {
		default:
		return prev;
	}
};

// State represents the contestants.
var contestants = function (prev, action) {
	if (typeof prev === 'undefined') {
		return initialState.contestants;
	}
	switch (action.type) {
		case 'TOGGLE-ACHIEVEMENT':
		return prev.updateIn([
			action.payload.contestant,
			'achievements',
			action.payload.achievement
		], function (isAchieved) {
			return !isAchieved;
		});
		default:
		return prev;
	}
};

// State represents the questions and answers.
var questions = function (prev, action) {
	if (typeof prev === 'undefined') {
		return initialState.questions;
	}
	switch (action.type) {
		case 'CREATE-QUESTION':
		return prev
			.set(Math.random(), Map({
				question: '',
				type: 'boolean'
			}));
		// UPDATE // TODO: Add undo functionality.
		case 'UPDATE-QUESTION-PEND':
		return prev
			.setIn([
				action.payload.questionId,
				'prev'
			], prev.get(action.payload.questionId))
			.mergeDeep(Map()
				.set(action.payload.questionId, Map({
					question: action.payload.question,
					answer: action.payload.answer,
					type: action.payload.type,
					isEditing: false
				})
			));
		case 'UPDATE-QUESTION-DONE':
		return prev;
		case 'UPDATE-QUESTION-FAIL':
		return prev
			.set(action.payload.questionId, prev.getIn([
				action.payload.questionId,
				'prev'
			]));
		// EDIT
		case 'EDIT-QUESTION':
		return prev
			.setIn([
				action.payload.questionId,
				'isEditing'
			], !action.payload.isEditing);
		// REMOVE
		case 'REMOVE-QUESTION-PEND':
		return prev
			.setIn([
				action.payload.questionId,
				'removed'
			], true);
		case 'REMOVE-QUESTION-DONE':
		return prev
			.delete(action.payload.questionId);
		case 'REMOVE-QUESTION-FAIL':
		return prev
			.deleteIn([
				action.payload.questionId,
				'removed'
			]);
		// ANSWER
		case 'ANSWER-PEND':
		return prev
			.setIn([
				action.payload.questionId,
				'prevAnswer'
			], prev.getIn[action.payload.questionId, 'answer'])
			.setIn([
				action.payload.questionId,
				'answer'
			], action.payload.answer);
		case 'ANSWER-DONE':
		return prev
			.deleteIn([
				action.payload.questionId,
				'prevAnswer'
			]);
		case 'ANSWER-FAIL':
		return prev
			.setIn([
				action.payload.questionId,
				'answer'
			], prev.getIn[action.payload.questionId, 'prevAnswer'])
			.deleteIn([
				action.payload.questionId,
				'prevAnswer'
			]);
		default:
		return prev;
	}
};

// State represents all achievements of the selected week.
// var achievements = function (prev, action) {
// 	if (typeof prev === 'undefined') {
// 		return initialState.achievements;
// 	}
// 	switch (action.type) {
// 		case 'TOGGLE-ACHIEVEMENT':
// 		return prev.updateIn([
// 			action.payload.contestant,
// 			action.payload.achievement
// 		], function (isAchieved) {
// 			return !isAchieved;
// 		});
// 		case 'WEEK-VIEW-SELECT':
// 		return prev; // TODO: match the achievements.
// 		default:
// 		return prev;
// 	}
// }

var reducers = combineReducers({
	week,
	contestants,
	questions,
	user
});

module.exports = reducers;
