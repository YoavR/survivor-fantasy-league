var React = require('react');
var Bs = require('react-bootstrap');
var I = require('immutable');
var PropTypes = React.PropTypes;
var ImmutablePropTypes = require('react-immutable-proptypes');
var nameToImg = require('../helpers/image-name')('contestant');

var MyThumbnail = React.createClass({
	shouldComponentUpdate: function (nextProps) {
		return !(this.props.selected === nextProps.selected);
	}
	,
	render: function () {
		var p = this.props;
		var that = this;
		var tooltip = <Bs.Tooltip>{p.name}</Bs.Tooltip>;
		return (
			<Bs.OverlayTrigger placement="top" overlay={tooltip} key={p.id} id={p.name}>
				<Bs.Thumbnail
					onClick={that.props.choose.bind(null, p.id)}
					src={nameToImg(p.name)}
					alt={p.name}
					style={{display: 'inline-block', border: (p.selected ? "3px solid green" : ""), width: '80px', marginRight: '10px', marginLeft: '10px'}}
				/>
			</Bs.OverlayTrigger>
		);
	}
	,
	propTypes: {
		selected: PropTypes.bool.isRequired
		,
		name: PropTypes.string.isRequired
		,
		id: PropTypes.any.isRequired
	}
});

module.exports = MyThumbnail;