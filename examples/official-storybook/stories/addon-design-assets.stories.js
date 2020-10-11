import React from 'react';

export default {
  title: 'Addons/Design assets',

  parameters: {
    options: {
      selectedPanel: 'storybook/design-assets/panel',
    },
  },
};

export const SingleImage = () => <div>This story should a single image in the assets panel</div>;

SingleImage.storyName = 'single image';

SingleImage.parameters = {
  assets: ['https://via.placeholder.com/300/09f/fff.png'],
};

export const SingleWebpage = () => <div>This story should a single image in the assets panel</div>;

SingleWebpage.storyName = 'single webpage';

SingleWebpage.parameters = {
  assets: ['https://www.example.com'],
};

export const YoutubeVideo = () => <div>This story should a single image in the assets panel</div>;

YoutubeVideo.storyName = 'youtube video';

YoutubeVideo.parameters = {
  assets: ['https://www.youtube.com/embed/p-LFh5Y89eM'],
};

export const MultipleImages = () => (
  <div>This story should a multiple images in the assets panel</div>
);

MultipleImages.storyName = 'multiple images';

MultipleImages.parameters = {
  assets: [
    'https://via.placeholder.com/600/09f/fff.png',
    'https://via.placeholder.com/600/f90/fff.png',
  ],
};

export const NamedAssets = () => <div>This story should a single image in the assets panel</div>;

NamedAssets.storyName = 'named assets';

NamedAssets.parameters = {
  assets: [
    {
      name: 'blue',
      url: 'https://via.placeholder.com/300/09f/fff.png',
    },
    {
      name: 'orange',
      url: 'https://via.placeholder.com/300/f90/fff.png',
    },
  ],
};

export const UrlReplacement = () => (
  <div>This story should have a webpage, with within it's url the storyId</div>
);

UrlReplacement.storyName = 'url replacement';

UrlReplacement.parameters = {
  assets: ['https://via.placeholder.com/600.png?text={id}'],
};
