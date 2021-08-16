import {defaults as controlDefaults} from 'ol/control';
import getResetControl from './mapResetZoomPan';
import styles from './zoomPanControls.css';

// Give the map a standard set of controls: zoom in, zoom out and reset that
// shares the same styling as all the non-map graphs:
export default function(defaultZoomLevel: number, defaultCenterCoords: [number, number]) {
  // Reset zoom/pan button:
  const ResetControl = getResetControl(defaultZoomLevel, defaultCenterCoords);

  return controlDefaults({
  attribution: false,
  zoomOptions: {
    className: styles.geoMapContainer,
    },
  }).extend([
    new (ResetControl as any)(),
  ]);
}
