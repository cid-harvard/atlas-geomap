import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import {transform as projTransform} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import View from 'ol/View';
import getMapControls from './getMapControls';
import {
  IDataProps,
  ISizeProps,
} from './index';

export const primaryCountryColor = '#e8c258';

const defaultCenterCoords = projTransform([0, 20], 'EPSG:4326', 'EPSG:3857');
const defaultZoomLevel = 2;

const defaultMapFillColor = 'white';
const defaultMapStrokeColor = '#8AABAB';

export const setSizeAndSetUpMap = (
    size: ISizeProps,
    el: HTMLElement | null) => {

  const {width, height} = size;
  if (el !== null && width !== undefined && height !== undefined) {
    el.setAttribute('width', `${width}px`);
    el.setAttribute('height', `${height}px`);
    const view = new View({
      center: defaultCenterCoords,
      zoom: defaultZoomLevel,
      minZoom: 1.5,
    });

    const map = new OlMap({
      target: el,
      controls: getMapControls(defaultZoomLevel, defaultCenterCoords),
      view,
    });
    return map;
  }
};

export const drawVectorLayer = ({geoJSONData, countryData}: IDataProps) => {

    const parsedFeatures = new GeoJSON({featureProjection: 'EPSG:3857'}).readFeatures(geoJSONData);
    const featureSource = new VectorSource({
      features: parsedFeatures,
      wrapX: false,
    });
    const vectorLayer = new VectorLayer({
      source: featureSource,
      style(feature: any) {
        const featureId = feature.getId();

        const retrievedDatumForCountry = countryData[featureId];
        let color: string;
        if (retrievedDatumForCountry === undefined) {
          color = defaultMapFillColor;
        } else {
          if (retrievedDatumForCountry.isPrimaryCountry === true) {
            color = primaryCountryColor;
          } else {
            color = retrievedDatumForCountry.color;
          }
        }

        const style = new Style({
          fill: new Fill({color}),
          stroke: new Stroke({
            color: defaultMapStrokeColor,
            width: 1,
          }),
        });
        return style;
      },
    });
    return vectorLayer;
};

// Upper/lower bounds of color range of map:
export const colorRangeStart = '#B1E0BB';
export const colorRangeEnd = '#0A4486';

// For example, if
// `colorSpectrumStartAsPercentageOfTotalOrdersOfMagnitudeDifference` is 1/2 and
// the `nice`-d domain starts at 10^3 and ends at 10^7 then the color spectrum
// starts at 10^5 because 5 is midway between 3 and 7:
export const colorSpectrumStartAsPercentageOfTotalOrdersOfMagnitudeDifference = 0.5;
export const colorSpectrumEndAsPercentageOfTotalOrdersOfMagnitudeDifference = 0.9;

export const getOrdersOfMagnitudeDifference = (domainStart: number, domainEnd: number) => {
  // Note: the `log10` operations will produce integers because `domainStart`
  // and `domainEnd` will be powers of ten because they have been `nice`-d by `d3`:
  const domainStartOrderOfMagnitude = Math.log10(domainStart);
  const domainEndOrderOfMagnitude = Math.log10(domainEnd);
  return domainEndOrderOfMagnitude - domainStartOrderOfMagnitude;
};
