import nipplejs from 'nipplejs'
import { useEffect } from 'react'
import useMobileJoystick from '~/stores/useMobileJoystick'


export default function MobileJoystick() {
  const options = {
    dynamicPage: true,
    size: 100,
    mode: 'static',
    color: '#ffcc02',
    position: { left: '50%', bottom: '50%' },
  }
  const options1 = {
    ...options,
    zone: document.getElementById('joystick_zone_1')!,
  }
  const options2 = {
    ...options,
    zone: document.getElementById('joystick_zone_2')!,
  }
  var manager1 = nipplejs.create(options1);
  var manager2 = nipplejs.create(options2);

  const setPosition = useMobileJoystick((state) => state.setPosition)
  const setDistance = useMobileJoystick((state) => state.setDistance)
  const setAngle = useMobileJoystick((state) => state.setAngle)
  const setDirection = useMobileJoystick((state) => state.setDirection)

  manager1.on('start', (evt, data) => {
    setPosition('left', data.position)
    setDistance('left', data.distance)
    setAngle('left', data.angle)
    setDirection('left', data.direction)
  })

  manager1.on('end', (evt, data) => {
    setPosition('left', data.position)
    setDistance('left', data.distance)
    setAngle('left', data.angle)
    setDirection('left', data.direction)
  })

  manager1.on('move', (evt, data) => {
    setPosition('left', data.position)
    setDistance('left', data.distance)
    setAngle('left', data.angle)
    setDirection('left', data.direction)
  })

  manager2.on('start', (evt, data) => {
    setPosition('right', data.position)
    setDistance('right', data.distance)
    setAngle('right', data.angle)
    setDirection('right', data.direction)
  })

  manager2.on('end', (evt, data) => {
    setPosition('right', data.position)
    setDistance('right', data.distance)
    setAngle('right', data.angle)
    setDirection('right', data.direction)
  })

  manager2.on('move', (evt, data) => {
    setPosition('right', data.position)
    setDistance('right', data.distance)
    setAngle('right', data.angle)
    setDirection('right', data.direction)
  })
  return <></>
}