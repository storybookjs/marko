/* eslint-disable react/button-has-type */
import React, { FC, FunctionComponent, SyntheticEvent } from 'react';

interface ButtonProps {
  /**
   * onClick description
   */
  onClick?: (e: SyntheticEvent) => void;
}

/**
 * Button functional component (React.FC)
 */
export const ButtonReactFC: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
ButtonReactFC.defaultProps = {
  // @ts-ignore
  onClick: null,
};

/**
 * Button functional component (FC)
 */
export const ButtonFC: FC<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
ButtonFC.defaultProps = {
  // @ts-ignore
  onClick: null,
};

/**
 * Button functional component (FunctionComponent)
 */
export const ButtonFunctionComponent: FunctionComponent<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
ButtonFunctionComponent.defaultProps = {
  // @ts-ignore
  onClick: null,
};
