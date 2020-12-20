import React from 'react';

export const FastRefreshExample = () => {
  const [value, setValue] = React.useState('abc');
  return (
    <>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
      <p>Change the input value then this text in the component file.</p>
      <p>The state of the input should be kept.</p>
    </>
  );
};
