import { NodeRender } from './NodeRender.tsx';
import { useJsonProvider } from '../hooks/useJsonProvider.ts';

export const JsonTreeViewer = () => {
  const { jsonSelected } = useJsonProvider();

  if (!jsonSelected) return <></>;

  return (
    <div className={'flex flex-col justify-start w-full relative overflow-auto'}>
      <NodeRender node={'root'} value={jsonSelected.content} />
    </div>
  );
};
