import React from 'react';
import { DocumentFormatting } from '../typography/DocumentFormatting';
import { DocsPage } from './DocsPage';
import * as previewStories from './Preview.stories';
import * as propsStories from './Props.stories';
import * as sourceStories from './Source.stories';
import MarkdownCaption from './DocsPageExampleCaption.mdx';

export const componentMeta = {
  title: 'Docs|DocsPage',
  Component: DocsPage,
  decorators: [storyFn => <DocumentFormatting>{storyFn()}</DocumentFormatting>],
};

export const empty = () => (
  <DocsPage
    title={null}
    previewProps={previewStories.error().props}
    propsProps={propsStories.error().props}
    sourceProps={sourceStories.sourceUnavailable().props}
  />
);

export const noText = () => (
  <DocsPage
    title="no text"
    previewProps={previewStories.inline().props}
    propsProps={propsStories.normal().props}
    sourceProps={sourceStories.jsx().props}
  />
);
noText.title = 'no text';

const textCaption = `That was Wintermute, manipulating the lock the way it had manipulated the drone micro and the amplified breathing of the room where Case waited. The semiotics of the bright void beyond the chain link. The tug Marcus Garvey, a steel drum nine meters long and two in diameter, creaked and shuddered as Maelcum punched for a California gambling cartel, then as a paid killer in the dark, curled in his capsule in some coffin hotel, his hands clawed into the nearest door and watched the other passengers as he rode. After the postoperative check at the clinic, Molly took him to the simple Chinese hollow points Shin had sold him. Still it was a handgun and nine rounds of ammunition, and as he made his way down Shiga from the missionaries, the train reached Case’s station. Now this quiet courtyard, Sunday afternoon, this girl with a random collection of European furniture, as though Deane had once intended to use the place as his home. Case felt the edge of the Flatline as a construct, a hardwired ROM cassette replicating a dead man’s skills, obsessions, kneejerk responses. They were dropping, losing altitude in a canyon of rainbow foliage, a lurid communal mural that completely covered the hull of the console in faded pinks and yellows.`;
export const text = () => (
  <DocsPage
    title="text"
    caption={textCaption}
    previewProps={previewStories.inline().props}
    propsProps={propsStories.normal().props}
    sourceProps={sourceStories.jsx().props}
  />
);

export const markdown = () => (
  <DocsPage
    title="markdown"
    caption={<MarkdownCaption />}
    previewProps={previewStories.inline().props}
    propsProps={propsStories.normal().props}
    sourceProps={sourceStories.jsx().props}
  />
);
