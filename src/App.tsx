import { UploadContainer } from './BoxUpload/UploadContainer.tsx';
import { JsonTreeViewer } from './JsonTreeViewer';

export const App = () => {
  return (
    <div className={'flex w-screen h-screen bg-gray-50 justify-center items-center flex-col'}>
      <UploadContainer />
      <JsonTreeViewer />
    </div>
  );
};
