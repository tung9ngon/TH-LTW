import React from 'react';
import { Container, Typography, Divider } from '@mui/material';
import ApplicationForm from './components/ApplicationForm';
import ApplicationTable from './components/ApplicationTable';
import MemberManagement from './components/MemberManagement';
import StatsReport from './components/StatsReport';

function App() {
  return (
    <Container>
      <Typography variant="h4" mt={4}>Hệ thống quản lý đăng ký CLB</Typography>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">1. Đăng ký tham gia</Typography>
      <ApplicationForm />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6">2. Quản lý đơn đăng ký</Typography>
      <ApplicationTable />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6">3. Quản lý thành viên</Typography>
      <MemberManagement />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6">4. Báo cáo & Thống kê</Typography>
      <StatsReport />
    </Container>
  );
}

export default App;
