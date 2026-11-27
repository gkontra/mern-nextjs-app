import { ANSWER_COUNT, QUESTION_MESSAGES } from '@mearn/shared/question';

export default function HomePage() {
  return (
    <main className="container-xl py-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">MEARN-Admin</h1>
          <p>{QUESTION_MESSAGES.answers()}</p>
          <button type="button" className="btn btn-primary">Höchstens {ANSWER_COUNT.max} Antworten</button>
        </div>
      </div>
    </main>
  );
}
