var React = require('react');
var Login = require('./Login.jsx');
var GoBackToDejavu = require('./GoBackToDejavu.jsx');

var Importer = React.createClass({
	getInitialState: function() {
		return {
			show: false,
			loggedIn: false
		};
	},
	componentWillMount: function() {
		this.checkLoggedIn();
	},
	checkLoggedIn: function(show) {
		this.userInfo = null;
		this.apps = {};
		this.address = "https://accapi.appbase.io/";
		$.ajaxSetup({
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		});
		$.get(this.address+"user")
			.done(function(data) {
				this.userInfo = data;
				var storageImporter = localStorage.getItem("importer");
				var showFlag = show ? show : (storageImporter && storageImporter === "true" ? true : false);
				this.setState({
					loggedIn: true,
					show: showFlag
				}, function() {
					if(showFlag) {
						$(".typeContainer").addClass("importer-included");
						localStorage.setItem("importer", "false");
					}
				});
			}.bind(this)).fail(function(e) {
				console.log(e);
				if(show) {
					this.setState({
						loggedIn: false,
						show: true
					});
				}
			}.bind(this));
	},
	close: function() {
		$(".typeContainer").removeClass("importer-included");
		this.setState({
			show: false,
		});
	},
	open: function() {
		this.checkLoggedIn(true);
	},
	render: function() {
		return (
			<div className="dejavu-importer">
				<button onClick={this.open} className="btn btn-primary dejavu-importer-btn">
					Import JSON or CSV files
				</button>
				{
					this.state.show && this.state.loggedIn ? (
						<div className="dejavu-importer-iframe-container">
							<iframe src="https://appbaseio-confidential.github.io/importer/?header=false" frameBorder="0" className="dejavu-importer-iframe" />
							<GoBackToDejavu onConfirm={this.close} />
						</div>
					) : null
				}
				{
					this.state.show && !this.state.loggedIn ? (
						<Login showModal={true}></Login>
					) : null
				}
			</div>
		);
	}
});

module.exports = Importer;