import React from 'react';
import classnames from 'classnames';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  className?: string;
  label?: string | React.ReactElement;
  indeterminate?: boolean;
}

function Checkbox(
  { className = '', label, indeterminate, onChange, ...inputProps }: Props,
  ref?: React.Ref<HTMLInputElement>
): JSX.Element {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <label className={classnames('checkbox flex items-center', className)}>
      <input
        {...inputProps}
        ref={resolvedRef}
        type="checkbox"
        onChange={onChange}
        readOnly={!onChange}
        className={classnames('checkbox__input', {
          'checkbox__input--indeterminate': indeterminate,
        })}
      />
      {label ? (<span className="checkbox__label text-caption ml-8">{label}</span>) : null}
    </label>
  );
}

export default React.forwardRef<HTMLInputElement, Props>(Checkbox);
