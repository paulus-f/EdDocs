import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Functions from '../utils/Functions'
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import styled from 'styled-components';
import ReactDOM from "react-dom";

const ice = { iceServers: [{ urls: "stun:stun1.l.google.com:19302" }] };

const JOIN_ROOM = 'JOIN_ROOM';
const EXCHANGE = 'EXCHANGE';
const REMOVE_USER = 'REMOVE_USER';
const START_CONNECTION = 'START_CONNECTION';
const CLOSE_CONNECTION = 'CLOSE_CONNECTION';

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;
const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
	const ref = useRef();

	useEffect(() => {
		props.peer.on("stream", stream => {
			ref.current.srcObject = stream;
		})
	}, []);

	return (
		<StyledVideo playsInline autoPlay ref={ref} />
	);
}

const videoConstraints = {
	height: window.innerHeight / 2,
	width: window.innerWidth / 2
};

const Channel = (props) => {
	const [peers, setPeers] = useState([]);
	const [isConnected, setIsConnected] = useState(props.isConnected);
	const socketRef = useRef();
	const userVideo = useRef();
	const peersRef = useRef([]);
	const roomID = props.videoChannel.id;

	useEffect(() => {
		if(isConnected) {
			socketRef.current = io.connect("localhost:8081/");
			navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
				userVideo.current.srcObject = stream;
				socketRef.current.emit("join room", roomID);
				socketRef.current.on("all users", users => {
					const peers = [];
					users.forEach(userID => {
						const peer = createPeer(userID, socketRef.current.id, stream);
						peersRef.current.push({
							peerID: userID,
							peer,
						})
						peers.push(peer);
					})
					setPeers(peers);
				})

				socketRef.current.on("user joined", payload => {
					const peer = addPeer(payload.signal, payload.callerID, stream);
					peersRef.current.push({
						peerID: payload.callerID,
						peer,
					})

					setPeers(users => [...users, peer]);
				});

				socketRef.current.on("receiving returned signal", payload => {
					const item = peersRef.current.find(p => p.peerID === payload.id);
					item.peer.signal(payload.signal);
				});
			});
		}
	}, []);

	function createPeer(userToSignal, callerID, stream) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});

		peer.on("signal", signal => {
			socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
		})

		return peer;
	}

	function addPeer(incomingSignal, callerID, stream) {
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		})

		peer.on("signal", signal => {
			socketRef.current.emit("returning signal", { signal, callerID })
		})

		peer.signal(incomingSignal);

		return peer;
	}

	return (
		<Container>
			<StyledVideo muted ref={userVideo} autoPlay playsInline />
			{peers.map((peer, index) => {
				return (
					<Video key={index} peer={peer} />
				);
			})}
		</Container>
	);
};

class ChannelPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			videoChannel: props.videoChannel,
			currentUser: props.currentUser,
			isCreator: props.isCreator,
			isOpenAlert: true,
			isConnected: props.videoChannel.open,
			token: Functions.getMetaContent("csrf-token"),
			channel: null
		}

		this.handleOpenChannel = this.handleOpenChannel.bind(this);
		this.handleLeaveConnection = this.handleLeaveConnection.bind(this);
		this.broadcastData = this.broadcastData.bind(this);
		this.logError = this.logError.bind(this);
		this.createConnection = this.createConnection.bind(this);
		this.channelRef = React.createRef();
	}

	componentDidMount() {
		const { isConnected, videoChannel } = this.state;
		this.createConnection();
		if(isConnected) {
			this.setState({
				channel: <Channel ref={this.channelRef} videoChannel={videoChannel} isConnected={isConnected} />
			})
		}
	}

	componentWillUnmount() {
		App.cable.disconnect();
		navigator.getUserMedia.stop();
	}

	createConnection = () => {
    let {currentUser, isConnected } = this.state;

    App.cable.subscriptions.create(
      {
        channel: 'ConnectionChannel',
        video_channel_id: this.state.videoChannel.id
      },
      {
        connected: () => {
          this.broadcastData({
            type: JOIN_ROOM,
            from: this.state.currentUser.id,
          });
        },
        received: (data) => {
          console.log('received', data);
          if (data.from === currentUser.id) return;
          switch (data.type) {
          case JOIN_ROOM:
            return;
          case EXCHANGE:
            if (data.to !== currentUser.id) return;
            return;
          case REMOVE_USER:
            return;
					case START_CONNECTION:
						return;
					case CLOSE_CONNECTION:
						return;
          default:
            return;
          }
        }
      }
    );
  };

	handleOpenChannel = (e) => {
		const { currentUser , channel} = this.state;
		const ref = this.channelRef
		const headers = new Headers({
      "content-type": "application/json",
			"X-CSRF-TOKEN": this.state.token,
    });

    fetch(`/video_channels/${this.state.videoChannel.id}/change_state`, {
      method: "POST",
      headers,
    }).then(req => req.json())
			.then(data =>{
				const typeConnection = data.isOpen ? START_CONNECTION : CLOSE_CONNECTION;

				if(!data.isOpen) {
					//ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(ref));
				}
				this.setState({
					isConnected: data.isOpen,
					channel: data.isOpen ? <Channel ref={this.channelRef} videoChannel={this.state.videoChannel} isConnected={data.isOpen} /> : null
				});
				this.broadcastData({
					type: typeConnection,
					from: currentUser.id,
				});
			});
	}

  handleLeaveConnection = () => {
    const {currentUser, isConnected} = this.state;

    App.cable.disconnect();

    this.broadcastData({
      type: REMOVE_USER,
      from: currentUser.id,
    });
  };

  broadcastData = (data) => {
    const headers = new Headers({
      "content-type": "application/json",
      "X-CSRF-TOKEN": this.state.token,
    });

    fetch(`/video_channels/${this.state.videoChannel.id}/create_connection`, {
      method: "POST",
      body: JSON.stringify({ connection: {...data} }),
      headers,
    });
  };

  logError = (error) => console.warn("Whoops! Error:", error);

	studentMenu() {
		const {isConnected} = this.state;

		if(isConnected) {
			return <h1> To close connection you shoud close a tab.  </h1>;
		} else {
			return <h1> Waiting a starting connection...  </h1>;
		}
	};

	creatorMenu() {
		const {isConnected} = this.state;

		const openButton = <Button variant='contained' color='primary' onClick={this.handleOpenChannel}>
												 Open
											 </Button>;

		const closeConnectionButton = <Button variant='contained' color='primary' onClick={this.handleOpenChannel}>
																		End Call
																	</Button>;

		return (
			<Grid container spacing={3}>
				<Grid container item xs={4} spacing={3}/>
				<Grid container item xs={4} spacing={3}>
					{ !isConnected && <h1> Open button is to start a lesson </h1>}
				</Grid>
				<Grid container item xs={4} spacing={3}/>

				<Grid container item xs={4} spacing={3}>
				</Grid>
				<Grid container item xs={4} spacing={3}>
				  {!isConnected && openButton}
				  {isConnected && closeConnectionButton}
				</Grid>
				<Grid container item xs={4} spacing={3}>
				</Grid>
			</Grid>
		)
	};

	render() {
		const { isConnected, videoChannel, isCreator, channel } = this.state;
		const channelMenu = isCreator ? this.creatorMenu() : this.studentMenu();

		return (
			<div style={{ paddingTop: 150 }}>
				{channelMenu}
				{channel}	
			</div>
		);
	}
};

export default ChannelPage;