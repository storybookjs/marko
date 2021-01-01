import { FileReader } from 'global';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import { ControlProps } from './types';

import { Form } from '../form';

export interface FilesControlProps extends ControlProps<string[]> {
  accept: string;
}

const FileInput = styled(Form.Input)({
  paddingTop: 12,
});

function fileReaderPromise(file: File) {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (e: Event) => resolve((e.currentTarget as FileReader).result as string);
    fileReader.readAsDataURL(file);
  });
}

// const serialize = (): undefined => undefined;
// const deserialize = (): undefined => undefined;

export const FilesControl: FunctionComponent<FilesControlProps> = ({ onChange, name, accept }) => (
  <FileInput
    type="file"
    name={name}
    multiple
    onChange={(e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        Promise.all(Array.from(e.target.files).map(fileReaderPromise)).then(onChange);
      }
    }}
    accept={accept}
    size="flex"
  />
);

FilesControl.defaultProps = {
  onChange: (value) => value,
};
