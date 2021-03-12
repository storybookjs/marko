function managerEntries(entry = []) {
  return [...entry, require.resolve('./dist/esm/register')];
}

function config(entry = []) {
  return [
    ...entry,
    require.resolve('./dist/esm/a11yRunner'),
    require.resolve('./dist/esm/a11yHighlight'),
  ];
}

module.exports = { managerEntries, config };
