import * as load from './load';
let papers = {};
const currentBlocks = [];

export function paper(paperName, m) {
  m.hot.dispose(() => {
    delete papers[paperName];
  });
  papers[paperName] = {};
  function block(name, fn) {
    papers[paperName][name] = fn;
    return {block};
  }

  return {block};
}

export function getPapers() {
  return papers;
}

window.paper = paper;
window.getPapers = getPapers;
window.renderError = load.renderError;
window.renderMain = load.renderMain;
