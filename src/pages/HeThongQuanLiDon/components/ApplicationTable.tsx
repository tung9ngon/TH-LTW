import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, TablePagination, InputBase
} from '@mui/material';
import { getApplications, saveApplications, getMembers, saveMembers } from '../utils/storage';

interface Application {
  name: string;
  email: string;
  desire: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  logs: string[];
  createdAt: string;
}

const ApplicationTable = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filtered, setFiltered] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [note, setNote] = useState('');
  const [actionType, setActionType] = useState<'Approved' | 'Rejected'>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const data = getApplications();
    setApplications(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    const result = applications.filter(app =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.desire.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, applications]);

  const handleAction = () => {
    if (!selected || !actionType) return;

    const updated = applications.map(app => {
      if (app.email === selected.email) {
        const log = `Admin đã ${actionType} lúc ${new Date().toLocaleString()}${note ? ' - Lý do: ' + note : ''}`;
        if (actionType === 'Approved') {
          // Thêm vào thành viên
          const members = getMembers();
          saveMembers([...members, { name: app.name, email: app.email, team: app.desire, role: 'Thành viên' }]);
        }
        return { ...app, status: actionType, logs: [...app.logs, log] };
      }
      return app;
    });

    saveApplications(updated);
    setApplications(updated);
    setFiltered(updated);
    setSelected(null);
    setNote('');
  };

  return (
    <>
      <InputBase
        placeholder="Tìm kiếm theo tên, email, nguyện vọng..."
        fullWidth
        sx={{ mb: 2, border: '1px solid #ccc', borderRadius: 1, px: 2 }}
        onChange={e => setSearch(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nguyện vọng</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * 5, page * 5 + 5).map((app) => (
              <TableRow key={app.email}>
                <TableCell>{app.name}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.desire}</TableCell>
                <TableCell>{app.reason}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell>
                  {app.status === 'Pending' && (
                    <>
                      <Button color="success" onClick={() => {
                        setSelected(app);
                        setActionType('Approved');
                      }}>Duyệt</Button>
                      <Button color="error" onClick={() => {
                        setSelected(app);
                        setActionType('Rejected');
                      }}>Từ chối</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          rowsPerPage={5}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5]}
        />
      </TableContainer>

      {/* Modal confirm duyệt/từ chối */}
      <Dialog open={!!selected} onClose={() => setSelected(null)}>
        <DialogTitle>{actionType === 'Approved' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Ghi chú / Lý do"
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Hủy</Button>
          <Button color={actionType === 'Approved' ? 'success' : 'error'} onClick={handleAction}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplicationTable;
