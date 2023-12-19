import { createContext } from "react";

const IsTouchDeviceContext = createContext({
  isTouchDevice: false,
  setIsTouchDevice: (state: boolean) => {}
});

export default IsTouchDeviceContext