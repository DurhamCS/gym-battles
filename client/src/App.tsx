import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { HomePage } from "./HomePage";
import { Icon, ScrollablePaneContext } from "@fluentui/react";
import "./App.css";

import "rodal/lib/rodal.css";
import "./index.css";
import PoseNet from "./components/posenet";

function App() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({} as { [key: string]: any });
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  const userVideo = useRef<any>();
  const partnerVideo = useRef<any>();
  const socket = useRef<any>();
  const myPeer = useRef<any>();

  useEffect(() => {
    socket.current = io.connect("/");

    socket.current.on("yourID", (id: string) => {
      setYourID(id);
    });
    socket.current.on("allUsers", (users: any) => {
      setUsers(users);
    });

    socket.current.on("hey", (data: any) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  function callPeer(id: string) {
    if (id !== "" && users[id] && id !== yourID) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          setStream(stream);
          setCaller(id);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
          const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
              iceServers: [
                {
                  urls: "stun:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683",
                },
                {
                  urls: "turn:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683",
                },
              ],
            },
            stream: stream,
          });

          myPeer.current = peer;

          peer.on("signal", data => {
            socket.current.emit("callUser", {
              userToCall: id,
              signalData: data,
              from: yourID,
            });
          });

          peer.on("stream", stream => {
            if (partnerVideo.current) {
              partnerVideo.current.srcObject = stream;
            }
          });

          peer.on("error", err => {
            endCall();
          });

          socket.current.on(
            "callAccepted",
            (signal: string | Peer.SignalData) => {
              setCallAccepted(true);
              peer.signal(signal);
            }
          );

          socket.current.on("close", () => {
            window.location.reload();
          });

          socket.current.on("rejected", () => {
            window.location.reload();
          });
        })
        .catch(() => {
          alert(
            "You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo."
          );
        });
    } else {
      alert(
        "We think the username entered is wrong. Please check again and retry!"
      );
      return;
    }
  }

  function acceptCall() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        setCallAccepted(true);
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });

        myPeer.current = peer;

        peer.on("signal", data => {
          socket.current.emit("acceptCall", { signal: data, to: caller });
        });

        peer.on("stream", stream => {
          partnerVideo.current.srcObject = stream;
        });

        peer.on("error", err => {
          endCall();
        });

        peer.signal(callerSignal);

        socket.current.on("close", () => {
          window.location.reload();
        });
      })
      .catch(() => {
        alert(
          "You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo."
        );
      });
  }

  function rejectCall() {
    setCallRejected(true);
    socket.current.emit("rejected", { to: caller });
    window.location.reload();
  }

  function endCall() {
    myPeer.current.destroy();
    socket.current.emit("close", { to: caller });
    window.location.reload();
  }

  function toggleMuteAudio() {
    if (stream) {
      setAudioMuted(!audioMuted);
      stream.getAudioTracks()[0].enabled = audioMuted;
    }
  }

  let KeypointCanvas;
  if (stream) {
    KeypointCanvas = (
      <PoseNet handleVideoRef={ref => (userVideo.current = ref)} />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <video
        playsInline
        ref={partnerVideo}
        autoPlay
      />
    );
  }

  const toggleMuteButton = (
    <Icon
      className="icon-btn media-btn"
      style={{ backgroundColor: "#00000088" }}
      iconName={audioMuted ? "MicOff2" : "Microphone"}
      onClick={() => toggleMuteAudio()}
    />
  );

  const hangUpButton = (
    <Icon
      className="icon-btn media-btn"
      iconName="DeclineCall"
      style={{ backgroundColor: "#00000088" }}
      onClick={() => endCall()}
    />
  );

  return (
    <div>
      <div className = 'videos-container'>
        <div className = 'video-container left'>
          {KeypointCanvas}
        </div>
        <div className = 'video-container right'>
          {PartnerVideo}
        </div>
      </div> 
      <div
        className="controlsContainer"
        style={{ margin: 16, position: "absolute", bottom: 0 }}>
        {toggleMuteButton}
        {hangUpButton}
      </div>
      {!callAccepted ? (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            left: 0,
            top: 0,
          }}>
          <HomePage
            yourId={yourID}
            tryCallId={callPeer}
            inboundCallerId={
              receivingCall && !callAccepted && !callRejected ? caller : null
            }
            acceptCall={acceptCall}
            rejectCall={rejectCall}
          />
        </div>
      ) : null}
    </div>
  );
}

export default App;
