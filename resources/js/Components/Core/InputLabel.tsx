import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
  value,
  className = '',
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
  return (
    <label {...props} className={` ` + className}>
      <span className="label">{value ? value : children}</span>
    </label>
  );
}
