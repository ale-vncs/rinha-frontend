import { forwardRef, PropsWithChildren } from 'react';
import { useToggle } from '../hooks/useToggle.ts';
import { ToggleExpandedIcon } from './ToggleExpandedIcon.tsx';

interface ExpandedWrapperProps {
  charWrapper: [string, string];
  node?: string;
}

export const ExpandedWrapper = forwardRef<HTMLDivElement, PropsWithChildren<ExpandedWrapperProps>>(
  ({ charWrapper: [charFirst, charLast], children, node = '' }, ref) => {
    const { isExpanded, toggleExpanded } = useToggle();

    node = node ? `${node}: ` : '';

    return (
      <div ref={ref} className={'flex flex-col flex-nowrap ml-6'}>
        <div className={'flex flex-row flex-nowrap gap-1 items-center'}>
          <ToggleExpandedIcon isExpanded={isExpanded} onToggle={toggleExpanded} />
          <div className={'flex flex-nowrap gap-1'}>
            <p className={'ml-0 text-red-400'}>{node}</p>
            <p className={'text-yellow-400'}>{charFirst}</p>
            {!isExpanded && <p className={'text-yellow-400'}>... {charLast}</p>}
          </div>
        </div>
        <div className={`${!isExpanded && 'hidden'} flex flex-col flex-nowrap`}>
          <div className={'flex flex-nowrap'}>
            <div className={'w-px-1 border-l border-gray-300'} />
            <div>{children}</div>
          </div>
          <p className={'text-yellow-400'}>{charLast}</p>
        </div>
      </div>
    );
  },
);
