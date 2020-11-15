import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { HomePage } from "./HomePage";
import Peer from "simple-peer";
import io from "socket.io-client";
import { CallView } from "./CallView";

function App() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({} as { [key: string]: any });
  const [stream, setStream] = useState<MediaStream>();
  const [partnerStream, setPartnerStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  let userVideoRef: React.RefObject<HTMLVideoElement> | null = null;
  let partnerVideoRef: React.RefObject<HTMLVideoElement> | null = null;
  const socket = useRef<SocketIOClient.Socket>();
  const myPeer = useRef<Peer.Instance>();

  useEffect(() => {
    socket.current = io.connect("/");

    socket.current.on("yourID", (id: any) => {
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
          if (userVideoRef?.current != null)
            userVideoRef.current.srcObject = stream;
          setCaller(id);
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
            socket.current?.emit("callUser", {
              userToCall: id,
              signalData: data,
              from: yourID,
            });
          });

          peer.on("stream", stream => {
            setPartnerStream(stream);
            if (partnerVideoRef?.current != null)
              partnerVideoRef.current.srcObject = stream;
          });

          peer.on("error", err => {
            endCall();
          });

          socket.current?.on(
            "callAccepted",
            (signal: string | Peer.SignalData) => {
              setCallAccepted(true);
              peer.signal(signal);
            }
          );

          socket.current?.on("close", () => {
            window.location.reload();
          });

          socket.current?.on("rejected", () => {
            window.location.reload();
          });
        })
        .catch(() => {
          alert(
            "You cannot place / receive a call without granting video and audio permissions! Please change your settings."
          );
        });
    } else {
      alert(
        "We think the code entered is wrong. Please check again and retry!"
      );
      return;
    }
  }

  function acceptCall() {
    //ringtoneSound.unload();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
        if (userVideoRef?.current != null)
          userVideoRef.current.srcObject = stream;
        setCallAccepted(true);
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });

        myPeer.current = peer;

        peer.on("signal", data => {
          socket.current?.emit("acceptCall", { signal: data, to: caller });
        });

        peer.on("stream", stream => {
          setPartnerStream(stream);
          if (partnerVideoRef?.current != null)
            partnerVideoRef.current.srcObject = stream;
        });

        peer.on("error", err => {
          endCall();
        });

        peer.signal(callerSignal);

        socket.current?.on("close", () => {
          window.location.reload();
        });
      })
      .catch(() => {
        alert(
          "You cannot place / receive a call without granting video and audio permissions! Please change your settings."
        );
      });
  }

  function rejectCall() {
    setCallRejected(true);
    socket.current?.emit("rejected", { to: caller });
    window.location.reload();
  }

  function endCall() {
    myPeer.current?.destroy();
    socket.current?.emit("close", { to: caller });
    window.location.reload();
  }

  function toggleMuteAudio() {
    if (stream) {
      setAudioMuted(!audioMuted);
      stream.getAudioTracks()[0].enabled = audioMuted;
    }
  }

  function onVideoRefsPopulated(
    u: React.RefObject<HTMLVideoElement>,
    p: React.RefObject<HTMLVideoElement>
  ) {
    userVideoRef = u;
    partnerVideoRef = p;
    u.current!.srcObject = stream!;
    p.current!.srcObject = partnerStream!;
  }

  return (
    <div className="App">
      {!callAccepted ? (
        <HomePage
          yourId={yourID}
          tryCallId={callPeer}
          inboundCallerId={
            receivingCall && !callAccepted && !callRejected ? caller : null
          }
          acceptCall={acceptCall}
          rejectCall={rejectCall}
        />
      ) : (
        <CallView
          endCall={endCall}
          toggleMuteAudio={toggleMuteAudio}
          audioMuted={audioMuted}
          onVideoRefsPopulated={onVideoRefsPopulated}
        />
      )}
    </div>
  );
}

export default App;
