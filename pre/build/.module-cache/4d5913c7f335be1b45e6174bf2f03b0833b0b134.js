var React = require('react');
var AdminToolbox = require('./AdminToolbox');

var Questions = React.createClass({displayName: "Questions",
	render: function () {
		var style = {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center'
		};
		return (
			React.createElement("div", {className: "questions-container", style: style}, 
				this.questions()
			)
		);
	}
	,
	questions: function () {
		var p = this.props;
		return p.questions.map(function (details, id) {
			return (
				React.createElement(Question, {
					key: id, 
					questionId: id, 
					details: details, 
					user: p.user, 
					handlers: p.dispatcher}
				)
			);
		});
	}
});

var Question = React.createClass({displayName: "Question",
	getInitialState: function () {
		// State represents the editing mode.
		return {
			details: this.props.details,
			isEditing: false
		}
	}
	,
	render: function () {
		var style = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			alignItems: 'baseline'
		};
		return (
			React.createElement("div", {className: "question", style: style}, 
				React.createElement("div", {className: "panel panel-default"}, 
					React.createElement("div", {className: "panel-heading"}, 
						this.questionRender(), 
						this.tools()
					), 
					React.createElement("div", {className: "panel-body"}, 
						this.bodyRender()
					)
				)
			)
		);
	}
	,
	questionRender: function () {
		var details = this.props.details;
		if (!details.get('isEditing')) {
			return details.get('question');
		} else {
			return (
				React.createElement("div", {className: "input-group"}, 
					React.createElement("input", {type: "text", className: "form-control", placeholder: "question"})
				)
			);
		}
	}
	,
	bodyRender: function () {
		var isAdmin = this.props.user.get('isAdmin');
		var details = this.props.details;
		// TODO: Add more question costumization tools.
		switch (details.get('type')) {
			case 'boolean':
				var yes = details.get('answer') ? " active" : "";
				var no = details.get('answer') ? " active" : "";
				return (
					React.createElement("div", {className: "btn-group btn-group-lg", role: "group"}, 
						React.createElement("button", {type: "button", className: "btn btn-success" + yes}, "Yes"), 
						React.createElement("button", {type: "button", className: "btn btn-danger" + no}, "No")
					)
				);
			case 'contestant':
				return (
					React.createElement("div", {className: "btn-group btn-group-lg", role: "group"}, 
						React.createElement("button", {type: "button", className: "btn btn-default"}, "Nobody"), 
						React.createElement("button", {type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"}, 
							"Somebody", 
							React.createElement("span", {className: "caret"})
						), 
						React.createElement("ul", {className: "dropdown-menu"}, 
							this.answerContestants()
						)
					)
				);
			default:
				return React.createElement("div", null, "Bad type specified")
		}
	}
	,
	answerContestants: function () {
		// return this.props.tribes.map

		return React.createElement("li", null, React.createElement("a", null, "1"))
	}
	,
	tools: function () {
		var handlers = this.props.handlers;
		var isEditing = this.props.details.get('isEditing');
		var questionId = this.props.questionId;
		var isAdmin = this.props.user.get('isAdmin');
		if (!isAdmin) {
			return;
		}
		if (!isEditing) {
			return (
				React.createElement("div", {className: "toolbox-container"}, 
					React.createElement(AdminToolbox, {
						tool: "edit", 
						handleClick: handlers.edit.bind(null, questionId, isEditing)}
					), 
					React.createElement(AdminToolbox, {
						tool: "remove", 
						handleClick: handlers.remove.bind(null, questionId)}
					)
				)
			);
		} else {
			return (
				React.createElement("div", {className: "toolbox-container"}, 
				React.createElement(AdminToolbox, {
					tool: "discard", 
					handleClick: handlers.edit.bind(null, questionId, isEditing)}
				), 
				React.createElement(AdminToolbox, {
					tool: "approve", 
					handleClick: handlers.update.bind(null, questionId, newQuestion, newAnswer, details.type)}
				)
				)
			);
		}
	}
});

module.exports = Questions;
