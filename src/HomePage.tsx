import React from "react";

interface btnProps {
  idx: number;
  selectedIdx: number;
  text: string;
  hoverHandler: (idx: number) => void;
}

function Btn(props: btnProps) {
  if (props.selectedIdx === props.idx)
    return (
      <div className="d-flex">
        <svg className="HomePage-btn-marker">
          <path
            fill="None"
            stroke="#FFC000"
            strokeWidth="3px"
            strokeLinejoin="round"
            width={25}
            transform="translate(4,4)"
            d="M 0,0 L 0,24 20,12 Z"
          />
        </svg>
        <p className="HomePage-btn HomePage-btn-selected">{props.text}</p>
      </div>
    );
  else
    return (
      <p
        className="HomePage-btn"
        onMouseEnter={() => props.hoverHandler(props.idx)}>
        {props.text}
      </p>
    );
}

const buttons = ["Create Session", "Join Session"];

export class HomePage extends React.Component<{}, { btnIdx: number }, any> {
  constructor(props: any) {
    super(props);
    this.state = { btnIdx: 0 };
    document.onkeydown = ev => {
      if (ev.keyCode === 38)
        this.setState({ btnIdx: (this.state.btnIdx - 1) % buttons.length });
      else if (ev.keyCode === 40)
        this.setState({ btnIdx: (this.state.btnIdx + 1) % buttons.length });
    };
  }

  handleHover = (idx: number) => {
    this.setState({ btnIdx: idx });
  };

  render() {
    return (
      <header className="HomePage-header">
        <p className="HomePage-title">Gym Battles</p>
        {buttons.map((text, i) => (
          <Btn
            text={text}
            idx={i}
            selectedIdx={this.state.btnIdx}
            hoverHandler={this.handleHover}
          />
        ))}
        <svg className="HomePage-bottom-svg" viewBox="0 0 100 50">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A07400" />
              <stop offset="100%" stopColor="#FFC000" />
            </linearGradient>
          </defs>
          <path d="M 0,50 L 100,50 100,35 Z" fill="url(#grad1)" />
        </svg>
        <svg className="HomePage-bottom-svg" viewBox="0 0 100 50">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#461A9D" />
              <stop offset="100%" stopColor="#7D35FF" />
            </linearGradient>
          </defs>
          <path d="M 0,50 L 100,50 100,40 Z" fill="url(#grad2)" />
        </svg>
      </header>
    );
  }
}
