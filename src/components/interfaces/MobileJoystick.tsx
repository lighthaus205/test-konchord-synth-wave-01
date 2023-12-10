import nipplejs from 'nipplejs'
import { useEffect } from 'react'
import useMobileJoystick from '~/stores/useMobileJoystick'


export default function MobileJoystick() {
  const options = {
    dynamicPage: true,
    size: 100,
    mode: 'static',
    color: '#ffcc02'
  }
  const options1 = {
    ...options,
    zone: document.getElementById('joystick_zone_1')!,
    position: { left: '100px', bottom: '74px' }
  }
  const options2 = {
    ...options,
    zone: document.getElementById('joystick_zone_2')!,
    position: { right: '100px', bottom: '74px' }
  }
  var manager1 = nipplejs.create(options1);
  var manager2 = nipplejs.create(options2);

  const setPosition = useMobileJoystick((state) => state.setPosition)
  const setDistance = useMobileJoystick((state) => state.setDistance)
  const setAngle = useMobileJoystick((state) => state.setAngle)
  const setDirection = useMobileJoystick((state) => state.setDirection)

  manager1.on('start', (evt, data) => {
    setPosition(data.position)
    setDistance(data.distance)
    setAngle(data.angle)
    setDirection(data.direction)
  })

  manager1.on('end', (evt, data) => {
    setPosition(data.position)
    setDistance(data.distance)
    setAngle(data.angle)
    setDirection(data.direction)
  })

  manager1.on('move', (evt, data) => {
    setPosition(data.position)
    setDistance(data.distance)
    setAngle(data.angle)
    setDirection(data.direction)
  })

  const setIsTouchDevice = useMobileJoystick((state) => state.setIsTouchDevice)
  const isTouchDevice = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0))
  setIsTouchDevice(isTouchDevice)

  return <>
  </>
}