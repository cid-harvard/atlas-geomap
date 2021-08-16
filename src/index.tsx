import React, {useRef} from 'react'
import Chart, {CountryData, ITooltipInfo} from './chart';
import styles from './chart/styling';
import raw from 'raw.macro';
import styled from 'styled-components/macro';
import Legend from './chart/Legend';

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  ${styles}
`;

const geoJSONData = JSON.parse(raw('./world_map_naturalearth_ashkyd_clean_geo.json'));

interface Props {
  data: CountryData;
  hideTooltip: () => void;
  showTooltip: (info: ITooltipInfo) => void;
  onCountryClick: (countryId: number) => void;
  domainEnd: number;
  domainSpectrumEnd: number;
  domainSpectrumStart: number;
  domainStart: number;
  rangeEnd: string;
  rangeStart: string;
  showSelectedCountry: boolean;
}

const GeoMap = (props: Props) => {
  const {
    data, hideTooltip, showTooltip, onCountryClick,
    domainEnd, domainSpectrumEnd, domainSpectrumStart, domainStart,
    rangeEnd, rangeStart, showSelectedCountry,
  } = props;
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
      <Legend
        domainEnd={domainEnd}
        domainSpectrumEnd={domainSpectrumEnd}
        domainSpectrumStart={domainSpectrumStart}
        domainStart={domainStart}
        rangeEnd={rangeEnd}
        rangeStart={rangeStart}
        showSelectedCountry={showSelectedCountry}
      />
    </Root>
  );
}

export default GeoMap;
