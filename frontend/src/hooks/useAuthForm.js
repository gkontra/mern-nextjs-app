import { useEffect, useRef, useState } from 'react';

export const useAuthForm = (options) => {
  const { initialValues, validate, onSubmit, fieldForErrorCode = {} } = options;
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const fieldRefs = useRef({});
  const alertRef = useRef(null);
  const fieldNames = Object.keys(initialValues);

  useEffect(() => {
    if (formError) {
      alertRef.current?.focus();
    }
  }, [formError]);

  const focusFirstInvalid = (fieldErrors) => {
    const firstInvalid = fieldNames.find((name) => fieldErrors[name]);
    fieldRefs.current[firstInvalid]?.focus();
  };

  const field = (name) => ({
    id: name,
    value: values[name],
    error: errors[name],
    ref: (node) => {
      fieldRefs.current[name] = node;
    },
    onChange: (event) => {
      const nextValues = { ...values, [name]: event.target.value };
      setValues(nextValues);
      if (wasSubmitted) {
        setErrors(validate(nextValues));
      }
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setWasSubmitted(true);
    setFormError(null);

    const clientErrors = validate(values);
    setErrors(clientErrors);

    if (Object.keys(clientErrors).length > 0) {
      focusFirstInvalid(clientErrors);
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      const codeField = fieldForErrorCode[error.code];
      const serverErrors = error.fields ?? (codeField ? { [codeField]: error.message } : null);

      if (serverErrors) {
        setErrors(serverErrors);
        focusFirstInvalid(serverErrors);
        return;
      }

      setFormError(error.message);
    }
  };

  return { field, handleSubmit, formError, alertRef };
};

export default useAuthForm;
