import React from 'react';
import KeyboardWrapper from './KeyboardWrapper'
import Draw from './Draw'
import ActionsWrapper from './ActionsWrapper';

const World = () => {
  return (
    <KeyboardWrapper>
      <ActionsWrapper>
        <Draw />
      </ActionsWrapper>
    </KeyboardWrapper>
  );
}

export default World;
