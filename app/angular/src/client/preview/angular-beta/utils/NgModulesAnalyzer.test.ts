import { Component, NgModule } from '@angular/core';
import { isComponentAlreadyDeclaredInModules } from './NgModulesAnalyzer';

const FooComponent = Component({})(class {});

const BarComponent = Component({})(class {});

const BetaModule = NgModule({ declarations: [FooComponent] })(class {});

const AlphaModule = NgModule({ imports: [BetaModule] })(class {});

describe('isComponentAlreadyDeclaredInModules', () => {
  it('should return true when the component is already declared in one of modules', () => {
    expect(isComponentAlreadyDeclaredInModules(FooComponent, [], [AlphaModule])).toEqual(true);
  });

  it('should return true if the component is in moduleDeclarations', () => {
    expect(
      isComponentAlreadyDeclaredInModules(BarComponent, [BarComponent], [AlphaModule])
    ).toEqual(true);
  });

  it('should return false if the component is not declared', () => {
    expect(isComponentAlreadyDeclaredInModules(BarComponent, [], [AlphaModule])).toEqual(false);
  });
});
