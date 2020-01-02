import {
  array,
  boolean,
  color,
  date,
  select,
  withKnobs,
  text,
  number,
} from '@storybook/addon-knobs';

export default {
  title: 'Addons/Knobs',
  decorators: [withKnobs],
};

export const Simple = () => {
  const name = text('Name', 'John Doe');
  const age = number('Age', 44);
  const content = `I am ${name} and I'm ${age} years old.`;
  return { content };
};
Simple.story = {
  parameters: {
    server: { id: 'addons/knobs/simple' },
  },
};

export const Story3 = () => {
  const name = text('Name', 'John Doe');
  const textColor = color('Text color', 'orangered');
  return { name, textColor };
};
Story3.story = {
  name: 'CSS transitions',
  parameters: {
    server: { id: 'addons/knobs/story3' },
  },
};

export const Story4 = () => {
  const name = text('Name', 'Jane');
  const stock = number('Stock', 20, {
    range: true,
    min: 0,
    max: 30,
    step: 5,
  });
  const fruits = {
    Apple: 'apples',
    Banana: 'bananas',
    Cherry: 'cherries',
  };
  const fruit = select('Fruit', fruits, 'apples');
  const price = number('Price', 2.25);
  const colour = color('Border', 'deeppink');
  const today = date('Today', new Date('Jan 20 2017 GMT+0'));
  const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
  const nice = boolean('Nice', true);

  const stockMessage = stock
    ? `I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
    : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;

  const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

  const style = `border: 2px dotted ${colour}; padding: 8px 22px; border-radius: 8px`;

  return {
    style,
    name,
    today,
    dateOptions: JSON.stringify(dateOptions),
    stockMessage,
    items: JSON.stringify(items),
    salutation,
  };
};
Story4.story = {
  name: 'All knobs',
  parameters: {
    server: { id: 'addons/knobs/story4' },
  },
};

export const Story5 = () => {
  const content = text('Rendered string', '<img src=x onerror="alert(\'XSS Attack\')" >');
  return { content };
};
Story5.story = {
  name: 'XSS safety',
  parameters: {
    server: { id: 'addons/knobs/story5' },
  },
};
