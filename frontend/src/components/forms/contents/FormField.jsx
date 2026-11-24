import { FaCircleExclamation } from 'react-icons/fa6';

const FormField = (props) => {
  const { id, label, type = 'text', value, onChange, error, hint, autoComplete, required = false, ref } = props;
  const hintId = hint ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`m-form-field form-field${error ? ' has-error' : ''}`}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={ref}
        className="field-input"
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
      />
      {hint && (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={errorId}>
          <FaCircleExclamation aria-hidden="true" focusable="false" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;
