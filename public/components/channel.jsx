class Channel extends React.Component {
	onClick(){
		console.log("click", this.props.name);
	}
	render(){
		return (
			<li onClick={this.onClick.bind(this)}>{this.props.name}</li>
		)
	}
}

class ChannelList extends React.Component {
	render(){
		return (
			<ul>
				{this.props.channels.map(
					channel => {
						return (
							<Channel name={channel.name} />
						)
					}
				)}
			</ul>
		)
	}
}

class ChannelForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}
	onSubmit(e){
		let {channelName} = this.state;
		console.log(channelName);
		this.setState( {
			channelName: ''
		});
			
		this.props.addChannel(channelName);
	e.preventDefault();
		}
	onChange(e){
		this.setState( {
			channelName: e.target.value
		});
	}
	render(){
		return(
			<form onSubmit={this.onSubmit.bind(this)}>
			<input type='text' onChange={this.onChange.bind(this)} value={this.state.channelName}/>
			</form>
		)
	}
}

class ChannelSection extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			channels:	[
				{name: 'Hardware Support', selected: false},
				{name: 'Software Support', selected: false}	
			]
		};
	}
	addChannel(name){
		console.log("addChannel");
		let {channels} = this.state;
		channels.push({name:name, selected:false});
		this.setState({channels:channels});
	}
	render(){
		return(
			<div>
				<ChannelList channels={this.state.channels} />
				<ChannelForm addChannel={this.addChannel.bind(this)}  />
			</div>
		)
	}
}


ReactDOM.render(<ChannelSection/>, document.getElementById('app'));