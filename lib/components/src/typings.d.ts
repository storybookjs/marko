declare module 'global';
declare module 'markdown-to-jsx';
declare module '*.md';
declare module '@storybook/semver';

declare module 'react-editable-json-tree' {
  type JsonTreeData = object | Array;

  type CssStyleObject = object; // Keys = CSS properties

  // https://github.com/oxyno-zeta/react-editable-json-tree/blob/master/src/types/dataTypes.js
  export enum DATA_TYPES {
     ERROR = 'Error',
     OBJECT = 'Object',
     ARRAY = 'Array',
     STRING = 'String',
     NUMBER = 'Number',
     BOOLEAN = 'Boolean',
     DATE = 'Date',
     NULL = 'Null',
     UNDEFINED = 'Undefined',
     FUNCTION = 'Function',
     SYMBOL = 'Symbol',
  }

  // This interface is incomplete and only includes the props used by storybook.
  // More are available by visiting the project README.md
  interface JsonTreeProps {
    // Data to be displayed/edited
    data: JsonTreeData;
    // Function called each time an update is done and give the updated data
    onFullyUpdate?: (d: JsonTree) => void;
    // Root name for first object
    rootName?: string;

    // Get style (CSS keys)
    // Example responses:
    // https://github.com/oxyno-zeta/react-editable-json-tree/blob/master/src/utils/styles.js
    getStyle?: (
      keyName: string, // key name of currently selected node/value
      data: any, // data at the currently selected node/value
      keyPath: string[], // Array of keyNames to reach current node
      deep: number, // Depth of node within current tree
      dataType: DATA_TYPES, // Data type of selected node
    ) => {
        minus?: CssStyleObject;
        plus?: CssStyleObject;
        collapsed?: CssStyleObject;
        delimiter?: CssStyleObject;
        ul?: CssStyleObject;
        value?: CssStyleObject;
        name?: CssStyleObject;
        editForm?: CssStyleObject;
    }

    // Optional control overrides
    addButtonElement?: JSX.Element;
    cancelButtonElement?: JSX.Element;
    buttonElement?: JSX.Element;
    editButtonElement?: JSX.Element;

  }
  export const JsonTree: React.FC<JsonTreeProps>;
}
