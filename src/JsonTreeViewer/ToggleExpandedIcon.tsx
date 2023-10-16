interface ToggleExpandedIconProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const ToggleExpandedIcon = ({ isExpanded, onToggle }: ToggleExpandedIconProps) => {
  return (
    <span
      className={'w-5 h-5 text-center border leading-none rounded bg-gray-200 cursor-pointer absolute left-0'}
      onClick={onToggle}
    >
      {isExpanded ? '-' : '+'}
    </span>
  );
};
