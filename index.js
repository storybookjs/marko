let papers = {};
const currentBlocks = [];

module.exports.paper = function paper(paperName, m) {
  m.hot.dispose(function() {
    delete papers[paperName];
  });

  papers[paperName] = {};

  function block(name, fn) {
    papers[paperName][name] = fn;
    return {block: block};
  }

  return {block: block};
}

module.exports.getPapers = function getPapers() {
  return papers;
}
