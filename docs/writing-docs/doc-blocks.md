---
title: 'Doc Blocks'
---

Doc Blocks are the building blocks of Storybook documentation pages. By default, [DocsPage](./docs-page) uses a combination of the below blocks to build a page for each of your components automatically. 

Also, custom [addons](../configure/user-interface#storybook-addons) can provide their own doc blocks, and there are many available.

### ArgsTable

Storybook Docs automatically generates component props tables for components in supported frameworks. These tables list the [args](../writing-stories/args) of the component, and even integrate with [controls](../essentials/controls) to allow you to change the args of the currently rendered story.

<div style="background-color:#F8FAFC">
TODO:add image per screenshot requirements (Use the same gif present in the SB 6.0 doc)
</div>

#### DocsPage

To use the ArgsTable in [DocsPage](./docspage#component-parameter), export a component property on your stories metadata:

```js
// MyComponent.stories.js

import { MyComponent } from './MyComponent';

export default {
  title: 'MyComponent',
  component: MyComponent,
};
// your templates and stories
```

#### MDX

To use the props table in MDX, use the Props block:

```js
// MyComponent.stories.mdx

import { Props } from '@storybook/addon-docs/blocks';
import { MyComponent } from './MyComponent';

# My Component!

<Props of={MyComponent} />
```

#### Customizing

Props tables are automatically inferred from your components and stories, but sometimes it's useful to customize the results.

<div style="background-color:#F8FAFC">
TODO: ask tom if links are accurate
</div>

Props tables are rendered from an internal data structure called [ArgTypes](../api/stories#argtypes). When you declare a story's component metadata, Docs automatically extracts ArgTypes based on the component's properties.

You can customize what's shown in the props table by customizing the ArgTypes data. This is currently available for [DocsPage](locate-docs-page) and `<Props story="xxx">` construct, but not for the `<Props of={component} />` construct.

> NOTE: This API is experimental and may change outside of the typical semver release cycle

The API documentation of ArgTypes is detailed in a [separate section](../api/stories#argtypes), but to control the description and default values, use the following fields:

| Field                        | Description                                                                                    |
|:-----------------------------|:----------------------------------------------------------------------------------------------:|
| **name**                     |The name of the property                                                                        |
| **type.required**            |The stories to be show, ordered by supplied name                                                |
| **description**              |A markdown description for the property                                                         |
|**table.type.summary**        |A short version of the type                                                                     |
|**table.type.detail**         |A short version of the type                                                                     |
|**table.defaultValue.summary**|A short version of the type                                                                     |
|**table.defaultValue.detail** |A short version of the type                                                                     |
|**control**                   |See [addon-controls README ](https://github.com/storybookjs/storybook/tree/next/addons/controls)|

For instance:

```js

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    label: {
      description: 'overwritten description',
      table: {
        type: { 
            summary: 'something short', 
            detail: 'something really really long' 
        },
      },
      control: {
        type: null,
      },
    },
  },
};
```

This would render a row with a modified description, a type display with a dropdown that shows the detail, and no control.

If you find yourself writing the same definition over and over again, Storybook provides some convenient shorthands, that help you streamline your work.

For instance you can use:

- `number`, which is shorthand for `type:{name :'number'}`
- `radio`, which is a shorhand for `control: {type: 'radio' }`

##### MDX

To customize argTypes in MDX, you can set an `mdx` prop on the `Meta` or `Story` components:

```js

<Meta
  title="MyComponent"
  component={MyComponent}
  argTypes={{
    label: { 
        name: 'label',
        /* other argtypes required */ 
    },
  }}
/>

<Story name="some story" argTypes={{
  label: { 
      name: 'different label', 
      /* other required data */  
    }
}}>
  {/* story contents */}
</Story>
```

#### Controls

The controls inside a props table are configured in exactly the same way as the [controls](../essentials/controls) addon pane. In fact you’ll probably notice the table is very similar! It uses the same component and mechanism behind the scenes.

### Source

Storybook Docs displays a story’s source code using the `Source` block. The snippet has built-in syntax highlighting and can be copied with the click of a button.

<div style="background-color:#F8FAFC">
TODO:add image per screenshot requirements (mention of a image in the SB 6.0 doc (needs to be vetted))
</div>

#### DocsPage

In DocsPage, the `Source` block appears automatically within each story’s [Preview] block.

<div style="background-color:#F8FAFC">
TODO:add image per screenshot requirements (mention of a image in the SB 6.0 doc (needs to be vetted))
</div>

To customize the source snippet that’s displayed for a story, set the `docs.source.code` parameter:

```js

export const CustomSource = () => Template.bind({});

CustomSource.parameters = {
  docs: { 
      source: { 
          code: 'Some custom string here';  
      } 
    },
};
```

#### MDX

You can also use the `Source` block in MDX. It accepts either a story ID or `code` snippet the `language` for syntax highlighting:

```js
import { Source } from '@storybook/addon-docs/blocks';
Import dedent from 'ts-dedent';

<Source
  language='css'
  code={dedent`
     .container {
       display: grid | inline-grid;
     }
  `}
/>
```

#### ⚒️ Description

Storybook Docs shows a component’s description extracted from the source code or based on a user-provided string.

<div style="background-color:#F8FAFC">
TODO:add image per screenshot requirements (mention of a image in the SB 6.0 doc (needs to be vetted))
</div>

#### DocsPage

<div style="background-color:#F8FAFC">
TODO: left it for now ask feedback tom/shillman on this based on [pr](https://github.com/storybookjs/storybook/issues/11441)
</div>

In DocsPage, a component’s description is shown at the top of the page. For [supported frameworks], the component description is automatically extracted from a docgen component above the component in its source code. It can also be set by the `docs.description` parameter.

<div style="background-color:#F8FAFC">
TODO:add image per screenshot requirements (mention of a image in the SB 6.0 doc (needs to be vetted))
</div>

```js

export default {
  title: 'CustomDescription'
  parameters: {
    docs: { 
        description: { 
            component: 'some component _markdown_' 
        } 
    },
  }
};

export const WithStoryDescription = Template.bind({});
WithStoryDescription.parameters = {
  docs: { 
      description: { 
          story: 'some story **markdown**' 
        } 
    },
};
```

#### MDX

In MDX, the `Description` shows the component’s description using the same heuristics as the DocsPage. It also accepts a markdown parameter to show any user-provided Markdown string.

```js

import { Description } from '@storybook/addon-docs/blocks';
import dedent from 'ts-dedent';
import { Button } from './Button';

<Description of={Button} />
<Description markdown={dedent`
  ## Custom description

  Insert fancy markdown here.
`}/>
```

### Story

Stories (component examples) are the basic building blocks in Storybook. In Storybook Docs, stories are rendered in the `Story` block.

#### DocsPage

In DocsPage a `Story` block is generated for each story in your [CSF] file, wrapped with a `Preview` wrapper that gives it a toolbar on top (in the case of the first “primary” story) and a source code preview underneath.

#### MDX

In MDX, the `Story` block is not only a way of displaying stories, but also the primary way to define them. Storybook looks for `Story` instances with the `name` prop, either defined at the top level of the document, or directly beneath a [Preview](#preview) block defined at the top level:

```js
import { Story } from '@storybook/addon-docs/blocks';
import { Button } from './Button';

export const Template = (args) => <Button {...args} />;

<Story name="Basic" args={{ label: ‘hello’ }}>
  {Template.bind({})
</Story>
```

You can also reference existing stories in Storybook by ID:

```js

import { Story } from '@storybook/addon-docs/blocks';

<Story id="some-component--some-name" />
```

#### Inline rendering

<div>
TODO: ask tom/michael about the preview iframe. as we've been calling it canvas so far and now move to preview.
And also inline rendering support location
</div>

In Storybook’s Canvas, all stories are rendered in the [Preview iframe] for isolated development. In Storybook Docs, when [inline rendering is supported by your framework](locate-link), inline rendering is used by default for performance and convenience. However, you can force iframe rendering with `docs: { inlineStories: false }` parameter, or `inline={false}` in MDX.


### Preview

Storybook Docs’ `Preview` block is a wrapper that provides a toolbar for interacting with its contents, and also also provides [Source](#Source) snippets automatically.

<divs tyle="background-color:#F8FAFC">
TODO:add image per screenshot requirements (mention of a image in the SB 6.0 doc (needs to be vetted))
</div>

#### DocsPage

In DocsPage, every story is wrapped in a `Preview` block. The first story on the page is called the _primary_, and it has a toolbar. The other stories are also wrapped with `Previews`, but there is no toolbar by default.

<div style="background-color:#F8FAFC">
TODO:add image per screenshot requirements (mention of a image in the SB 6.0 doc (needs to be vetted))
</div>

#### MDX

In MDX, `Preview` is more flexible: in addition to the DocsPage behavior, it can show multiple stories in one, and even show non-story content.

When you 

```js
import { Preview } from '@storybook/addon-docs/blocks';

export const Template = (args) => <Badge {...args } />

<Preview>
  <Story name="warning" args={{status: 'warning', label: 'Warning'}}>
    {Template.bind({})}
  </Story>
  <Story name="neutral" args={{status: 'neutral', label: 'Neutral' }}>
    {Template.bind({})}
  </Story>
  <Story name="error" args={{status: 'error', label: 'Error' }}>
    {Template.bind({})}
  </Story>
</Preview>
```

<div style="background-color:#F8FAFC">
TODO:add image per screenshot requirements (mention of a image in the SB 6.0 doc (needs to be vetted))
</div>

You can also place non-story content inside a `Preview` block:

```js
import { Preview } from '@storybook/addon-docs/blocks';
import { MyComponent } from './MyComponent';
<Preview>
  <h2>Some here</h2>
  <MyComponent />
</Preview>
```
<div>
TODO: ask tom about Source link for clarity, as me i know that the source shows ad hoc the story file content. But another reader might not know.
</div>

This renders the JSX content exactly as it would if you’d placed it directly in the MDX, but it also inserts the source snippet in a [Source](#source) block beneath the block.

<div style="background-color:#F8FAFC">
TODO:add image per screenshot requirements (mention of a image in the SB 6.0 doc (needs to be vetted))
</div>