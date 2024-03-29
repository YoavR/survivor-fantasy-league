var React = require('react');

var toolToGlyphcon = {
	'edit': "pencil",
	'remove': "remove",
	'add': "plus",
	'approve': "ok",
	'discard': "pencil"
};

// I am using the AdminToolbox for the `add` which has an adjacent dropdown,
// hence the state and the wierd `if` statement. This solution is not ideal.
var AdminToolbox = React.createClass({displayName: "AdminToolbox",
	getInitialState: function () {
		return {
			type: 'bool'
		};
	}
	,
	render: function () {
		var glyphicon = toolToGlyphcon[this.props.tool];
		if (this.props.tool === 'add') {
			return (
				React.createElement("div", {className: "btn-group", role: "group", "aria-label": "..."}, 
					React.createElement("button", {type: "button", className: "btn btn-default btn-lg", onClick: this.props.handleClick}, 
						React.createElement("span", {className: "glyphicon glyphicon-" + glyphicon, "aria-hidden": "true"})
					), 
					React.createElement("div", {className: "btn-group", role: "group", "aria-label": "..."}, 
						React.createElement("button", {type: "button", className: "btn btn-default btn-lg dropdown-toggle", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"}, 
							this.state.type + " ", 
							React.createElement("span", {className: "caret"})
						), 
						React.createElement("ul", {className: "dropdown-menu"}, 
							React.createElement("li", {onClick: this.chooseType.bind(this, 'bool')}, React.createElement("a", null, "bool")), 
							React.createElement("li", {onClick: this.chooseType.bind(this, 'contestant')}, React.createElement("a", null, "contestant"))
						)
					)
				)
			);
		}
		return (
			React.createElement("button", {type: "button", className: "btn btn-default btn-sm", onClick: this.props.handleClick}, 
				React.createElement("span", {className: "glyphicon glyphicon-" + glyphicon, "aria-hidden": "true"})
			)
		);
	}
	,
	chooseType: function (type) {
		this.setState({type: type});
	}
});

module.exports = AdminToolbox;
