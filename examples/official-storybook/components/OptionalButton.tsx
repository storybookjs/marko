import React from 'react';

// Repro #11019
interface Props {
  kind?: 'a' | 'b';
  disabled?: boolean;
}

export const OptionalButton = ({ disabled = false, kind = 'a' }: Props) => (
  // eslint-disable-next-line react/button-has-type
  <button {...{ disabled }}>Repro</button>
);

export default OptionalButton;
