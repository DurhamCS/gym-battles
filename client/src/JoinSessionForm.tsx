import { Icon } from "@fluentui/react/lib/Icon";
import React, { useState } from "react";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { ITextField } from "@fluentui/react";

export function JoinSessionForm(props: {
  handleSubmit: (seshId: string) => void;
  yourId: string;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="d-flex">
      <div>
        <div className="d-flex">
          <TextField
            placeholder="Sesh Code"
            borderless
            onChange={e =>
              setValue(((e.target as unknown) as ITextField).value!)
            }
            onKeyDown={e =>
              e.key === "Enter"
                ? props.handleSubmit(value.toLowerCase().trim())
                : null
            }
          />
          <Icon
            onClick={() => props.handleSubmit(value.toLowerCase().trim())}
            iconName="CheckMark"
            className="JoinSessionForm-submit-button icon-btn"
          />
        </div>
        <p>Your id: {props.yourId}</p>
      </div>
    </div>
  );
}
