import React from 'react';

export default {
  title: 'Core/React Refresh',
};

export const Refresh = () => {
  const [value, setValue] = React.useState('abc');
  return (
    <>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
      Change this in the story: cssss
    </>
  );
};
