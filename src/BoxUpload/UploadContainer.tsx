import { ChangeEvent, DragEvent, useState } from 'react';
import { clsx } from 'clsx';
import { useUploadProvider } from '../hooks/useUploadProvider.ts';

export const UploadContainer = () => {
  const { readFile } = useUploadProvider();

  const [isDragging, setIsDragging] = useState(false);

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    readFileList(e.dataTransfer.files);
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    readFileList(e.target.files);
  };

  const readFileList = (files: FileList | null) => {
    setIsDragging(false);
    if (!files) return;
    for (const file of files) {
      readFile(file);
    }
  };

  return (
    <div
      className={clsx(
        'w-96 rounded border-2 border-gray-400 border-dashed shadow text-center text-gray-600 hover:bg-blue-300 transition-colors',
        {
          'bg-blue-300': isDragging,
        },
      )}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <label className={'cursor-pointer'}>
        <p className={'p-5'}>{isDragging ? 'Drop json' : 'Click or drag your json here'}</p>
        <input
          multiple
          accept={'application/json'}
          type={'file'}
          id={'upload'}
          className={'hidden'}
          onChange={onSelectFile}
        />
      </label>
    </div>
  );
};
