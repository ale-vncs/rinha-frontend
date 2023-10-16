import { NodeRender } from './NodeRender.tsx';
import { useUploadProvider } from '../hooks/useUploadProvider.ts';

export const JsonTreeViewer = () => {
  const { jsonSelected } = useUploadProvider();

  if (!jsonSelected) return <></>;

  return (
    <div className={'flex flex-col justify-start w-full relative overflow-auto'}>
      <NodeRender node={'root'} value={jsonSelected.content} />
    </div>
  );
};
