import { useState } from "react"
import useKonchordExperience from "~/stores/useKonchordExperience"
import { kePhaseEnum } from "~/utils/enums"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KeInterface() {
  const { push } = useRouter();
  const [enterPlanet, setEnterPlanet] = useState<string | null>(null)
  const kePhase = useKonchordExperience((state) => state.kePhase)
  const enterPlanetData = useKonchordExperience((state) => state.enterPlanetData)
  const continueExploring = useKonchordExperience((state) => state.continueExploring)

  const handleEnterPlanetSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnterPlanet(event.target.value);
  };

  const onSubmitEnterPlanet = (e: React.FormEvent) => {
    e.preventDefault()
    if (enterPlanet == 'yes') {
      push(enterPlanetData.redirect_url)

    } else if (enterPlanet == 'no') {
      continueExploring()
    }
  }

  return <div className="interface">
    {kePhase === kePhaseEnum.askingToEnterPlanet ? <>
      <div className="askingToEnterPlanet">
        <h1>Do you want to enter planet {enterPlanetData.planet_name}?</h1>
        <form id="quizForm" onSubmit={onSubmitEnterPlanet}>
          <div>
            <input
              type="radio"
              id={'yes'}
              name={'askingToEnterPlanet'}
              value={'yes'}
              onChange={handleEnterPlanetSelect}
            />
            <label
              htmlFor={'yes'}
              style={{ margin: "0px 8px" }}
            >
              Yes, let's land!
            </label>
          </div>
          <div>
            <input
              type="radio"
              id={'no'}
              name={'askingToEnterPlanet'}
              value={'no'}
              onChange={handleEnterPlanetSelect}
            />
            <label
              htmlFor={'no'}
              style={{ margin: "0px 8px" }}
            >
              No, continue exploring...
            </label>
          </div>
          <input type="submit" value="Confirm" />
        </form>
      </div>
    </> : null}
  </div>
}