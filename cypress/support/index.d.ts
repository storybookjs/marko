/// <reference types="cypress" />

type LoggerMethod = 'log' | 'info' | 'debug';

declare namespace Cypress {
  interface Chainable {
    /**
     * Visit storybook's introduction page
     */
    visitStorybook(): Chainable<Element>;

    /**
     * Custom command to select the DOM element of a story in the canvas tab.
     */
    getStoryElement(): Chainable<Element>;

    /**
     * Custom command to select the DOM element of a docs story in the canvas tab.
     */
    getDocsElement(): Chainable<Element>;

    /**
     * Custom command to select the DOM element of the preview iframe in the canvas tab.
     */
    getCanvasElement(): Chainable<Element>;

    /**
     * Custom command to select the DOM element of the body from the preview iframe in the canvas tab.
     */
    getCanvasBodyElement(): Chainable<Element>;

    /**
     * Navigate to a story.
     * 'Storybook Example/Button'
     *  -  kind: `Storybook Example`
     *  -  name: `Button`
     * @param kind Story kind
     * @param name name of the story
     */
    navigateToStory(kind: string, name: string): Chainable<Element>;

    /**
     * Display addon panel
     * @param name of the addon
     */
    viewAddonPanel(name: string): Chainable<Element>;

    /**
     * Returns the element while logging it.
     */
    console(method: LoggerMethod): Chainable<Element>;
  }
}
