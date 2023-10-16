import { useJsonProvider } from '../hooks/useJsonProvider.ts';
import { LoadingIndicator } from '../components/LoadingIndicator.tsx';
import { clsx } from 'clsx';

export const JsonList = () => {
  const { files, selectJsonById } = useJsonProvider();

  if (!files.length) {
    return <p className={'text-center'}>No json :(</p>;
  }

  const onClickCard = (jsonId: string) => {
    const jsonData = files.find((item) => item.id === jsonId);
    if (!jsonData || jsonData?.status !== 'AVAILABLE') return;
    selectJsonById(jsonData.id);
  };

  return (
    <div className={'flex gap-2 h-full w-full flex-col overflow-auto'}>
      {files.map((item) => {
        return (
          <div
            key={item.id}
            onClick={() => onClickCard(item.id)}
            className={clsx('flex justify-between border border-gray-500 p-2 rounded w-full max-w-xs', {
              'bg-green-200 border-green-500 cursor-pointer': item.status === 'AVAILABLE',
              'bg-yellow-200 border-yellow-500': item.status === 'LOADING',
              'bg-red-200 border-red-500': item.status === 'ERROR',
            })}
          >
            <p>{item.name}</p>
            {item.status === 'LOADING' && <LoadingIndicator />}
            {item.status === 'ERROR' && (
              <span className={'w-6 h-6 rounded-full bg-red-500 text-center text-white'}>!</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
