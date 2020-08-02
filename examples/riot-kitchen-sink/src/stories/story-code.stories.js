import { tag, mount, asCompiledCode } from '@storybook/riot';
import SimpleTestRaw from './SimpleTest.txt';
import './AnotherTest.tag';

const simpleTestCompiled = asCompiledCode(SimpleTestRaw);

export default {
  title: 'Story/How to create a story',
};

export const BuiltWithTag = () =>
  tag('test', '<div>simple test ({ opts.value })</div>', '', '', () => {}) &&
  mount('test', { value: 'with a parameter' });

BuiltWithTag.storyName = 'built with tag';

export const BuiltAsString = () => ({ tags: ['<test><div>simple test</div></test>'] });

BuiltAsString.storyName = 'built as string';

export const BuiltFromRawImport = () => simpleTestCompiled;

BuiltFromRawImport.storyName = 'built from raw import';

export const BuiltFromTagsAndTemplate = () => ({
  tags: [{ content: SimpleTestRaw, boundAs: 'mustBeUniquePlease' }],
  template:
    '<SimpleTest test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
});

BuiltFromTagsAndTemplate.storyName = 'built from tags and template';

export const TagsTemplateAndTagConstructorAtOnce = () => ({
  tags: [
    {
      content:
        "<SimpleTest><div>HACKED : {opts.hacked} ; simple test ({opts.test || 'without parameter'}). Oh, by the way ({opts.riotValue || '... well, nothing'})</div></SimpleTest>",
      boundAs: 'mustBeUniquePlease',
    },
  ],
  template:
    '<SimpleTest hacked={hacked} test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
  tagConstructor: function tagConstructor() {
    this.hacked = true;
  },
});

TagsTemplateAndTagConstructorAtOnce.storyName = 'tags, template and tagConstructor at once';

export const BuiltFromThePrecompilation = () => mount('anothertest', {});

BuiltFromThePrecompilation.storyName = 'built from the precompilation';

export const TheMountInstructionIsNotNecessary = () => ({ tagName: 'anothertest', opts: {} });

TheMountInstructionIsNotNecessary.storyName = 'the mount instruction is not necessary';

export const TheOptsValueIsNotNecessary = () => ({ tagName: 'anothertest' });

TheOptsValueIsNotNecessary.storyName = 'the opts value is not necessary';
