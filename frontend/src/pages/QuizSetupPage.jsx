import { useEffect, useState } from 'react';
import { isRequestCanceled } from '../services/apiError';
import { fetchCategories } from '../services/quizService';

const LOADING = { status: 'loading', categories: [], error: null };

const QuizSetupPage = () => {
  const [state, setState] = useState(LOADING);

  useEffect(() => {
    const controller = new AbortController();

    fetchCategories({ signal: controller.signal }).then(
      (categories) => setState({ status: 'ready', categories, error: null }),
      (error) => {
        if (!isRequestCanceled(error)) {
          setState({ status: 'error', categories: [], error: error.message });
        }
      },
    );

    return () => controller.abort();
  }, []);

  const { status, categories, error } = state;

  return (
    <div className="page-quiz-setup">
      <title>Quiz · JS-Kurs</title>
      <div className="container">
        <h1 className="setup-title">
          Teste dein <span className="accent">Wissen</span>
        </h1>
        <p className="setup-intro">Wähle Kategorien, Anzahl und Zeitlimit. Die Fragen zieht der Server zufällig.</p>
        {status === 'loading' && <p role="status">Kategorien werden geladen …</p>}
        {status === 'error' && <p role="alert">{error}</p>}
        {status === 'ready' && (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                {category.name} · {category.questionCount} Fragen
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuizSetupPage;
