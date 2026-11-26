import { useEffect, useReducer, useState } from 'react';
import { createSaveQueue } from '../lib/saveQueue';
import { API_ERROR_CODE, isRequestCanceled } from '../services/apiError';
import { fetchAttempt, saveAnswers, submitAttempt } from '../services/quizService';
import { QUIZ_ACTION, QUIZ_STATUS, createInitialState, quizAttemptReducer } from './quizAttemptReducer';

const toAnswerList = (answers) =>
  Object.entries(answers).map(([questionId, selectedAnswerIds]) => ({ questionId, selectedAnswerIds }));

const toggle = (current, answerId) =>
  current.includes(answerId) ? current.filter((id) => id !== answerId) : [...current, answerId];

export const useQuizAttempt = (attemptId) => {
  const [state, dispatch] = useReducer(quizAttemptReducer, undefined, createInitialState);
  const [saveQueue] = useState(createSaveQueue);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: QUIZ_ACTION.LOAD_REQUEST });

    fetchAttempt(attemptId, { signal: controller.signal }).then(
      (attempt) =>
        dispatch({
          type: QUIZ_ACTION.LOAD_SUCCESS, //
          payload: attempt,
          receivedAt: Date.now(),
        }),
      (error) => {
        if (!isRequestCanceled(error)) {
          dispatch({ type: QUIZ_ACTION.LOAD_FAILURE, payload: error.message });
        }
      },
    );

    return () => controller.abort();
  }, [attemptId, loadCount]);

  const select = (question, answerId) => {
    if (state.status !== QUIZ_STATUS.READY) {
      return;
    }

    const questionId = question.id;
    const selectedAnswerIds = toggle(state.answers[questionId] ?? [], answerId);

    dispatch({ type: QUIZ_ACTION.SELECT, payload: { questionId, selectedAnswerIds } });
    saveQueue.push(`${attemptId}:${questionId}`, () =>
      saveAnswers(attemptId, [{ questionId, selectedAnswerIds }]).then(
        () => dispatch({ type: QUIZ_ACTION.SAVE_SUCCESS, payload: questionId }),
        () => dispatch({ type: QUIZ_ACTION.SAVE_FAILURE, payload: questionId }),
      ),
    );
  };

  const submit = async () => {
    if (state.status !== QUIZ_STATUS.READY) {
      return;
    }

    dispatch({ type: QUIZ_ACTION.SUBMIT_REQUEST });

    try {
      await submitAttempt(attemptId, toAnswerList(state.answers));
      dispatch({ type: QUIZ_ACTION.SUBMIT_SUCCESS });
    } catch (error) {
      if (error.code === API_ERROR_CODE.ATTEMPT_CLOSED) {
        dispatch({ type: QUIZ_ACTION.SUBMIT_SUCCESS });
        return;
      }
      dispatch({ type: QUIZ_ACTION.SUBMIT_FAILURE, payload: error.message });
    }
  };

  const reload = () => setLoadCount((count) => count + 1);

  return { ...state, select, submit, reload };
};

export default useQuizAttempt;
