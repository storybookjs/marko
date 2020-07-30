describe('Basic CLI', () => {
  before(() => {
    cy.visitStorybook();
  });

  describe('Welcome story (MDX)', () => {
    it('should load and display', () => {
      cy.navigateToStory('example-introduction', 'page');
      cy.getDocsElement().should('contain.text', 'Welcome to Storybook');
    });
  });

  describe('Button story', () => {
    it('should load primary story', () => {
      cy.navigateToStory('example-button', 'primary');
      cy.getStoryElement()
        .find('button')
        .should('have.class', 'storybook-button')
        .and('have.class', 'storybook-button--primary');
    });

    it('should load secondary story', () => {
      cy.navigateToStory('example-button', 'secondary');
      cy.getStoryElement()
        .find('button')
        .should('have.class', 'storybook-button')
        .and('have.class', 'storybook-button--secondary');
    });
    it('should load small story', () => {
      cy.navigateToStory('example-button', 'small');
      cy.getStoryElement()
        .find('button')
        .should('have.class', 'storybook-button')
        .and('have.class', 'storybook-button--small');
    });
    it('should load large story', () => {
      cy.navigateToStory('example-button', 'large');
      cy.getStoryElement()
        .find('button')
        .should('have.class', 'storybook-button')
        .and('have.class', 'storybook-button--large');
    });
  });

  describe('Header story', () => {
    it('should load and display logged in', () => {
      cy.navigateToStory('example-header', 'logged-in');
      cy.getStoryElement().find('header').should('contain.text', 'Acme');
      cy.getStoryElement().find('button').should('contain.text', 'Log out');
    });

    it('should load and display logged out', () => {
      cy.navigateToStory('example-header', 'logged-out');
      cy.getStoryElement().find('header').should('contain.text', 'Acme');
      cy.getStoryElement().find('button').first().should('contain.text', 'Log in');
      cy.getStoryElement().find('button').last().should('contain.text', 'Sign up');
    });
  });

  describe('Page story', () => {
    it('should load and display logged in', () => {
      cy.navigateToStory('example-page', 'logged-in');
      cy.getStoryElement().find('header').should('contain.text', 'Acme');
      cy.getStoryElement().find('button').should('contain.text', 'Log out');
      cy.getStoryElement().should('contain.text', 'Pages in Storybook');
    });

    it('should load and display logged out', () => {
      cy.navigateToStory('example-page', 'logged-out');
      cy.getStoryElement().should('contain.text', 'Acme');
      cy.getStoryElement().find('button').first().should('contain.text', 'Log in');
      cy.getStoryElement().find('button').last().should('contain.text', 'Sign up');
      cy.getStoryElement().should('contain.text', 'Pages in Storybook');
    });
  });
});
