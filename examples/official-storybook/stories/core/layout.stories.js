import React from 'react';

// eslint-disable-next-line react/prop-types
const Box = ({ children, display = 'block' }) => (
  <div style={{ display, border: '2px solid #FF4785', padding: 10 }}>{children}</div>
);

export default {
  title: 'Core/Layout',
};

export const Default = () => <Box>padded by default</Box>;

export const PaddedBlock = () => <Box>padded</Box>;
PaddedBlock.parameters = { layout: 'padded' };

export const PaddedInline = () => <Box display="inline-block">padded</Box>;
PaddedInline.parameters = { layout: 'padded' };

export const FullscreenBlock = () => <Box>fullscreen</Box>;
FullscreenBlock.parameters = { layout: 'fullscreen' };

export const FullscreenInline = () => <Box display="inline-block">fullscreen</Box>;
FullscreenInline.parameters = { layout: 'fullscreen' };

export const CenteredBlock = () => <Box>centered</Box>;
CenteredBlock.parameters = { layout: 'centered' };

export const CenteredInline = () => <Box display="inline-block">centered</Box>;
CenteredInline.parameters = { layout: 'centered' };

export const None = () => <Box>none</Box>;
None.parameters = { layout: 'none' };

export const Invalid = () => <Box>invalid layout value</Box>;
Invalid.parameters = { layout: '!invalid!' };
