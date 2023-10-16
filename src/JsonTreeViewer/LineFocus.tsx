import { PropsWithChildren, useEffect, useRef } from 'react';

export const LineFocus = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null);
  const lineFocusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.onmouseover = () => {
      if (!lineFocusRef.current) return;
      lineFocusRef.current.className = 'absolute left-0 bg-gray-200/70 w-full h-6';
      return;
    };

    ref.current.onmouseleave = () => {
      if (!lineFocusRef.current) return;
      lineFocusRef.current.className = 'absolute left-0 hover:bg-gray-200/70 w-full h-6';
    };
  }, []);

  return (
    <div ref={ref} className={'z-20'}>
      <div ref={lineFocusRef}></div>
      {children}
    </div>
  );
};
