import { NodeRender } from '../NodeRender.tsx';
import { ExpandedWrapper } from '../ExpandedWrapper.tsx';

interface ObjectNodeProps {
  node?: string;
  value: Record<string, unknown>;
}

export const ObjectNode = ({ node, value }: ObjectNodeProps) => {
  return (
    <ExpandedWrapper node={node} charWrapper={['{', '}']}>
      {Object.entries(value).map(([key, value]) => (
        <NodeRender node={key} value={value} />
      ))}
    </ExpandedWrapper>
  );
};
