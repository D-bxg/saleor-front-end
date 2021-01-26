import TextField from "@material-ui/core/TextField";
import { InputContext } from "./utils";
import { useContext } from "react";
const Input = (props = {}) => {
  const { setInputValue } = useContext(InputContext);
  return (
    <TextField
      style={{ width: "100%" }}
      value={props.InputValue}
      id="standard-basic"
      label="分子式"
      onChange={(event) => {
        setInputValue(event.target.value);
      }}
    />
  );
};

export default Input;
