describe('addon-link', () => {
  before(() => {
    cy.visitStorybook();
  });

  it('should redirect to another story', () => {
    cy.navigateToStory('button', 'button with link to another story');

    // check for content
    cy.getStoryElement().contains('Go to Welcome Story').click();

    // assert url changes
    cy.url().should('include', 'path=/story/example-introduction--page');
  });
});
