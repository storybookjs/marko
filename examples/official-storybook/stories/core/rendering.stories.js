import React, { useRef } from 'react';

export default {
  title: 'Core/Rendering',
};

// NOTE: in our example apps each component is mounted twice as we render in strict mode
let timesMounted = 0;
export const Counter = () => {
  const countRef = useRef();

  if (!countRef.current) timesMounted += 1;
  countRef.current = (countRef.current || 0) + 1;

  return (
    <div>
      Mounted: {timesMounted}, rendered (this mount): {countRef.current}
    </div>
  );
};
