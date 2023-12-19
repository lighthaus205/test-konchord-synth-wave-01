import { useContext } from 'react';
import IsTouchDeviceContext from '~/contexts/IsTouchDeviceContext';
import useMobileJoystick from '~/stores/useMobileJoystick'


export default function IsTouchDevice() {
  const { isTouchDevice, setIsTouchDevice } = useContext(IsTouchDeviceContext);
  const touchDevice = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0))
  setIsTouchDevice(touchDevice)
  return <></>
}