# atlas-geomap

## by the Growth Lab at Harvard's Center for International Development

Modular Geo Map for visualizing import/export data in the [Atlas of International Complexity](https://atlas.cid.harvard.edu/explore/geo)

> This package is part of Harvard Growth Lab’s portfolio of software packages, digital products and interactive data visualizations. To browse our entire portfolio, please visit The Viz Hub at [growthlab.app](https://growthlab.app/). To learn more about our research, please visit [Harvard Growth Lab’s](https://growthlab.cid.harvard.edu/) home page.

[![NPM](https://img.shields.io/npm/v/atlas-geomap.svg)](https://www.npmjs.com/package/atlas-geomap) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

### [View live examples ↗](https://cid-harvard.github.io/atlas-geomap/)

## Install

```bash
npm install --save atlas-geomap
```

## Usage

```tsx
import React from 'react'
import GeoMap from 'atlas-geomap';

const App = () => {
  ...

  return (
    <GeoMap
      data={data}
      hideTooltip={() => console.log('hide tooltip')}
      showTooltip={(info) => console.log(info)}
      onCountryClick={(countryId) => console.log(countryId)}
      domainEnd={1000000000}
      domainSpectrumEnd={398107170.55349696}
      domainSpectrumStart={10000000}
      domainStart={100000}
      rangeEnd={"#0A4486"}
      rangeStart={"#B1E0BB"}
      showSelectedCountry={true}
    />
  )
}

export default App

```
The GeoMap component takes the following props:

- **data**: `CountryData;`
- **hideTooltip**: `() => void;`
- **showTooltip**: `(info: ITooltipInfo) => void;`
- **onCountryClick**: `(countryId: number) => void;`
- **domainEnd**: `number`
- **domainSpectrumEnd**: `number`
- **domainSpectrumStart**: `number`
- **domainStart**: `number`
- **rangeEnd**: `string`
- **rangeStart**: `string`
- **showSelectedCountry**: `boolean`

## License

MIT © [The President and Fellows of Harvard College](https://www.harvard.edu/)
