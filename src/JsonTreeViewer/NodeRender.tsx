import { PrimitiveNode } from './Nodes/PrimitiveNode.tsx';
import { ArrayNode } from './Nodes/ArrayNode.tsx';
import { ObjectNode } from './Nodes/ObjectNode.tsx';

export interface NodeRenderProps {
  node?: string;
  value: unknown;
}

export const NodeRender = ({ node, value }: NodeRenderProps) => {
  const type = typeof value;

  const primitiveType = ['string', 'number', 'boolean', 'undefined'];

  if (primitiveType.includes(type) || value === null) {
    return <PrimitiveNode node={node} value={value as never} />;
  }

  if (Array.isArray(value)) {
    return <ArrayNode node={node} value={value} />;
  }

  return <ObjectNode node={node} value={value as never} />;
};
