import { Parser } from 'acorn';
import jsx from 'acorn-jsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import estree from 'estree';
import * as acornWalk from 'acorn-walk';
import {
  InspectionType,
  InspectionLiteral,
  InspectionElement,
  InspectionFunction,
  InspectionClass,
  InspectionObject,
  InspectionUnknown,
  InspectionIdentifier,
  InspectionArray,
  InspectionInferedType,
} from './types';

interface ParsingResult<T> {
  inferredType: T;
  ast: any;
}

const ACORN_WALK_VISITORS = {
  // @ts-ignore
  ...acornWalk.base,
  JSXElement: () => {},
};

const acornParser = Parser.extend(jsx());

// Cannot use "estree.Identifier" type because this function also support "JSXIdentifier".
function extractIdentifierName(identifierNode: any) {
  return identifierNode != null ? identifierNode.name : null;
}

function filterAncestors(ancestors: estree.Node[]): estree.Node[] {
  return ancestors.filter((x) => x.type === 'ObjectExpression' || x.type === 'ArrayExpression');
}

function calculateNodeDepth(node: estree.Expression): number {
  const depths: number[] = [];

  acornWalk.ancestor(
    // @ts-ignore
    node,
    {
      ObjectExpression(_: any, ancestors: estree.Node[]) {
        depths.push(filterAncestors(ancestors).length);
      },
      ArrayExpression(_: any, ancestors: estree.Node[]) {
        depths.push(filterAncestors(ancestors).length);
      },
    },
    ACORN_WALK_VISITORS
  );

  return Math.max(...depths);
}

function parseIdentifier(identifierNode: estree.Identifier): ParsingResult<InspectionIdentifier> {
  return {
    inferredType: {
      type: InspectionType.IDENTIFIER,
      identifier: extractIdentifierName(identifierNode),
    },
    ast: identifierNode,
  };
}

function parseLiteral(literalNode: estree.Literal): ParsingResult<InspectionLiteral> {
  return {
    inferredType: { type: InspectionType.LITERAL },
    ast: literalNode,
  };
}

function parseFunction(
  funcNode: estree.FunctionExpression | estree.ArrowFunctionExpression
): ParsingResult<InspectionFunction | InspectionElement> {
  let innerJsxElementNode;

  // If there is at least a JSXElement in the body of the function, then it's a React component.
  acornWalk.simple(
    // @ts-ignore
    funcNode.body,
    {
      JSXElement(node: any) {
        innerJsxElementNode = node;
      },
    },
    ACORN_WALK_VISITORS
  );

  const isJsx = innerJsxElementNode != null;

  const inferredType: InspectionFunction | InspectionElement = {
    type: isJsx ? InspectionType.ELEMENT : InspectionType.FUNCTION,
    params: funcNode.params,
    hasParams: funcNode.params.length !== 0,
  };

  const identifierName = extractIdentifierName((funcNode as estree.FunctionExpression).id);
  if (identifierName != null) {
    inferredType.identifier = identifierName;
  }

  return {
    inferredType,
    ast: funcNode,
  };
}

function parseClass(
  classNode: estree.ClassExpression
): ParsingResult<InspectionClass | InspectionElement> {
  let innerJsxElementNode;

  // If there is at least a JSXElement in the body of the class, then it's a React component.
  acornWalk.simple(
    // @ts-ignore
    classNode.body,
    {
      JSXElement(node: any) {
        innerJsxElementNode = node;
      },
    },
    ACORN_WALK_VISITORS
  );

  const inferredType: any = {
    type: innerJsxElementNode != null ? InspectionType.ELEMENT : InspectionType.CLASS,
    identifier: extractIdentifierName(classNode.id),
  };

  return {
    inferredType,
    ast: classNode,
  };
}

function parseJsxElement(jsxElementNode: any): ParsingResult<InspectionElement> {
  const inferredType: InspectionElement = {
    type: InspectionType.ELEMENT,
  };

  const identifierName = extractIdentifierName(jsxElementNode.openingElement.name);
  if (identifierName != null) {
    inferredType.identifier = identifierName;
  }

  return {
    inferredType,
    ast: jsxElementNode,
  };
}

function parseCall(callNode: estree.CallExpression): ParsingResult<InspectionObject> {
  const identifierNode =
    callNode.callee.type === 'MemberExpression' ? callNode.callee.property : callNode.callee;

  const identifierName = extractIdentifierName(identifierNode);
  if (identifierName === 'shape') {
    return parseObject(callNode.arguments[0] as estree.ObjectExpression);
  }

  return null;
}

function parseObject(objectNode: estree.ObjectExpression): ParsingResult<InspectionObject> {
  return {
    inferredType: { type: InspectionType.OBJECT, depth: calculateNodeDepth(objectNode) },
    ast: objectNode,
  };
}

function parseArray(arrayNode: estree.ArrayExpression): ParsingResult<InspectionArray> {
  return {
    inferredType: { type: InspectionType.ARRAY, depth: calculateNodeDepth(arrayNode) },
    ast: arrayNode,
  };
}

// Cannot set "expression" type to "estree.Expression" because the type doesn't include JSX.
function parseExpression(expression: any): ParsingResult<InspectionInferedType> {
  switch (expression.type) {
    case 'Identifier':
      return parseIdentifier(expression);
    case 'Literal':
      return parseLiteral(expression);
    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
      return parseFunction(expression);
    case 'ClassExpression':
      return parseClass(expression);
    case 'JSXElement':
      return parseJsxElement(expression);
    case 'CallExpression':
      return parseCall(expression);
    case 'ObjectExpression':
      return parseObject(expression);
    case 'ArrayExpression':
      return parseArray(expression);
    default:
      return null;
  }
}

export function parse(value: string): ParsingResult<InspectionInferedType> {
  const ast = (acornParser.parse(`(${value})`) as unknown) as estree.Program;

  let parsingResult: ParsingResult<InspectionUnknown> = {
    inferredType: { type: InspectionType.UNKNOWN },
    ast,
  };

  if (ast.body[0] != null) {
    const rootNode = ast.body[0];

    switch (rootNode.type) {
      case 'ExpressionStatement': {
        const expressionResult = parseExpression(rootNode.expression);
        if (expressionResult != null) {
          parsingResult = expressionResult as any;
        }
        break;
      }
      default:
        break;
    }
  }

  return parsingResult;
}
