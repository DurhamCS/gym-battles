import React, { ReactChildren } from "react";
import { CSSTransition } from "react-transition-group";
import { initializeIcons } from "@uifabric/icons";
import { Icon } from "@fluentui/react/lib/Icon";

initializeIcons();

interface btnProps {
  idx: number;
  selectedIdx: number;
  text: string;
  hoverHandler: (idx: number) => void;
  clickHandler: (idx: number) => void;
}

interface slideProps {
  closeHandler: VoidFunction;
  children: unknown;
  className: string;
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
        <p
          className="HomePage-btn HomePage-btn-selected"
          onClick={() => props.clickHandler(props.idx)}>
          {props.text}
        </p>
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

function Slide(props: slideProps) {
  return (
    <div className={"HomePage-slide " + props.className}>
      <Icon
        onClick={() => props.closeHandler()}
        iconName="Back"
        className="HomePage-slide-back-button"
      />
      {props.children}
    </div>
  );
}

interface IHomePageState {
  btnIdx: number;
  isJoining: boolean;
  isCreating: boolean;
  hasCreated: boolean;
}

export class HomePage extends React.Component<{}, IHomePageState, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      btnIdx: 0,
      isJoining: false,
      isCreating: false,
      hasCreated: false,
    };
    document.onkeydown = ev => {
      if (
        !this.state.isJoining &&
        !this.state.isCreating &&
        !this.state.hasCreated
      ) {
        switch (ev.key) {
          case "ArrowUp":
            this.setState({ btnIdx: (this.state.btnIdx - 1) % buttons.length });
            break;
          case "ArrowDown":
            this.setState({ btnIdx: (this.state.btnIdx + 1) % buttons.length });
            break;
          case "Enter":
            this.handleClick(this.state.btnIdx);
            break;
        }
      }
    };
  }

  handleHover = (idx: number) => {
    this.setState({ btnIdx: idx });
  };

  handleClick = (idx: number) => {
    switch (idx) {
      case 0:
        this.setState({ isCreating: true, isJoining: false });
        break;
      case 1:
        this.setState({ isCreating: false, isJoining: true });
        break;
    }
  };

  closeSlide = () => {
    this.setState({ isCreating: false, isJoining: false });
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
            clickHandler={this.handleClick}
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

        <CSSTransition
          in={this.state.isCreating}
          timeout={250}
          classNames="HomePage-slide">
          <Slide
            closeHandler={this.closeSlide}
            className="HomePage-builder-slide">
            <p></p>
          </Slide>
        </CSSTransition>

        <svg className="HomePage-bottom-svg" viewBox="0 0 100 50">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#461A9D" />
              <stop offset="100%" stopColor="#7D35FF" />
            </linearGradient>
          </defs>
          <path d="M 0,50 L 100,50 100,40 Z" fill="url(#grad2)" />
        </svg>

        <CSSTransition
          in={this.state.isJoining || this.state.hasCreated}
          timeout={250}
          classNames="HomePage-slide">
          <Slide closeHandler={this.closeSlide} className="HomePage-code-slide">
            <p></p>
          </Slide>
        </CSSTransition>
      </header>
    );
  }
}
