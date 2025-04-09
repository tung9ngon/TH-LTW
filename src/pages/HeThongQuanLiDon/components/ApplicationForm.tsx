import React, { useState } from 'react';
import {
  TextField, Button, MenuItem, Grid, Snackbar
} from '@mui/material';
import { getApplications, saveApplications } from '../utils/storage';

const ApplicationForm = () => {
  const [form, setForm] = useState({
    name: '', email: '', desire: '', reason: ''
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.desire || !form.reason) return;

    const newApp = {
      ...form,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      logs: [],
    };

    const apps = getApplications();
    saveApplications([...apps, newApp]);
    setOpen(true);
    setForm({ name: '', email: '', desire: '', reason: '' });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField label="Họ tên" fullWidth name="name" value={form.name} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Email" fullWidth name="email" value={form.email} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select fullWidth name="desire" label="Nguyện vọng"
          value={form.desire} onChange={handleChange}
        >
          {['Design', 'Dev', 'Media'].map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Lý do đăng ký" fullWidth multiline rows={4}
          name="reason" value={form.reason} onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleSubmit}>Gửi đăng ký</Button>
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} message="Gửi thành công!" onClose={() => setOpen(false)} />
    </Grid>
  );
};

export default ApplicationForm;
