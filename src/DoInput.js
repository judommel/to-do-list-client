import React from "react";

function DoInput(props) {
  return (
    <div>
      <input
        value={props.value}
        className={props.theme}
        placeholder={props.placeholder}
        onChange={event => {
          props.onInput(event.target.value);
        }}
      />
    </div>
  );
}

export default DoInput;
