
export default function FeatureToggle({ isEnabled, featureName })
{
  return(
    <>
      {isEnabled ? <p>{featureName}</p> : <p>Feature {featureName} is disabled.</p>}
    </>
  )
}