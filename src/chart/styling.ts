import {css} from 'styled-components/macro';

const styles = css`
  /* Undo openlayer's default styling: */
  :global(.ol-control) {
    background-color: transparent;
  }

  :global(.ol-control):hover {
    background-color: transparent;
  }

  :global(.ol-control) button {
    margin: 0;
  }

  .container,
  .geoMapContainer {
    --container-top: 10px;
    --container-right: 10px;
    --button-size: 1.375rem;
    --button-margin-bottom: 5px;

    position: absolute;
    top: var(--container-top);
    right: var(--container-right);

    & button {
      width: 80px;
      height: 22px;
      border: 1px solid rgb(136, 136, 153);
      border-radius: 2px;
      cursor: pointer;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      color: rgb(136, 136, 153);
      opacity: 0.75;
      margin-bottom: 10px;
      font-weight: bold;
      background-color: #fff;
      font-size: 0.6rem;
      text-transform: uppercase;

      &:hover {
        opacity: 1;
        background-color: white;
      }
    }
  }

  .geoMapContainer {
    & button::after {
      content: 'ZOOM';
      margin-left: 0.25rem;
    }
  }

  /* This is needed so that the "reset" button lines up below the zoom in/out buttons: */
  .zoomContainer {
    composes: container;
    top: calc(var(--container-top) + var(--button-size) * 2 + var(--button-margin-bottom) * 2);
    right: var(--container-right);
  }

  .geoMapZoomContainer {
    composes: container;
    top: calc(var(--container-top) + var(--button-size) * 2 + var(--button-margin-bottom) * 2);
    right: var(--container-right);
    margin-top: 10px;
  }
`;

export default styles;
