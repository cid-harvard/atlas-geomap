import React, {useRef} from 'react'
import Chart, {CountryData} from './chart';
import raw from 'raw.macro';
import styled from 'styled-components/macro';
const Root = styled.div`
  width: 100%;
  height: 100%;
`;

const geoJSONData = JSON.parse(raw('./world_map_naturalearth_ashkyd_clean_geo.json'));

interface Props {
  data: CountryData;
}

const GeoMap = ({data}: Props) => {
  const chartRootEl = useRef<HTMLDivElement | null>(null);

  const rememberChartRootEl = (el: HTMLDivElement | null) => chartRootEl.current = el;
  const hideTooltip = () => console.log('hide tooltip');
  const showTooltip = () => console.log('show tooltip');
  const showDetailOverlay = () => console.log('show showDetailOverlay');

  return (
    <Root ref={chartRootEl}>
      <Chart
        saveRootEl={rememberChartRootEl}
        hideTooltip={hideTooltip}
        showTooltip={showTooltip}
        showDetailOverlay={showDetailOverlay}
        geoJSONData={geoJSONData}
        width={800} height={640}
        countryData={data}
      />
    </Root>
  );
}

export default GeoMap;
