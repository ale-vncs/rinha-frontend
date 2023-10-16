import { useState } from 'react';

export const useToggle = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((value) => !value);
  };

  return {
    isExpanded,
    toggleExpanded,
  };
};
