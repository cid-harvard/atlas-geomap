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
