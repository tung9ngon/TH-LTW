import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import Home from '../../pages/webdulich/Home';
import Planner from '../../pages/webdulich/Planner';
import Budget from '../../pages/webdulich/Budget';
import Admin from '../../pages/webdulich/Admin';
import { AppProvider } from '../../components/context/AppContext';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  // State để quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState('home');

  // Hàm để thay đổi trang
  const handleMenuClick = (page: string) => {
    setCurrentPage(page);
  };

  let content;
  switch (currentPage) {
    case 'home':
      content = <Home />;
      break;
    case 'planner':
      content = <Planner />;
      break;
    case 'budget':
      content = <Budget />;
      break;
    case 'admin':
      content = <Admin />;
      break;
    default:
      content = <Home />;
  }

  return (
    <AppProvider>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" onClick={(e) => handleMenuClick(e.key)}>
            <Menu.Item key="home">Khám phá</Menu.Item>
            <Menu.Item key="planner">Lịch trình</Menu.Item>
            <Menu.Item key="budget">Ngân sách</Menu.Item>
            <Menu.Item key="admin">Quản trị</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '20px 50px' }}>
          {content}
        </Content>
        <Footer style={{ textAlign: 'center' }}>Travel Planner ©2025</Footer>
      </Layout>
    </AppProvider>
    
  );
};

export default App;