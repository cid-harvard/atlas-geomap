import {
  scaleLinear,
  scaleLog,
} from 'd3-scale';
import first from 'lodash/first';
import last from 'lodash/last';
import range from 'lodash/range';
import React from 'react';
import styled from 'styled-components';
import {
  colorRangeEnd,
  colorRangeStart,
  colorSpectrumEndAsPercentageOfTotalOrdersOfMagnitudeDifference as spectrumEndPct,
  colorSpectrumStartAsPercentageOfTotalOrdersOfMagnitudeDifference as spectrumStartPct,
  getOrdersOfMagnitudeDifference,
  primaryCountryColor,
} from './Utils';
import {
  format,
} from 'd3-format';

interface ILegendData {
  domainStart: number;
  domainSpectrumStart: number;
  domainSpectrumEnd: number;
  domainEnd: number;
  rangeStart: string;
  rangeEnd: string;
}

const graphHeight = 75; // in `vh`

// Taken from https://stackoverflow.com/a/22885197:
const log10 = Math.log(10);
const getSignificantDigitCount = (n: number) => {
    n = Math.abs(+String(n).replace('.', '')); //remove decimal and make positive
    if (n === 0) {
      return 0;
    }
    while (n !== 0 && n % 10 === 0) {
      n /= 10; //kill the 0s at the end of n
    }

    return Math.floor(Math.log(n) / log10) + 1; //get number of digits
};

// Format monetary sums into nice number with as many significant digits as in
// the input not exceeding 3. Also replace the `G` prefix with `B` because `B`
// makes more sense for money sums. The other prefixes are fine:
export const formatTradeValue = (input: number) => {
  const maxNumSignificantDigits = 3;
  const numSignificantDigitsInInput = getSignificantDigitCount(input);
  const numSignificantDigitsInOutput = (numSignificantDigitsInInput <= maxNumSignificantDigits) ?
                                        numSignificantDigitsInInput :
                                        maxNumSignificantDigits;
  return format(`$.${numSignificantDigitsInOutput}s`)(input).replace('G', 'B');
};


const horizontalMargin = 5; // in percentage
const width = 100 - 2 * horizontalMargin; // in percentage;

// Height of bar as percentage of graph's total height:
const barHeightPercentage = 0.02;
const barHeight = graphHeight * barHeightPercentage; // in `vh`:
const textHeight = 1; // in rem
const totalHeight = `calc(${barHeight}vh + ${textHeight}rem)`;

const Root = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: ${horizontalMargin}%;
  width: ${width}%;
  height: ${totalHeight};
  pointer-events: none;
`;

const TickValue = styled.div`
  transform: translateX(-50%);
  position: absolute;
  top: ${barHeight}vh;
  font-size: 0.7rem;
  margin-top: 1vh;
`;
const TickMark = styled.div`
  position: absolute;
  top: 0;
  height: ${barHeight}vh;
  background-color: white;
  width: 2px;
  transform: translateX(-50%);
`;

const SelectedCountry = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(calc(-100% - 0.5rem));
  font-size: 0.9rem;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    width: 1.1rem;
    height: 1.1rem;
    display: inline-block;
    margin-right: 0.5rem;
    background-color: ${primaryCountryColor};
  }
`;

const legendStart = 0;
const legendSpectrumStart = spectrumStartPct * 100;
const legendSpectrumEnd = spectrumEndPct * 100;
const legendEnd = 100;
const getCSSLinearGradient = () => {
  const spectrumScale = scaleLinear<string, string>()
                          .domain([legendSpectrumStart, legendSpectrumEnd])
                          .range([colorRangeStart, colorRangeEnd]);
  const spectrumGradientString = range(legendSpectrumStart, legendEnd + 1).map(
    value => `${spectrumScale(value)} ${value}%`,
  );
  const spectrumStartSring = `${colorRangeStart} 0`;
  const spectrumEndString = `${colorRangeEnd} 100%`;
  const linearGradientString = [spectrumStartSring, ...spectrumGradientString, spectrumEndString].join(', ');
  return linearGradientString;
};

const ColorBar = styled.div`
  width: 100%;
  height: ${barHeight}vh;
  border: 1px solid white;
  background-image: linear-gradient(to right, ${getCSSLinearGradient()});
`;

export const getScaleAndTicksForTickLabels = (
    domainStart: number, domainEnd: number, legendStartX: number, legendEndX: number,
  ) => {

  const scale = scaleLog<number, number>()
                  .domain([domainStart, domainEnd])
                  .range([legendStartX, legendEndX]);

  // Request the number of ticks equal to the difference of orders of magnitude
  // between the two endpoints will ensure that `de` will return one tick for
  // every power of ten:
  const numberOfTicks = getOrdersOfMagnitudeDifference(domainStart, domainEnd);

  const rawTickValues = scale.ticks(numberOfTicks);
  // If tick values do not include the start and end points, include them:
  let tickValues = rawTickValues;
  if (first(rawTickValues) !== domainStart) {
    tickValues = [domainStart, ...tickValues];
  }
  if (last(rawTickValues) !== domainEnd) {
    tickValues = [...tickValues, domainEnd];
  }
  return {
    scale, tickValues,
  };
};

export default class extends React.PureComponent<ILegendData & { showSelectedCountry: boolean }, {}> {
  render() {
    const {domainStart, domainEnd, showSelectedCountry} = this.props;
    const {scale, tickValues} = getScaleAndTicksForTickLabels(
      domainStart, domainEnd, legendStart, legendEnd,
    );

    const tickValueElems = tickValues.map((value: number) => {
      const style = {
        left: `${scale(value)}%`,
      };
      return (
        <TickValue style={style} key={value}>{formatTradeValue(value)}</TickValue>
      );
    });

    const tickElems = tickValues.map((value: number) => {
      const style = {
        left: `${scale(value)}%`,
      };
      return (
        <TickMark style={style} key={value}/>
      );
    });

    const selectedCountryLabel = showSelectedCountry === true
      ? <SelectedCountry>Selected Country</SelectedCountry> : null;

    return (
      <Root>
        {selectedCountryLabel}
        <ColorBar/>
        {tickElems}
        {tickValueElems}
      </Root>
    );
  }
}
