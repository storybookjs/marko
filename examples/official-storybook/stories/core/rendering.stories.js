import React, { useEffect, useRef } from 'react';

export default {
  title: 'Core/Rendering',
};

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
