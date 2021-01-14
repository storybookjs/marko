import Marionette from 'backbone.marionette';

const allMarionetteViewConstructors = [
  'View',
  'CompositeView',
  'CollectionView',
  'NextCollectionView',
];
const viewConstructorsSupportedByMarionette = allMarionetteViewConstructors
  .filter((constructorName) => constructorName in Marionette)
  .map((constructorName) => (Marionette as any)[constructorName]);

// accepts an element and return true if renderable else return false
const isMarionetteRenderable = (element: any) => {
  return viewConstructorsSupportedByMarionette.find(
    (Constructor) => element instanceof Constructor
  );
};

export default isMarionetteRenderable;
