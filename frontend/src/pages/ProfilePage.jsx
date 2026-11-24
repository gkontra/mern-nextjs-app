import { Link, useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from '../lib/roles';
import { useAuth } from '../stores/auth';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  return (
    <div className="page-profile">
      <title>Profil · JS-Kurs</title>
      <div className="container">
        <h1 className="profile-title">
          Hallo, <span className="accent">{user.name}</span>
        </h1>
        <dl className="profile-details">
          <div>
            <dt>E-Mail</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Rolle</dt>
            <dd>{ROLE_LABELS[user.role] ?? user.role}</dd>
          </div>
        </dl>
        <button className="profile-logout" type="button" onClick={handleLogout}>
          Logout
        </button>
        <section className="profile-history" aria-labelledby="history-title">
          <h2 className="history-title" id="history-title">
            Testverlauf
          </h2>
          <p>Hier erscheinen bald deine abgeschlossenen Tests.</p>
          <Link to="/#modules">Zu den Modulen</Link>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
