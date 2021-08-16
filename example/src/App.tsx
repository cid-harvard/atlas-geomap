import React from 'react'

import GeoMap from 'atlas-geomap'
import raw from 'raw.macro';

import styled from 'styled-components/macro';

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background: lightgray;
`;

const Container = styled.div`
  width: 80%;
  height: 80%;
  margin: auto;
`;

const data = JSON.parse(raw('./test-data.json'));

const App = () => {
  return (
    <Root>
      <Container>
        <GeoMap
          data={data}
          hideTooltip={() => console.log('hide tooltip')}
          showTooltip={(info) => console.log(info)}
          onCountryClick={(countryId) => console.log(countryId)}
        />
      </Container>
    </Root>
  );
}

export default App
