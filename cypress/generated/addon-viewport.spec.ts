describe('addon-viewport', () => {
  before(() => {
    cy.visitStorybook();
  });

  it('should have viewport button in the toolbar', () => {
    cy.navigateToStory('example-button', 'Primary');

    // Click on viewport button and select small mobile
    cy.get('[title="Change the size of the preview"]').click();
    cy.get('#mobile1').click();

    // Check that Welcome story is still displayed
    cy.getStoryElement().should('contain.text', 'Button');
  });
});
