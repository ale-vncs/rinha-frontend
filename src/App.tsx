import { UploadContainer } from './BoxUpload/UploadContainer.tsx';
import { JsonTreeViewer } from './JsonTreeViewer';
import { JsonList } from './JsonList';

export const App = () => {
  return (
    <div className={'flex w-screen h-screen bg-gray-50 justify-center items-center flex-col'}>
      <UploadContainer />
      <div className={'w-full px-2 flex flex-nowrap mt-3 overflow-auto py-3'}>
        <JsonList />
        <JsonTreeViewer />
      </div>
    </div>
  );
};
