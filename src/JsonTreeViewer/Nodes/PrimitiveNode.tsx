interface PrimitiveNodeProps {
  node?: string;
  value: string | number | boolean;
}

export const PrimitiveNode = ({ node, value }: PrimitiveNodeProps) => {
  const colorByType = () => {
    const type = typeof value;
    const color: Record<string, string> = {
      string: 'text-green-600',
      number: 'text-orange-400',
    };

    return color[type] ?? 'text-fuchsia-600';
  };

  const renderValue = () => {
    if (typeof value === 'string' && !value.startsWith('"')) return `"${value}"`;
    if (typeof value === 'number') return value;
    return String(value);
  };

  return (
    <div className={'flex flex-nowrap gap-1 ml-6 whitespace-nowrap'}>
      {node && <p className={'text-left text-red-400'}>{node}: </p>}
      <p className={`text-left ${colorByType()}`}>{renderValue()}</p>
    </div>
  );
};
