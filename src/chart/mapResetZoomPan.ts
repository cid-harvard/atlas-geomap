import Control from 'ol/control/Control';
import {inAndOut} from 'ol/easing';
import styles from './zoomPanControls.css';

// Copied from `ol.inherits` method implementation:
const ol_inherits = function(childCtor: any, parentCtor: any) {
  childCtor.prototype = Object.create(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
};

// Returns the contructor for the "reset" button in `openlayers` map. that will
// restore the map to the `defaultZoomLevel` and centered at
// `defaultCenterCoords`. `defaultCenterCoords` need to be already transformed.
const getZoomPanReset = (
  defaultZoomLevel: number,
  defaultCenterCoords: [number, number]) => {

  // Taken from
  // https://github.com/openlayers/openlayers/blob/4255e81b930fa1d9fd13bfc078a7a00cc315c769/examples/custom-controls.js
  function ResetControl(this: any, options: any = {}) {
    const button = document.createElement('button');
    button.innerHTML = 'RESET';

    const that = this;
    const zoomToFitUSA = function() {
      const view = that.getMap().getView();
      view.animate({
        zoom: defaultZoomLevel,
        center: defaultCenterCoords,
        duration: 350,
        easing: inAndOut,
      });
    };

    button.addEventListener('click', zoomToFitUSA);
    button.addEventListener('touchstart', zoomToFitUSA);

    const element = document.createElement('div');
    element.className = `${styles.geoMapZoomContainer} ol-control ol-unselectable`;
    element.appendChild(button);

    Control.call(this, {
      element, target: options.target,
    });
  }
  ol_inherits(ResetControl, Control);

  return ResetControl;
};

export default getZoomPanReset;
