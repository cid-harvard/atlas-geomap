import React, {useRef} from 'react'
import Chart, {CountryData, ITooltipInfo} from './chart';
import styles from './chart/styling';
import raw from 'raw.macro';
import styled from 'styled-components/macro';
const Root = styled.div`
  width: 100%;
  height: 100%;
  ${styles}
`;

const geoJSONData = JSON.parse(raw('./world_map_naturalearth_ashkyd_clean_geo.json'));

interface Props {
  data: CountryData;
  hideTooltip: () => void;
  showTooltip: (info: ITooltipInfo) => void;
  onCountryClick: (countryId: number) => void;
}

const GeoMap = ({data, hideTooltip, showTooltip, onCountryClick}: Props) => {
  const chartRootEl = useRef<HTMLDivElement | null>(null);

  const rememberChartRootEl = (el: HTMLDivElement | null) => chartRootEl.current = el;

  return (
    <Root ref={chartRootEl}>
      <Chart
        saveRootEl={rememberChartRootEl}
        hideTooltip={hideTooltip}
        showTooltip={showTooltip}
        showDetailOverlay={onCountryClick}
        geoJSONData={geoJSONData}
        width={800} height={640}
        countryData={data}
      />
    </Root>
  );
}

export default GeoMap;
