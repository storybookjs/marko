import { visit, clickAddon } from '../helper';

describe('addon-link', () => {
  before(() => {
    visit();
    cy.get('#button').click();
  });

  it('should redirect to another story', () => {
    // click on the button
    cy.get('#button--button-with-link-to-another-story').click();

    // assert url changes
    cy.url().should('include', 'path=/story/button--button-with-link-to-another-story');

    // check for selected element
    cy.get('#button--button-with-link-to-another-story').should('have.class', 'selected');

    // check for content
    cy.getStoryElement().find('button').click();

    // assert url changes
    cy.url().should('include', 'path=/story/welcome--to-storybook');
  });
});
