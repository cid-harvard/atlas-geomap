import throttle from 'lodash/throttle';
import React from 'react';
import styled from 'styled-components';
import {
  drawVectorLayer as actuallyDrawVectorLayer,
  setSizeAndSetUpMap as actuallySetSizeAndSetupMap,
} from './Utils';

const mapBackgroundColor = 'rgb(245,245,245)';

interface GenericGeoJSONFeature<G extends GeoJSON.GeometryObject, T> extends GeoJSON.Feature<G> {
    properties: T;
}

interface FeatureCollection<G
    extends GeoJSON.GeometryObject, T> extends GeoJSON.FeatureCollection<G> {
    features: Array<GenericGeoJSONFeature<G, T>>;
}

type IGeoJSONData = FeatureCollection<GeoJSON.MultiPolygon, {}>;

interface ITooltipInfo {
  id: number;
  x: number;
  y: number;
}

export type ICountryDatumDisjoint = {
  isPrimaryCountry: true;
} | {
  isPrimaryCountry: false;
  value: number;
  percentage: number;
  color: string;
};

export type ICountryDatum = {
  id: number
  shortLabel: string;
  longLabel: string;
  regionColor: string;
  regionName: string;
} & ICountryDatumDisjoint;

const throttleWait = 16; // in ms

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  outline: 1px solid #ccc;
  background-color: ${mapBackgroundColor};
`;

interface IInteractiveProps {
  saveRootEl: (el: HTMLElement | null) => void;
  hideTooltip: () => void;
  showTooltip: (info: any) => void;
  showDetailOverlay: (countryId: number) => void;
}

export interface ISizeProps {
  width: number | undefined;
  height: number | undefined;
}

export type CountryData = Record<string, ICountryDatum>;

export interface IDataProps {
  geoJSONData: IGeoJSONData;
  countryData: CountryData;
}

export type IProps = IDataProps & ISizeProps & IInteractiveProps;

export default class extends React.Component<IProps> {

  private el: HTMLElement | null = null;
  private rememberEl = (el: HTMLElement | null) => {
    this.el = el;
    this.props.saveRootEl(el);
  }

  //#region Lifecycle methods
  componentDidMount() {
    const props = this.props;
    this.setSizeAndSetupMap(props);
    this.drawVectorLayer(props);
  }

  componentDidUpdate(prevProps: IProps) {
    const nextProps = this.props;
    if (prevProps !== nextProps) {
      if (nextProps.width !== prevProps.width ||
          nextProps.height !== prevProps.height) {

        this.setSizeAndSetupMap(nextProps);
        this.drawVectorLayer(nextProps);
      } else if (nextProps.countryData !== prevProps.countryData) {
        this.drawVectorLayer(nextProps);
      }
    }
  }
  //#endregion

  private olMap: any;
  private setSizeAndSetupMap(props: IProps) {
    if (this.olMap !== undefined) {
      this.olMap.setTarget(null);
    }
    this.olMap = undefined;

    const {width, height} = props;

    const olMap = actuallySetSizeAndSetupMap({width, height}, this.el);

    olMap.on('pointermove', (evt: any) => {
      const pixel = olMap.getEventPixel(evt.originalEvent);
      this.onMouseEnterFeature(pixel, evt.originalEvent, props);
    });
    olMap.on('click', (evt: any) => {
      const pixel = olMap.getEventPixel(evt.originalEvent);
      this.onMouseClickFeature(pixel, props);
    });
    this.olMap = olMap;
  }

  private vectorLayer: any;
  private drawVectorLayer(props: IProps) {
    if (this.olMap !== undefined) {
      const newVectorLayer = actuallyDrawVectorLayer(props);
      if (this.vectorLayer !== undefined) {
        this.olMap.removeLayer(this.vectorLayer);
      }
      this.olMap.addLayer(newVectorLayer);
      this.vectorLayer = newVectorLayer;
    }
  }

  //#region Mouse event handlers:
  // Needed to hide any currently visible tooltip when the mouse exits the map
  // `div` through a landmass that's up against the `div` boundary
  private onMouseLeaveMap = () => {
    this.sendOutTooltipInfo.cancel();
    this.props.hideTooltip();
  }
  /* Start of methods relatd to mouse events */
  private hovered: number | undefined = undefined;
  private x: number | undefined = undefined;
  private y: number | undefined = undefined;

  private actuallySendOutTooltipInfo = () => {
    if (this.hovered !== undefined && this.x !== undefined && this.y !== undefined) {
      const info: ITooltipInfo = {
        id: this.hovered,
        x: this.x,
        y: this.y,
      };
      this.x = undefined;
      this.y = undefined;
      this.props.showTooltip(info);
    }
  }

  private sendOutTooltipInfo = throttle(() => {
    this.actuallySendOutTooltipInfo();
  }, throttleWait);

  private onMouseEnterFeature = (
      pixel: any,
      {offsetX, offsetY, target}: MouseEvent,
      {countryData, hideTooltip}: IProps,
    ) => {
    let tagName: string | null;
    if (target) {
      const htmlTarget = target as any;
      tagName = htmlTarget.tagName;
    } else {
      tagName = null;
    }
    if (this.olMap !== undefined) {
      const feature = this.olMap.forEachFeatureAtPixel(pixel, (eachFeature: any) => eachFeature);
      // `feature` can be `undefined` if the mouse is over areas without vector layer e.g. the ocean:
      // Only show tooltip when on the CANVAS as other elements, like zoom controls,
      // cause weird behavior
      if (feature && tagName === 'CANVAS') {
        const featureId = feature.getId();
        this.hovered = featureId;
        this.x = offsetX;
        this.y = offsetY;

        // Only trigger tooltip for non-primary country or country for which we have data:
        const retrievedFeatureData = countryData[featureId];
        if (retrievedFeatureData !== undefined &&
            retrievedFeatureData.isPrimaryCountry === false) {
          this.sendOutTooltipInfo();
        }
      } else {
        if (this.hovered !== undefined) {
          // If this is the first time the mouse moves away from land, send
          // signal to unhighlight the current country. Need this check because it's
          // possible for `highlighted` to go from `undefined` to `undefined`
          // e.g. when the mouse moves over the ocean:
          hideTooltip();
        }
        this.hovered = undefined;
      }

    }
  }

  private onMouseClickFeature = (pixel: any, {showDetailOverlay}: IProps) => {
    if (this.olMap !== undefined) {
      const feature = this.olMap.forEachFeatureAtPixel(pixel, (eachFeature: any) => eachFeature);
      // `feature` can be `undefined` if the mouse is over areas without vector layer e.g. the ocean:
      if (feature) {
        const featureId = feature.getId();
        this.hovered = featureId;
        showDetailOverlay(featureId);
      }
    }
  }

  //#endregion

  render() {
    return (
      <Root ref={this.rememberEl} onMouseLeave={this.onMouseLeaveMap}/>
    );
  }
}
