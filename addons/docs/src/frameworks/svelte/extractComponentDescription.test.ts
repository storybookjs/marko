import { extractComponentDescription } from './extractComponentDescription';

describe('extractComponentDescription', () => {
  test('Extract from docgen', () => {
    expect(extractComponentDescription({ __docgen: { description: 'a description' } })).toBe(
      'a description'
    );
  });
  test('Null Component', () => {
    expect(extractComponentDescription(null)).toBeFalsy();
  });
  test('Missing docgen', () => {
    expect(extractComponentDescription({})).toBeFalsy();
  });
});
