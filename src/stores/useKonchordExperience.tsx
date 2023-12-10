import { RapierRigidBody } from '@react-three/rapier'
import { create } from 'zustand'
import { kePhaseEnum } from '~/utils/enums'
import { RefObject } from 'react'
import { planetDataInterface } from '~/utils/interfaces'

interface KonchordExperienceStateInterface {
  konchordSpaceshipRef: RefObject<RapierRigidBody> | null
  setKonchordSpaceshipRef: Function
  kePhase: kePhaseEnum
  askToEnterPlanet: Function
  continueExploring: Function
  enterPlanetData: planetDataInterface
}


export default create<KonchordExperienceStateInterface>((set) => {
  return {
    konchordSpaceshipRef: null,
    setKonchordSpaceshipRef: (konchordSpaceshipRef: RefObject<RapierRigidBody>) => {
      set((state) => {
        if (state.konchordSpaceshipRef === null) {
          return { konchordSpaceshipRef: konchordSpaceshipRef }
        }
        return {}
      })
    },
    kePhase: kePhaseEnum.exploring,
    enterPlanetData: {
      planet_key: '',
      planet_name: '',
      redirect_url: '',
    },
    askToEnterPlanet: (enterPlanetData: planetDataInterface) => {
      set((state) => {
        return {
          enterPlanetData: enterPlanetData,
          kePhase: kePhaseEnum.askingToEnterPlanet
        }
      })
    },
    continueExploring: () => {
      set((state) => {
        state.konchordSpaceshipRef?.current?.setEnabled(true)
        return { kePhase: kePhaseEnum.exploring }
      })
    },
  }
})