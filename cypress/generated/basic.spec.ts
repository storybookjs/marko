describe('Basic Flow', () => {
  before(() => {
    cy.visitStorybook();
  });

  it('should load welcome flow', () => {
    cy.navigateToStory('example-introduction', 'page');

    // assert url changes
    cy.url().should('include', 'path=/story/example-introduction--page');

    // check for selected element
    cy.get('#example-introduction--page').should('have.class', 'selected');

    // check for content
    cy.getDocsElement().should('contain.text', 'Welcome to Storybook');
  });
});
