import React from "react";
import { iconStyle } from "./Ui";

type AddButtonProps = {
  onClick: () => void;
};

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <button style={iconStyle} onClick={onClick}>
      Add
    </button>
  );
};

export default AddButton;
