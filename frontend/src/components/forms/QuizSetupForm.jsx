import { useEffect, useRef, useState } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import {
  DEFAULT_QUESTION_COUNT,
  DEFAULT_TIME_LIMIT_SEC,
  QUESTION_COUNT,
  TIME_LIMITS_SEC,
  formatQuestionCount,
  maxQuestionCount,
  validateQuizSetup,
} from '../../lib/quizRules';
import FormField from './contents/FormField';

const FIELD_ORDER = ['categoryIds', 'questionCount', 'timeLimitSec'];

const FieldError = (props) => {
  const { id, children } = props;

  return (
    <p className="field-error" id={id}>
      <FaCircleExclamation aria-hidden="true" focusable="false" />
      <span>{children}</span>
    </p>
  );
};

const countHint = (available) => {
  if (available === 0) {
    return 'Wähle zuerst mindestens eine Kategorie.';
  }
  if (available > QUESTION_COUNT.max) {
    return `von ${available} verfügbaren, höchstens ${QUESTION_COUNT.max}`;
  }
  return `von ${available} verfügbaren`;
};

const focusTarget = (node) =>
  node?.matches('input') ? node : (node?.querySelector('input:checked') ?? node?.querySelector('input:not(:disabled)'));

const QuizSetupForm = (props) => {
  const { categories, onStart } = props;
  const [categoryIds, setCategoryIds] = useState([]);
  const [questionCount, setQuestionCount] = useState(String(DEFAULT_QUESTION_COUNT));
  const [timeLimitSec, setTimeLimitSec] = useState(DEFAULT_TIME_LIMIT_SEC);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldRefs = useRef({});
  const alertRef = useRef(null);

  useEffect(() => {
    if (formError) {
      alertRef.current?.focus();
    }
  }, [formError]);

  const toValues = (next = {}) => {
    const ids = next.categoryIds ?? categoryIds;
    const available = categories
      .filter(({ id }) => ids.includes(id))
      .reduce((sum, category) => sum + category.questionCount, 0);

    return {
      categoryIds: ids,
      questionCount: Number(next.questionCount ?? questionCount),
      timeLimitSec: next.timeLimitSec ?? timeLimitSec,
      available,
    };
  };

  const values = toValues();

  const revalidate = (next) => {
    if (wasSubmitted) {
      setErrors(validateQuizSetup(toValues(next)));
    }
  };

  const fieldRef = (name) => (node) => {
    fieldRefs.current[name] = node;
  };

  const focusFirstInvalid = (fieldErrors) => {
    const firstInvalid = FIELD_ORDER.find((name) => fieldErrors[name]);
    focusTarget(fieldRefs.current[firstInvalid])?.focus();
  };

  const toggleCategory = (id) => {
    const next = categoryIds.includes(id) ? categoryIds.filter((selected) => selected !== id) : [...categoryIds, id];
    setCategoryIds(next);
    revalidate({ categoryIds: next });
  };

  const changeQuestionCount = (event) => {
    setQuestionCount(event.target.value);
    revalidate({ questionCount: event.target.value });
  };

  const changeTimeLimit = (sec) => {
    setTimeLimitSec(sec);
    revalidate({ timeLimitSec: sec });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setWasSubmitted(true);
    setFormError(null);

    const clientErrors = validateQuizSetup(values);
    setErrors(clientErrors);

    if (Object.keys(clientErrors).length > 0) {
      focusFirstInvalid(clientErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onStart({ categoryIds, questionCount: values.questionCount, timeLimitSec });
    } catch (error) {
      setIsSubmitting(false);

      if (FIELD_ORDER.some((name) => error.fields?.[name])) {
        setErrors(error.fields);
        focusFirstInvalid(error.fields);
        return;
      }

      setFormError(error.message);
    }
  };

  return (
    <form
      className="m-quiz-setup-form quiz-setup-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Test zusammenstellen">
      {formError && (
        <div className="setup-alert" role="alert" tabIndex={-1} ref={alertRef}>
          <FaCircleExclamation aria-hidden="true" focusable="false" />
          <p>{formError}</p>
        </div>
      )}
      <fieldset
        className={`setup-group${errors.categoryIds ? ' has-error' : ''}`}
        ref={fieldRef('categoryIds')}
        aria-describedby={errors.categoryIds ? 'categoryIds-error' : undefined}>
        <legend className="group-legend">Kategorien</legend>
        <ul className="category-list">
          {categories.map((category) => {
            const isEmpty = category.questionCount === 0;

            return (
              <li key={category.id}>
                <label className="option">
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={category.id}
                    checked={categoryIds.includes(category.id)}
                    disabled={isEmpty}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <span className="option-name">{category.name}</span>
                  <span className="option-meta">
                    {isEmpty ? 'noch keine Fragen' : formatQuestionCount(category.questionCount)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        {errors.categoryIds && <FieldError id="categoryIds-error">{errors.categoryIds}</FieldError>}
      </fieldset>
      <FormField
        id="questionCount"
        label="Anzahl der Fragen"
        type="number"
        value={questionCount}
        onChange={changeQuestionCount}
        min={QUESTION_COUNT.min}
        max={values.available > 0 ? maxQuestionCount(values.available) : QUESTION_COUNT.max}
        hint={countHint(values.available)}
        error={errors.questionCount}
        ref={fieldRef('questionCount')}
        required
      />
      <fieldset
        className={`setup-group${errors.timeLimitSec ? ' has-error' : ''}`}
        ref={fieldRef('timeLimitSec')}
        aria-describedby={errors.timeLimitSec ? 'timeLimitSec-error' : undefined}>
        <legend className="group-legend">Zeitlimit</legend>
        <div className="time-list">
          {TIME_LIMITS_SEC.map((sec) => (
            <label className="option" key={sec}>
              <input
                type="radio"
                name="timeLimitSec"
                value={sec}
                checked={timeLimitSec === sec}
                onChange={() => changeTimeLimit(sec)}
              />
              <span className="option-name">{sec / 60} Minuten</span>
            </label>
          ))}
        </div>
        {errors.timeLimitSec && <FieldError id="timeLimitSec-error">{errors.timeLimitSec}</FieldError>}
      </fieldset>
      <button className="setup-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Test wird gestartet …' : 'Test starten'}
      </button>
    </form>
  );
};

export default QuizSetupForm;
