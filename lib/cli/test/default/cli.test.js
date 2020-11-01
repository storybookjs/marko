const run = require('../helpers');

describe('Default behavior', () => {
  it('suggests the closest match to an unknown command', () => {
    const { output, status } = run(['upgraed']);
    const stdout = output.toString();
    expect(stdout).toContain('Did you mean upgrade?');
    expect(status).toBe(1);
  });
});
