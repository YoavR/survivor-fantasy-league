var React = require('react');
var ContestantObj = require('../objects/Contestant');

var Contestant = React.createClass({displayName: "Contestant",
	render: function () {
		var me = new ContestantObj(this.props.contestantId);
		console.log(me.getId());
		return (
			React.createElement("div", {className: "tribe-mate"}, 
				React.createElement("div", {className: "tribe-mate-name"}, 
					me.getName()
				), 
				React.createElement("div", {className: "tribe-mate-image"}, 
					'IMAGE'
				), 
				React.createElement("div", {className: "tribe-mate-achievements"}, 
					React.createElement(Achievements, {
						marked: this.props.achievements}
					)
				)
			)
		);
	}
});

module.exports = Contestant;
