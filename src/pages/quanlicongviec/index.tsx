import React, { useState, useEffect } from 'react';
import { TaskProvider } from '../../context/TaskContext';
import { Auth } from './components/Auth';
import { TaskList } from './components/TaskList';
import { Stats } from './components/Stats';
import { loadUser } from '../../utils/storage';
import 'antd/dist/antd.css';
import { Button } from 'antd';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = loadUser();
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null); // sẽ quay lại Auth vì user = null
  };
  

  return (
    <TaskProvider>
      <div style={{ padding: 20 }}>
        {user ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Xin chào, {user}!</h2>
              <Button danger onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
            <TaskList currentUser={user} />
            <Stats />
          </>
        ) : (
          <Auth onLogin={setUser} />
        )}
      </div>
    </TaskProvider>
  );
};

export default App;