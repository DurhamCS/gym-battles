import React from "react";
import { Container, Row } from "react-grid-system";
import "./WorkoutBuilder.css";

export class WorkoutBuilder extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: "",
      durationOrCount: 0,
      type: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  handleChange(event: any) {
    if (event.target.name !== "type") {
      this.setState({
        [event.target.name]: event.target.value,
      });
    } else if (event.target.value === "Timed") {
      this.setState({
        type: true,
      });
    } else {
      this.setState({
        type: false,
      });
    }
  }

  handleSend() {
    //return state
  }

  render() {
    return (
      <div>
        <Container className="InteracticeScreen">
          <Row className="Row">
            <label htmlFor="name">Choose your exercise:</label>
            <select id="name" name="name" onChange={this.handleChange}>
              <option value="Pushup">Pushup</option>
              <option value="Pullup">Pullup</option>
              <option value="Plank">Plank</option>
              <option value="Squat">Squat</option>
            </select>
          </Row>
          <Row className="Row">
            <label htmlFor="type">Choose the challenge type:</label>
            <select id="type" name="type" onChange={this.handleChange}>
              <option value="Timed">Timed</option>
              <option value="repsmax">Who does the most reps</option>
            </select>
          </Row>
          <Row className="Row">
            <label htmlFor="durationOrCount">Enter number:</label>
            <input
              type="text"
              placeholder="60"
              id="durationOrCount"
              name="durationOrCount"
              onChange={this.handleChange}></input>
          </Row>
        </Container>
      </div>
    );
  }
}
