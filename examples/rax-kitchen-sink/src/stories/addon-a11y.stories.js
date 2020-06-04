import { createElement } from 'rax';
import Text from 'rax-text';
import View from 'rax-view';

export default {
  title: 'Addon/addon-a11y',
};

export const Basic = () => <Text>RAX TEXT NODE</Text>;

export const WithStyle = () => <Text style={{ fontSize: 20, color: 'blue' }}>Styled text</Text>;

WithStyle.storyName = 'with style';

export const WithMarkdown = () => (
  <button type="button">
    &nbsp;
    <Text id="text1">😀 😎 👍 💯</Text>
    <View>
      <Text id="text1">aaa</Text>
    </View>
    &nbsp;
  </button>
);

WithMarkdown.storyName = 'with markdown';
