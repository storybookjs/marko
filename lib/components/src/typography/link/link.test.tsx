import React, { AnchorHTMLAttributes } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import { Link, LinkProps } from './link';

const LEFT_BUTTON = 0;
const MIDDLE_BUTTON = 1;
const RIGHT_BUTTON = 2;

function ThemedLink(props: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <ThemeProvider theme={convert(themes.light)}>
      <Link {...props} />
    </ThemeProvider>
  );
}

describe('Link', () => {
  describe('events', () => {
    it('should call onClick on a plain left click', () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.click(screen.getByText('Content'), { button: LEFT_BUTTON });
      expect(handleClick).toHaveBeenCalled();
    });

    it("shouldn't call onClick on a middle click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.click(screen.getByText('Content'), { button: MIDDLE_BUTTON });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on a right click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.click(screen.getByText('Content'), { button: RIGHT_BUTTON });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on alt+click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.click(screen.getByText('Content'), { altKey: true });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on ctrl+click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.click(screen.getByText('Content'), { ctrlKey: true });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on cmd+click / win+click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.click(screen.getByText('Content'), { metaKey: true });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on shift+click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.click(screen.getByText('Content'), { shiftKey: true });
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
