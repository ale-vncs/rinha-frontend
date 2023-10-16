import { KeyboardEvent } from 'react';

interface ToggleExpandedIconProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const ToggleExpandedIcon = ({ isExpanded, onToggle }: ToggleExpandedIconProps) => {
  const onKeyUp = (e: KeyboardEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (e.code === 'Tab') return;
    const toggleKey = ['Space', 'Enter'];
    if (toggleKey.includes(e.code)) onToggle();
    if (e.code === 'ArrowLeft' && isExpanded) onToggle();
    if (e.code === 'ArrowRight' && !isExpanded) onToggle();
  };

  return (
    <button
      className={'w-5 h-5 text-center border leading-none rounded bg-gray-200 cursor-pointer absolute left-0 text-xs'}
      onKeyUp={onKeyUp}
    >
      {isExpanded ? '-' : '+'}
    </button>
  );
};
