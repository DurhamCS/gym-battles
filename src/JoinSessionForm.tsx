import { Icon } from "@fluentui/react/lib/Icon";
import React from "react";
import { TextField } from "office-ui-fabric-react/lib/TextField";

const textField = (
  <TextField
    placeholder="Sesh Code"
    borderless
    onKeyDown={e => (e.key == "Enter" ? submitHandler() : null)}
  />
);

interface activity {
  name: string;
  repsOrDuration: number;
  hasReps: boolean;
  breakAfterDuration: number;
}

const submitHandler = () => {
  alert("hi");
};
export function JoinSessionForm() {
  return (
    <div className="d-flex">
      {textField}
      <Icon
        onClick={() => submitHandler()}
        iconName="CheckMark"
        className="JoinSessionForm-submit-button icon-btn"
      />
    </div>
  );
}
