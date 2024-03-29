var React = require('react');
var Bs = require('react-bootstrap');
var I = require('immutable');

var Profile = React.createClass({displayName: "Profile",
	shouldComponentUpdate: function (prevProps) {
		var that = this;
		return !I.is(that.props.chosen, prevProps.chosen);
	}
	,
	render: function () {
		return (
			React.createElement(Bs.Carousel, null, 
				this.items()
			)
		);
	}
	,
	items: function () {
		var that = this;
		return this.props.info
			.filter(function (contestant, id) {
				return that.props.chosen.has(id);
			})
			.map(function (contestant, id) {
				return (
					React.createElement(Bs.CarouselItem, {key: id}, 
						React.createElement("img", {width: 900, height: 500, style: {width: 900, height: 500}, alt: 'yo'})
					)
				);
			})
			.toJS();

	}
});

var MyCarouselItem = React.createClass({displayName: "MyCarouselItem",
	shouldComponentUpdate: function (prevProps) {
		return true;
	}
	,
	render: function () {
		return (
			React.createElement("div", null)
		);
	}
})

module.exports = Profile;
