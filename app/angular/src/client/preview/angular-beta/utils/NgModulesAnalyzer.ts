import { NgModule } from '@angular/core';

/**
 * Avoid component redeclaration
 *
 * Checks recursively if the component has already been declared in all import Module
 */
export const isComponentAlreadyDeclaredInModules = (
  componentToFind: any,
  moduleDeclarations: any[],
  moduleImports: any[]
): boolean => {
  if (
    moduleDeclarations &&
    moduleDeclarations.some((declaration) => declaration === componentToFind)
  ) {
    // Found component in declarations array
    return true;
  }
  if (!moduleImports) {
    return false;
  }

  return moduleImports.some((importItem) => {
    const extractedNgModuleMetadata = extractNgModuleMetadata(importItem);
    if (!extractedNgModuleMetadata) {
      // Not an NgModule
      return false;
    }
    return isComponentAlreadyDeclaredInModules(
      componentToFind,
      extractedNgModuleMetadata.declarations,
      extractedNgModuleMetadata.imports
    );
  });
};

const extractNgModuleMetadata = (importItem: any): NgModule => {
  const target = importItem && importItem.ngModule ? importItem.ngModule : importItem;
  const decoratorKey = '__annotations__';
  const decorators: any[] =
    Reflect &&
    Reflect.getOwnPropertyDescriptor &&
    Reflect.getOwnPropertyDescriptor(target, decoratorKey)
      ? Reflect.getOwnPropertyDescriptor(target, decoratorKey).value
      : target[decoratorKey];

  if (!decorators || decorators.length === 0) {
    return null;
  }

  const ngModuleDecorator: NgModule | undefined = decorators.find(
    (decorator) => decorator instanceof NgModule
  );
  if (!ngModuleDecorator) {
    return null;
  }
  return ngModuleDecorator;
};
