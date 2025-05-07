import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { saveUser } from '../../../utils/storage';

interface Props {
  onLogin: (username: string) => void;
}

export const Auth: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (!username.trim()) return;
    saveUser(username);
    onLogin(username);
  };

  return (
    <div>
      <Input
        placeholder="Tên người dùng"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: 200 }}
      />
      <Button onClick={handleLogin} type="primary" style={{ marginLeft: 8 }}>
        Đăng nhập
      </Button>
    </div>
  );
};