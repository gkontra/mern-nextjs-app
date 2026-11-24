import { FaCircleExclamation } from 'react-icons/fa6';

const AuthForm = (props) => {
  const {
    title,
    accent,
    intro,
    onSubmit,
    formError,
    alertRef,
    isSubmitting,
    submitLabel,
    submittingLabel,
    footer,
    children,
  } = props;

  return (
    <div className="m-auth-form auth-form">
      <h1 className="auth-title" id="auth-title">
        {title} <span className="accent">{accent}</span>
      </h1>
      {intro && <p className="auth-intro">{intro}</p>}
      {formError && (
        <div className="auth-alert" role="alert" tabIndex={-1} ref={alertRef}>
          <FaCircleExclamation aria-hidden="true" focusable="false" />
          <p>{formError}</p>
        </div>
      )}
      <form className="auth-fields" onSubmit={onSubmit} noValidate aria-labelledby="auth-title">
        {children}
        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </form>
      {footer && <div className="auth-footer">{footer}</div>}
    </div>
  );
};

export default AuthForm;
