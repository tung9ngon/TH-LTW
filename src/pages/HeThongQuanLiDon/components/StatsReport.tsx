import React, { useEffect, useState } from 'react';
import { getApplications, getMembers } from '../utils/storage';
import { Typography, Grid, Paper } from '@mui/material';

const StatsReport = () => {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const apps = getApplications();
    const members = getMembers();

    const desireCount = apps.reduce((acc: any, app: any) => {
      acc[app.desire] = (acc[app.desire] || 0) + 1;
      return acc;
    }, {});

    const statusCount = apps.reduce((acc: any, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    const groupCount = members.reduce((acc: any, mem: any) => {
      acc[mem.team] = (acc[mem.team] || 0) + 1;
      return acc;
    }, {});

    setStats({ desireCount, statusCount, groupCount });
  }, []);

  const renderStatBlock = (title: string, data: any) => (
    <Paper sx={{ p: 2, minHeight: 150 }} elevation={2}>
      <Typography variant="h6">{title}</Typography>
      {Object.entries(data).map(([key, value]) => (
        <Typography key={key}>{key}: {value}</Typography>
      ))}
    </Paper>
  );

  return (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12} md={4}>{renderStatBlock("Thống kê nguyện vọng", stats.desireCount || {})}</Grid>
      <Grid item xs={12} md={4}>{renderStatBlock("Tình trạng đơn", stats.statusCount || {})}</Grid>
      <Grid item xs={12} md={4}>{renderStatBlock("Số lượng thành viên theo nhóm", stats.groupCount || {})}</Grid>
    </Grid>
  );
};

export default StatsReport;
