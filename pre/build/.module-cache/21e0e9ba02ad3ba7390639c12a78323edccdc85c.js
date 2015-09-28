var React = require('react');
var Bs = require('react-bootstrap');

var Navigation = React.createClass({displayName: "Navigation",
	render: function () {
		return (
			React.createElement(Bs.Navbar, {brand: "Survivor Fantasy League"}, 
				React.createElement(Bs.Nav, {onSelect: this.navigate}, 
					React.createElement(Bs.NavItem, {eventKey: 'profile'}, 
						"Profile"
					), 
					React.createElement(Bs.NavItem, {eventKey: 'weekly'}, 
						"Weekly"
					), 
					React.createElement(Bs.NavItem, {eventKey: 'help'}, 
						"Help"
					), 
					React.createElement(Bs.Nav, {navbar: true, pullRight: true}, 
						React.createElement(Bs.NavItem, {eventKey: 'sign-out'}, 
							"Sign Out"
						)
					)
				)
			)
		);
	}
	,
	navigate: function (target) {
		if (target === 'sign-out') {
			window.location.replace('/sign-out');
		} else {
			this.props.navigate(target);
		}
	}
});

module.exports = Navigation;