import { create } from 'zustand'

interface useMobileJoystickStateInterface {
  position_l: { x: number, y: number }
  position_r: { x: number, y: number }
  setPosition: Function
  distance_l: number
  distance_r: number
  setDistance: Function
  angle_l: { radian: number, degree: number }
  angle_r: { radian: number, degree: number }
  setAngle: Function
  direction_l: { x: string, y: string, angle: string }
  direction_r: { x: string, y: string, angle: string }
  setDirection: Function
  isTouchDevice: boolean
  setIsTouchDevice: Function
}

export default create<useMobileJoystickStateInterface>((set) => {
  return {
    position_l: { x: 0, y: 0 },
    position_r: { x: 0, y: 0 },
    setPosition: (joystickId: 'left' | 'right', position: { x: number, y: number }) => {
      set((state) => {
        if (joystickId === 'left') {
          return { position_l: position }
        } else if (joystickId === 'right') {
          return { position_r: position }
        }
        return {}
      })
    },
    distance_l: 0,
    distance_r: 0,
    setDistance: (joystickId: 'left' | 'right', distance: number) => {
      set((state) => {
        if (joystickId === 'left') {
          return { distance_l: distance }
        } else if (joystickId === 'right') {
          return { distance_r: distance }
        }
        return {}
      })
    },
    angle_l: { radian: 0, degree: 0 },
    angle_r: { radian: 0, degree: 0 },
    setAngle: (joystickId: 'left' | 'right', angle: { radian: number, degree: number }) => {
      set((state) => {
        if (joystickId === 'left') {
          return { angle_l: angle }
        } else if (joystickId === 'right') {
          return { angle_r: angle }
        }
        return {}
      })
    },
    direction_l: { x: '', y: '', angle: '' },
    direction_r: { x: '', y: '', angle: '' },
    setDirection: (joystickId: 'left' | 'right', direction: { x: string, y: string, angle: string }) => {
      set((state) => {
        if (joystickId === 'left') {
          return { direction_l: direction }
        } else if (joystickId === 'right') {
          return { direction_r: direction }
        }
        return {}
      })
    },
    isTouchDevice: false,
    setIsTouchDevice: (isTouchDevice: boolean) => {
      set((state) => {
        console.log('Setting isTouchDevice...')
        return { isTouchDevice }
      })
    },
  }
})