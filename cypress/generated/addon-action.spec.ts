import { visit } from '../helper';

describe('addon-action', () => {
  before(() => {
    visit();
  });

  it('should trigger an action', () => {
    // click on the button
    cy.navigateToStory('button', 'text');

    cy.getStoryElement().contains('Button').click();
    cy.viewAddonPanel('Actions');

    // TODO @yannbf improve tab identifier on addons
    // get the logs
    cy.get('#storybook-panel-root')
      .contains(/onClick/)
      .should('be.visible');
  });
});
