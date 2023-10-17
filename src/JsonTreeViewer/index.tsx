import { NodeRender } from './NodeRender.tsx';
import { useJsonProvider } from '../hooks/useJsonProvider.ts';
import { LoadingIndicator } from '../components/LoadingIndicator.tsx';

export const JsonTreeViewer = () => {
  const { jsonSelected } = useJsonProvider();

  if (!jsonSelected) return <></>;

  return (
    <div className={'flex flex-col justify-start w-full relative overflow-auto'}>
      <div className={'top-0 sticky bg-gray-50 z-30 flex flex-nowrap gap-2'}>
        <p>{jsonSelected.name}</p>
        {jsonSelected.status === 'LOADING' && <LoadingIndicator />}
      </div>
      <NodeRender value={jsonSelected.content} />
    </div>
  );
};
