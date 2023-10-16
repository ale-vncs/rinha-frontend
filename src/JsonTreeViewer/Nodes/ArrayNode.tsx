import { NodeRender } from '../NodeRender.tsx';
import { ExpandedWrapper } from '../ExpandedWrapper.tsx';

interface ArrayNodeProps {
  node?: string;
  value: unknown[];
}

export const ArrayNode = ({ node, value }: ArrayNodeProps) => {
  return (
    <ExpandedWrapper charWrapper={['[', ']']} node={node}>
      {value.map((value, index) => (
        <NodeRender key={`${node}-${index}`} node={String(index)} value={value} />
      ))}
    </ExpandedWrapper>
  );
};
