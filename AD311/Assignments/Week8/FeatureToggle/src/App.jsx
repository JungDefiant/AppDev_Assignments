import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FeatureToggle from './FeatureToggle'

function App() {

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <FeatureToggle isEnabled={true} featureName={"SomeFeature1"} />
        <FeatureToggle isEnabled={false} featureName={"SomeFeature2"} />
        <FeatureToggle isEnabled={false} featureName={"SomeFeature3"} />
        <FeatureToggle isEnabled={false} />
        <FeatureToggle featureName={"SomeFeature4"} />
        <FeatureToggle />
      </div>
    </>
  )
}

export default App
