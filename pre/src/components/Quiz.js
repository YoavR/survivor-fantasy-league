var React = require('react/addons');
var Bs = require('react-bootstrap');
var AdminToolbox = require('./AdminToolbox');
var AnswerTypes = require('./AnswerTypes');
var Contestants = AnswerTypes.Contestants;
var Tribes = AnswerTypes.Tribes;
var Num = AnswerTypes.Num;

var now;
function mod(n, m) {
	return ((n % m) + m) % m;
}

var Quiz = React.createClass({
	componentWillUpdate: function () {
		now = Date.now();
	}
	,
	componentDidUpdate: function (prevProps, prevState) {
		console.log('Rendering `Quiz` took: ' + (Date.now() - now) + 'ms.');
	}
	,
	render: function () {
		console.info('Quiz');
		if (this.props.user.get('isAdmin')) {
			return <div/>;
		}
		return (
			<Bs.Row>
				<Bs.Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2}>
					<Bs.Pager>
						<Bs.PageItem onClick={this.changeQuestion.bind(this, -1)}>Previous</Bs.PageItem>
						<Bs.PageItem onClick={this.changeQuestion.bind(this, +1)}>Next</Bs.PageItem>
					</Bs.Pager>
					{this.questions()}
				</Bs.Col>
			</Bs.Row>
		);
	}
	,
	changeQuestion: function (inc) {
		this.props.dispatcher.switchQuestion(inc);
	}
	,
	questions: function () {
		var p = this.props;
		var selected = mod(p.selected, p.questions.size);
		var count = -1;
		return React.addons.createFragment(
			p.questions
				.filter(function (details, id) {
					return (id !== 'removed') && !details.get('removed');
				})
				.map(function (details, id) {
					count++;
					return (
						<div style={{display: count === selected ? 'initial' : 'none'}}>
						<Question
							key={id}
							questionId={id}
							numbering={{is: mod(p.selected, p.questions.size)+1, of: p.questions.size}}
							details={details}
							contestants={p.contestants.filter(function (contestant) {
								return contestant.getIn(['weeks', p.weekNumber, 'tribe']);
							})}
							tribes={require('../helpers/tribe-grouping')(p.weekNumber, p.contestants)}
							user={p.user}
							open={p.open}
							handlers={p.dispatcher}
						/>
						</div>
					);
				})
				.toJS()
		);
	}
});

var Question = React.createClass({
	getInitialState: function () {
		// State represents the editing mode.
		return this.props.details.toJS();
	}
	,
	render: function () {
		var stylePanelHeadingInner = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center'
		};
		var stylePanelFooterInner = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center'
		};
		return (
			<Bs.Panel eventKey={this.props.id} header={
				<div style={stylePanelHeadingInner}>
					{this.questionRender()}
					{/*this.tools()*/}
					<div className="badge pull-right">
					{this.props.numbering.is + " / " + this.props.numbering.of}
					</div>
				</div>
			} footer={<div style={stylePanelFooterInner}>{this.footerRender()}</div>}>
					{this.bodyRender()}
			</Bs.Panel>
		);
	}
	,
	questionRender: function () {
		var details = this.props.details;
		var style = {
			flexGrow: '1',
			flexShrink: '1',
			marginRight: '10px'
		}
		if (!details.get('isEditing')) {
			return <h3 className="panel-title" style={style}>{details.get('question')}</h3>;
		} else {
			return (
				<input
					type="text"
					className="form-control"
					placeholder="question"
					style={style}
					value={this.state.question}
					onChange={this.onText}
				/>
			);
		}
	}
	,
	bodyRender: function () {
		var details = this.props.details;
		var isEditing = details.get('isEditing');
		var answer = isEditing ? this.state.answer : details.get('answer');
		// NOTE: Changing the type is supported, but not implemented here.
		switch (details.get('type')) {
			case 'boolean':
			return (
				<div style={{display: 'flex', justifyContent: 'space-around'}}>
					<Bs.Button bsStyle="success" active={answer} onClick={this.changeAnswer.bind(this, true)} disabled={!this.props.open}>Yes</Bs.Button>
					<Bs.Button bsStyle="danger" active={!answer} onClick={this.changeAnswer.bind(this, false)} disabled={!this.props.open}>No</Bs.Button>
				</div>
			);
			case 'contestant':
			return (
				<Contestants
					answer={answer}
					disabled={!this.props.open}
					contestants={this.props.contestants}
					changeAnswer={this.changeAnswer}
				/>
			);
			case 'tribe':
			return (
				<Tribes
					answer={answer}
					disabled={!this.props.open}
					tribes={this.props.tribes}
					changeAnswer={this.changeAnswer}
				/>
			);
			case 'number':
			return (
				<Num
					answer={answer}
					disabled={!this.props.open}
					changeAnswer={this.changeAnswer}
				/>
			);
			default:
			return <div>Bad type specified</div>
		}
	}
	,
	footerRender: function () {
		var details = this.props.details;
		var answer = details.get('answer');
		switch (details.get('type')) {
			case 'boolean':
			if (typeof answer !== 'boolean') {
				return false;
			}
			if (answer) {
				return <div>You answered <strong>Yes</strong></div>;
			} else {
				return <div>You answered <strong>No</strong></div>;
			}
			case 'contestant':
			if (answer) {
				answer = this.props.contestants.get(answer);
				return <div>You answered <strong>{answer.get('firstName') + " " + answer.get('lastName')}</strong></div>;
			} else {
				return <div>You answered <strong>No One</strong></div>;
			}
			case 'tribe':
			if (answer) {
				return <div>You answered <strong>{answer}</strong></div>;
			} else {
				return <div>You answered <strong>No Tribe</strong></div>;
			}
			case 'number':
			if (typeof answer !== 'number') {
				return false;
			}
			if (answer) {
				return <div>You answered <strong>{answer}</strong></div>;
			} else {
				return false;
			}
			default:
			return false;
		}
	}
	,
	tools: function () {
		var handlers = this.props.handlers;
		var questionId = this.props.questionId;
		var isAdmin = this.props.user.get('isAdmin');
		var isEditing = this.props.details.get('isEditing');
		var style = {
			flexGrow: '0',
			flexShrink: '0',
			alignSelf: 'flex-start'
		}
		if (!isAdmin) {
			return;
		}
		return (
			<div className="btn-group" role="group" aria-label="..." style={style}>
				<AdminToolbox
					tool={isEditing ? "discard" : "edit"}
					handleClick={handlers.edit.bind(null, questionId, !!isEditing)}
				/>
				<AdminToolbox
					tool={isEditing ? "approve" : "remove"}
					handleClick={isEditing ? handlers.update.bind(null, questionId, this.state.question, this.state.answer, this.state.type) : handlers.remove.bind(null, questionId)}
				/>
			</div>
		);
	}
	,
	onText: function (e) {
		this.setState({question: e.target.value});
	}
	,
	changeAnswer: function (answer, e) {
		var handlers = this.props.handlers;
		var questionId = this.props.questionId;
		var isAdmin = this.props.user.get('isAdmin');
		var isEditing = this.props.details.get('isEditing');
		var adminEdit = isAdmin && isEditing;
		var userEdit = !isAdmin;
		if (adminEdit) this.setState({answer: answer});
		if (userEdit) handlers.userAnswer(questionId, answer);
	}
});

module.exports = Quiz;
