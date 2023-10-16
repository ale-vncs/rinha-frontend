import { NodeRender } from './NodeRender.tsx';
import { useJsonProvider } from '../hooks/useJsonProvider.ts';

export const JsonTreeViewer = () => {
  const { jsonSelected } = useJsonProvider();

  if (!jsonSelected) return <></>;

  return (
    <div className={'flex flex-col justify-start w-full relative overflow-auto'}>
      <p className={'top-0 sticky bg-gray-50 z-30'}>{jsonSelected.name}</p>
      <NodeRender value={jsonSelected.content} />
    </div>
  );
};
