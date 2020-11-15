import { Icon } from "@fluentui/react";
import React, { createRef, useRef } from "react";
import "./CallView.css";

interface ICallViewProps {
  onVideoRefsPopulated: (
    userRef: React.RefObject<HTMLVideoElement>,
    partnerRef: React.RefObject<HTMLVideoElement>
  ) => void;
  toggleMuteAudio: VoidFunction;
  endCall: VoidFunction;
  audioMuted: boolean;
}

export class CallView extends React.Component<ICallViewProps, {}, any> {
  partnerVideoRef;
  userVideoRef;

  constructor(props: ICallViewProps) {
    super(props);

    this.partnerVideoRef = createRef<HTMLVideoElement>();
    this.userVideoRef = createRef<HTMLVideoElement>();
  }

  componentDidMount = () => {
    //this.partnerVideoRef.current!.srcObject = this.props.partnerVideo;
    //this.userVideoRef.current!.srcObject = this.props.userVideo;
    this.props.onVideoRefsPopulated(this.userVideoRef, this.partnerVideoRef);
  };

  render() {
    const partnerVideo = (
      <video
        className="partnerVideo"
        playsInline
        ref={this.partnerVideoRef}
        autoPlay
        style={{
          position: "absolute",
          width: "50vw",
          bottom: 0,
          left: "50vw",
        }}
      />
    );

    const userVideo = (
      <video
        className="userVideo"
        playsInline
        muted
        ref={this.userVideoRef}
        autoPlay
        style={{
          position: "absolute",
          width: "50vw",
          bottom: 0,
          left: 0,
        }}
      />
    );

    const toggleMuteButton = (
      <Icon
        className="icon-btn media-btn"
        style={{ backgroundColor: "#00000088" }}
        iconName={this.props.audioMuted ? "MicOff2" : "Microphone"}
        onClick={() => this.props.toggleMuteAudio()}
      />
    );

    const hangUpButton = (
      <Icon
        className="icon-btn media-btn"
        iconName="DeclineCall"
        style={{ backgroundColor: "#00000088" }}
        onClick={() => this.props.endCall()}
      />
    );
    return (
      <div style={{ height: "100vh" }}>
        {userVideo}
        {partnerVideo}
        <div
          className="controlsContainer"
          style={{ margin: 16, position: "absolute", bottom: 0 }}>
          {toggleMuteButton}
          {hangUpButton}
        </div>
      </div>
    );
  }
}
