import React from 'react'

import GeoMap from 'atlas-geomap'
import 'atlas-geomap/dist/index.css'
import raw from 'raw.macro';

const countryData = JSON.parse(raw('./test-data.json'));

const App = () => {
  return <GeoMap data={countryData} />
}

export default App
