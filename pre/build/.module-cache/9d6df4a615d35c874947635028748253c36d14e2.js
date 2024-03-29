var combineReducers = require('redux').combineReducers;
var dummyDB = require('./dummyDB'); // The dummy for a JSON database.
var _ = require('lodash');
var I = require('immutable');
var List = I.List;
var Map = I.Map;
// TODO: Store tree in some DB and make editable.

// A reducer, which takes the state of the store an action passed from the
// store, and returns a new state of the store. It will only return something
// different if the action was relevant.

/**
 * The state parameters:
 * @var selected is the week selected. -1 indicates none.
 * @var count is the number of weeks that exist.
 */
var week = function (prev, action) {
	if (typeof prev === 'undefined') {
		return Map({selected: -1, count: dummyDB.Weeks.size});
	}
	switch (action.type) {
		case 'WEEK-VIEW-SELECT':
		return perv.update(selected, action.payload);
		case 'WEEK-EDIT-NEW':
		var count = prev.count + 1;
		return perv.update(count, count);
		default:
		return prev;
	}
};

// State represents the tribes.
var tribes = function (prev, action) {
	if (typeof prev === 'undefined') {
		return dummyDB.Weeks.get(0).get("tribes");
	}
	switch (action.type) {
		case 'WEEK-VIEW-SELECT':
		return dummyDB.Weeks.has(action.payload) ? dummyDB.Weeks.get(action.payload).get("tribes") : prev;
		default:
		return prev;
	}
};

// State represents the questions and answers.
var questions = function (prev, action) {
	if (typeof prev === 'undefined') {
		return Map({});
	}
	switch (action.type) {
		case 'QUESTION':
		return Map(_.assign(prev, {
			question: action.payload,
			answer: null
		}));
		case 'ANSWER':
		return Map(_.assign(prev, {
			question: action.payload.question,
			answer: action.payload.answer
		}));
		default:
		return prev;
	}
};

var reducers = combineReducers({
	week,
	tribes,
	questions
});

module.exports = reducers;
