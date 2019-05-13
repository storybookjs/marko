import React from 'react';
import { Preview } from './Preview';
import { Wrapper as DocsPageWrapper } from './DocsPage';
import { Button } from '../Button/Button';

export const componentMeta = {
  title: 'Docs|Preview',
  Component: Preview,
  decorators: [getStory => <DocsPageWrapper>{getStory()}</DocsPageWrapper>],
};

export const single = () => (
  <Preview>
    <Button>Button 1</Button>
  </Preview>
);

export const row = () => (
  <Preview>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </Preview>
);

export const column = () => (
  <Preview column>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </Preview>
);

export const grid = () => (
  <Preview>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
    <Button>Button 4</Button>
    <Button>Button 5</Button>
    <Button>Button 6</Button>
    <Button>Button 7</Button>
    <Button>Button 8</Button>
    <Button>Button 9</Button>
    <Button>Button 10</Button>
    <Button>Button 11</Button>
    <Button>Button 12</Button>
    <Button>Button 13</Button>
    <Button>Button 14</Button>
    <Button>Button 15</Button>
    <Button>Button 16</Button>
    <Button>Button 17</Button>
    <Button>Button 18</Button>
    <Button>Button 19</Button>
    <Button>Button 20</Button>
  </Preview>
);
