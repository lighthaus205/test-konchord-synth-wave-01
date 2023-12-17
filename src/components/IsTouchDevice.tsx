import useMobileJoystick from '~/stores/useMobileJoystick'


export default function IsTouchDevice() {
  const setIsTouchDevice = useMobileJoystick((state) => state.setIsTouchDevice)
  const isTouchDevice = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0))
  setIsTouchDevice(isTouchDevice)
  return <></>
}