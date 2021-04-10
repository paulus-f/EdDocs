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
import { useBeforeunload } from 'react-beforeunload';

const ice = { iceServers: [{ urls: "stun:stun1.l.google.com:19302" }] };

const JOIN_ROOM = 'JOIN_ROOM';
const START_CONNECTION = 'START_CONNECTION';
const CLOSE_CONNECTION = 'CLOSE_CONNECTION';
const EXIT_FROM_ROOM = 'EXIT_FROM_ROOM';

const Container = styled.div`
    padding: 20px;
    display: flex;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;
const StyledVideo = styled.video`
    height: 70%;
    width: 80%;
		border-radius: 2rem;
`;
const VideoContainer = styled.div`
		color: white;
		text-align: center;
		padding: 10px;
		border-radius: 2rem;
		border-color: white;
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
	const [currentUser, setCurrentUser] = useState(props.currentUser);
	const [peers, setPeers] = useState([]);
	const [isConnected, setIsConnected] = useState(props.isConnected);
	const socketRef = useRef();
	const userVideo = useRef();
	const peersRef = useRef([]);
	const roomID = props.videoChannel.id;
	const broadcastData = props.broadcastData;

	useEffect(() => {
		if(isConnected) {
			socketRef.current = io.connect("localhost:8081/");
			navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
				userVideo.current.srcObject = stream;
				socketRef.current.emit("join room", roomID, currentUser.id, currentUser.email);
				socketRef.current.on("all users", (users, newUserId, newUserEmail, socketId) => {
					const peers = [];
					users.forEach(userID => {
						const peer = createPeer(userID, socketRef.current.id, stream);
						peersRef.current.push({
							peerID: userID,
							userId: newUserId,
							userEmail: newUserEmail,
							peer,
						})
						peers.push({ stream: peer, userId: newUserId, userEmail: newUserEmail, socketId: socketId});
					})
					setPeers(peers);
				});

				socketRef.current.on("user joined", (payload, newUserId, newUserEmail) => {
					const peer = addPeer(payload.signal, payload.callerID, stream);
					peersRef.current.push({
						peerID: payload.callerID,
						userId: newUserId,
						userEmail: newUserEmail,
						peer,
					})

					setPeers(users => [...users, { stream: peer, socketId: payload.callerID, userId: newUserId, userEmail: newUserEmail}]);
				});

				socketRef.current.on("receiving returned signal", payload => {
					const item = peersRef.current.find(p => p.peerID === payload.id);
					item.peer.signal(payload.signal);
				});
				
				socketRef.current.on("user exited", userId => {
					setPeers(peers => {
						console.log('peeeers');
						peersRef.current = peersRef.current.filter(peer => peer.peerID != userId);
						return peers.filter(peer => peer.socketId != userId);
					});
				});
			});
		}
	}, []);

	useEffect( () => {
		return () => {
			console.log('unmount');
			const stream = userVideo.current.srcObject;
			const tracks = stream.getTracks();

			tracks.forEach((track) => {
				track.stop();
			});
		
			userVideo.current.srcObject = null;
			setPeers([]);
			peersRef.current = [];
		}
	}, []);

	useBeforeunload(() => {
		broadcastData({
			type: EXIT_FROM_ROOM,
			from: currentUser.id,
		});
	});


	function createPeer(userToSignal, callerID, stream) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});

		peer.on("signal", signal => {
			socketRef.current.emit("sending signal", { userToSignal, callerID, signal, userId: currentUser.id, userEmail: currentUser.email })
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
					<VideoContainer key={index} container>
						<Video key={index} peer={peer.stream} />
						<h2> {peer.userEmail} </h2>
					</VideoContainer>
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
			channel: null,
		}

		this.handleOpenChannel = this.handleOpenChannel.bind(this);
		this.broadcastData = this.broadcastData.bind(this);
		this.logError = this.logError.bind(this);
		this.createConnection = this.createConnection.bind(this);
	}

	componentDidMount() {
		this.createConnection();
	}

	componentWillUnmount() {
		App.cable.disconnect();
		navigator.getUserMedia.stop();
	}

	createConnection = () => {
    let {currentUser, isConnected, peers } = this.state;

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

          //if (data.from === currentUser.id) return;
          switch (data.type) {
          case JOIN_ROOM:
            return;
					case START_CONNECTION:
						this.setState({ isConnected: !isConnected });
						// Logic ...
						return;
					case CLOSE_CONNECTION:
						this.setState({ isConnected: !isConnected });
						return;
					case EXIT_FROM_ROOM:
						return; 
          }
        }
      }
    );
  };

	handleOpenChannel = (e) => {
		const { currentUser } = this.state;
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

				this.setState({ isConnected: data.isOpen });
				this.broadcastData({
					type: typeConnection,
					from: currentUser.id,
				});
			});
	}

	changePeers = (peers) => {
		this.setState(peers);
	}

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
			return <h1> To close the connection you should close a tab.  </h1>;
		} else {
			return <h1> Waiting a connection... or The call was finished by the creator  </h1>;
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
					{ !isConnected && <h1> Open button is to start a call </h1>}
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
		const { isConnected, videoChannel, isCreator, currentUser, peers } = this.state;
		const channelMenu = isCreator ? this.creatorMenu() : this.studentMenu();

		return (
			<div style={{ paddingTop: 150, backgroundColor: '#1F1B24' }}>
				{channelMenu}
				{isConnected && <Channel peers={peers} changePeers={this.changePeers} broadcastData={this.broadcastData} videoChannel={videoChannel} isConnected={isConnected} currentUser={currentUser} />}
			</div>
		);
	}
};

export default ChannelPage;