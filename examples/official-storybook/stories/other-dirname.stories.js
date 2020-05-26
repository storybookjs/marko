import React from 'react';
import base from 'paths.macro';

import BaseButton from '../components/BaseButton';

export const story1 = () => <BaseButton label="Story 1" />;
story1.storyName = 'story 1';

export const story2 = () => <BaseButton label="Story 2" />;
story2.storyName = 'story 2';
