import { useState } from 'react';
import Modal from './Modal.jsx';
import LoginForm from './LoginForm.jsx';
import RegistrationForm from './RegistrationForm.jsx';

const HomePage = () => {
	// Stan może przyjąć wartości: null, 'login', 'register'
  const [modalOpen, setModalOpen] = useState(null);

  const closeModal = () => setModalOpen(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Witaj na Stronie Głównej</h1>
      <p>Proszę się zalogować lub zarejestrować.</p>
      
      <button onClick={() => setModalOpen('login')}>
        Logowanie
      </button>
      
      <button onClick={() => setModalOpen('register')} style={{ marginLeft: '10px' }}>
        Rejestracja
      </button>

      {/* Modal Logowania */}
      <Modal 
        isOpen={modalOpen === 'login'} 
        onClose={closeModal} 
        title="Zaloguj się"
      >
        <LoginForm />
      </Modal>

      {/* Modal Rejestracji */}
      <Modal 
        isOpen={modalOpen === 'register'} 
        onClose={closeModal} 
        title="Utwórz konto"
      >
        <RegistrationForm />
      </Modal>
    </div>
  );
}

export default HomePage
