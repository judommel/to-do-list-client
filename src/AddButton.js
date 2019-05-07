import React from "react";

function AddButton(props) {
  return (
    <button
      onClick={() => {
        props.onClick();
      }}
    >
      {props.text}
    </button>
  );
}

export default AddButton;
