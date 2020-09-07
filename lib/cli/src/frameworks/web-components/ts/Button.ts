import { html } from 'lit-html';

export interface ButtonProps {
  primary: boolean;
  backgroundColor: string;
  size: string;
  label: string;
  onClick: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary,
  backgroundColor,
  size,
  label,
  onClick,
}: Partial<ButtonProps>) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';

  return html`
    <button
      type="button"
      class=${['storybook-button', `storybook-button--${size || 'medium'}`, mode].join(' ')}
      style=${backgroundColor && { backgroundColor }}
      @click=${onClick}
    >
      ${label}
    </button>
  `;
};
