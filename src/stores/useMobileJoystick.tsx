import { create } from 'zustand'

interface useMobileJoystickStateInterface {
  position: { x: number, y: number }
  setPosition: Function
  distance: number
  setDistance: Function
  angle: { radian: number, degree: number }
  setAngle: Function
  direction: { x: string, y: string, angle: string }
  setDirection: Function
  isTouchDevice: boolean
  setIsTouchDevice: Function
}

export default create<useMobileJoystickStateInterface>((set) => {
  return {
    position: { x: 0, y: 0 },
    setPosition: (position: { x: number, y: number }) => {
      set((state) => {
        return { position }
      })
    },
    distance: 0,
    setDistance: (distance: number) => {
      set((state) => {
        return { distance }
      })
    },
    angle: { radian: 0, degree: 0 },
    setAngle: (angle: { radian: number, degree: number }) => {
      set((state) => {
        return { angle }
      })
    },
    direction: { x: '', y: '', angle: '' },
    setDirection: (direction: { x: string, y: string, angle: string }) => {
      set((state) => {
        return { direction }
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