import { useEffect, useMemo, useState } from 'react';

type Character = {
  id: number;
  slot: 1 | 2 | 3;
  firstName: string;
  lastName: string;
  level: number;
  cash: number;
  bank: number;
};

declare global {
  interface Window {
    mp?: { trigger: (event: string, ...args: unknown[]) => void };
    veloriaAuthResult?: (success: boolean, message: string) => void;
    veloriaCharacterList?: (json: string) => void;
  }
}

function trigger(event: string, ...args: unknown[]) {
  window.mp?.trigger(event, ...args);
}

export function App() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [characters, setCharacters] = useState<Character[] | null>(null);

  useEffect(() => {
    window.veloriaAuthResult = (success, text) => {
      setMessage(text);
      if (success) setMessage('');
    };

    window.veloriaCharacterList = (json) => {
      try {
        setCharacters(JSON.parse(json) as Character[]);
      } catch {
        setMessage('Не удалось загрузить персонажей');
      }
    };

    return () => {
      delete window.veloriaAuthResult;
      delete window.veloriaCharacterList;
    };
  }, []);

  const slots = useMemo(() => [1, 2, 3].map((slot) => characters?.find((character) => character.slot === slot)), [characters]);

  if (characters) {
    return (
      <main className="screen">
        <section className="panel character-panel">
          <header className="brand">
            <div className="brand-mark">V</div>
            <div>
              <h1>VELORIA RP</h1>
              <p>Выбор персонажа</p>
            </div>
          </header>

          <div className="character-grid">
            {slots.map((character, index) => (
              <button
                key={index}
                className={`character-card ${character ? 'filled' : 'empty'}`}
                onClick={() => {
                  if (character) trigger('veloria:cef:character:select', character.id);
                  else setMessage(`Создание персонажа в слоте ${index + 1} подключим следующим модулем`);
                }}
              >
                {character ? (
                  <>
                    <span className="slot-label">Слот {index + 1}</span>
                    <strong>{character.firstName} {character.lastName}</strong>
                    <span>Уровень {character.level}</span>
                    <span>${character.cash.toLocaleString('ru-RU')}</span>
                  </>
                ) : (
                  <>
                    <span className="plus">+</span>
                    <strong>Создать персонажа</strong>
                    <span>Слот {index + 1}</span>
                  </>
                )}
              </button>
            ))}
          </div>

          {message && <div className="message">{message}</div>}
        </section>
      </main>
    );
  }

  return (
    <main className="screen">
      <section className="panel auth-panel">
        <header className="brand">
          <div className="brand-mark">V</div>
          <div>
            <h1>VELORIA RP</h1>
            <p>500 слотов · Los Santos</p>
          </div>
        </header>

        <div className="mode-switch">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Вход</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Регистрация</button>
        </div>

        <label>
          Логин
          <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="off" />
        </label>

        <label>
          Пароль
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>

        {message && <div className="message">{message}</div>}

        <button
          className="primary"
          onClick={() => trigger(mode === 'login' ? 'veloria:cef:login' : 'veloria:cef:register', username, password)}
        >
          {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
        </button>
      </section>
    </main>
  );
}
