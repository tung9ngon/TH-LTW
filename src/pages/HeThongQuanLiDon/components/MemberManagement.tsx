import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, MenuItem, Select, Button
} from '@mui/material';
import { getMembers, saveMembers } from '../utils/storage';
import { exportToXLSX } from '../utils/exportXLSX';

const MemberManagement = () => {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const data = getMembers();
    setMembers(data);
  }, []);

  const handleChangeTeam = (email: string, newTeam: string) => {
    const updated = members.map(mem =>
      mem.email === email ? { ...mem, team: newTeam } : mem
    );
    saveMembers(updated);
    setMembers(updated);
  };

  return (
    <>
      <Button sx={{ mb: 2 }} variant="contained" onClick={() => exportToXLSX(members, 'danh_sach_thanh_vien')}>
        Export XLSX
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Nhóm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map(mem => (
              <TableRow key={mem.email}>
                <TableCell>{mem.name}</TableCell>
                <TableCell>{mem.email}</TableCell>
                <TableCell>{mem.role}</TableCell>
                <TableCell>
                  <Select
                    value={mem.team}
                    onChange={(e) => handleChangeTeam(mem.email, e.target.value)}
                  >
                    {['Team Design', 'Team Dev', 'Team Media'].map(team => (
                      <MenuItem value={team} key={team}>{team}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MemberManagement;
