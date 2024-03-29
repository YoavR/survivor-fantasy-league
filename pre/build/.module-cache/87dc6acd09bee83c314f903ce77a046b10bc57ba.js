var I = require('immutable');
var Map = I.Map;

contestants = Map({
	"1A1": Map({
		name: 'Jack',
		gender: 'm'
	}),
	"1A2": Map({
		name: 'Karen',
		gender: 'f'
	}),
	"1B1": Map({
		name: 'Oren',
		gender: 'm'
	}),
	"1B2": Map({
		name: 'Alex',
		gender: 'm'
	}),
	"1B3": Map({
		name: 'Rachel',
		gender: 'f'
	}),
	"2A1": Map({
		name: 'Jack',
		gender: 'm'
	}),
	"2A2": Map({
		name: 'Karen',
		gender: 'f'
	}),
	"2B1": Map({
		name: 'Oren',
		gender: 'm'
	}),
	"2B2": Map({
		name: 'Alex',
		gender: 'm'
	}),
	"2B3": Map({
		name: 'Rachel',
		gender: 'f'
	})
});

var Contestant = function (_id) {
	var that = this;
	var getId = function () {
		return _id;
	};
	var getData = function () {
		return contestants.get(that.getId())
	}
	var getName = function () {
		return that.getData().get('name');
	};
	// getImage
	// getAchievements
};

Contestant.prototype.stringify = function (modifier) {
	modifier = modifier || {};
	var str;
	// Check for modifiers. For now we just return the id.
	str = this.getId();
	return str;
};
//
// Contestant.prototype.fetch = function (what) {
// 	// console.error({
// 	// 	fn: 'Contestant.prototype.fetch',
// 	// 	instance: this,
// 	// 	arguments: [what],
// 	// 	details: "Still not programmed.\nI'm supposed to fetch from DB."
// 	// });
// 	var id = this.getId();
// 	switch (what) {
// 		case 'NAME':
//
// 	}
// 	return "fetch error";
// };

module.exports = Contestant;
