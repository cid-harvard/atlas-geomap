import React, {useState} from 'react'

import GeoMap from 'atlas-geomap'
import raw from 'raw.macro';

import styled from 'styled-components/macro';

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column:
  align-items: center;
  justify-content: center;
  background: lightgray;
`;

const Container = styled.div`
  width: 80%;
  height: 80%;
  margin: auto;
  cursor: pointer;
`;

const data_1 = JSON.parse(raw('./test-data.json'));
const data_2 = JSON.parse(raw('./test-data-2.json'));

const App = () => {
  const [alt, setAlt] = useState<boolean>(false);

  return (
    <Root>
      <div>
        <button onClick={() => setAlt(!alt)}>
          Toggle Data
        </button>
      </div>
      <Container>
        <GeoMap
          data={alt ? data_2 : data_1}
          hideTooltip={() => console.log('hide tooltip')}
          showTooltip={(info) => console.log(info)}
          onCountryClick={(countryId) => console.log(countryId)}
        />
      </Container>
    </Root>
  );
}

export default App
