import React, { useEffect, useState } from "react";
import { getCustomers } from "../api/api";
import { deleteCustomer } from "../api/api";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const CustomerList = ({ refresh }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers()
      .then((res) => setCustomers(res.data))
      .catch(() => alert("Müşteriler alınamadı!"));
  }, [refresh]);

  return (
    <Paper sx={{
      p: { xs: 1, sm: 2 },
      mt: 3,
      boxShadow: 8,
      borderRadius: 3,
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      border: '1px solid #e3e8ee',
      maxWidth: 700,
      mx: 'auto',
      overflow: 'hidden',
    }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 700, color: '#1976d2', letterSpacing: 0.5, fontSize: 24 }}>
        <PersonIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 24, color: '#1976d2' }} />
        Müşteri Listesi
      </Typography>
      <Typography align="center" sx={{ color: '#607d8b', mb: 1, fontSize: 13 }}>
        Sistemde kayıtlı tüm müşteriler aşağıda listelenmektedir.
      </Typography>
      <TableContainer sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: 'rgba(25, 118, 210, 0.08)' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 15, color: '#1976d2', py: 1 }}>Ad Soyad</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 15, color: '#1976d2', py: 1 }}>E-posta</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 15, color: '#1976d2', py: 1 }}>Telefon</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 15, color: '#1976d2', py: 1 }}>Sigorta Türleri</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 15, color: '#1976d2', py: 1 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c, i) => (
              <TableRow key={c.id} sx={{
                transition: 'background 0.2s',
                borderBottom: '1px solid #e3e8ee',
                background: i % 2 === 0 ? '#f8fafc' : '#e0eafc',
                '&:hover': { background: '#f0f7ff' }
              }}>
                <TableCell sx={{ fontSize: 14, py: 0.7 }}>{c.firstName} {c.lastName}</TableCell>
                <TableCell sx={{ fontSize: 14, py: 0.7 }}>{c.contactInfo?.email}</TableCell>
                <TableCell sx={{ fontSize: 14, py: 0.7 }}>{c.contactInfo?.phone}</TableCell>
                <TableCell sx={{ fontSize: 14, py: 0.7 }}>
                  {Array.isArray(c.contracts) && c.contracts.length > 0
                    ? c.contracts.map(contract => contract.type || contract.Type).filter(Boolean).join(', ')
                    : '-'}
                </TableCell>
                <TableCell sx={{ fontSize: 14, py: 0.7 }}>
                  <button
                    style={{
                      background: '#fff',
                      border: '1px solid #e57373',
                      color: '#e53935',
                      borderRadius: 6,
                      padding: '2px 8px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                    onClick={async () => {
                      if(window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
                        try {
                          await deleteCustomer(c.id);
                          setCustomers(customers.filter(x => x.id !== c.id));
                        } catch {
                          alert('Silme işlemi başarısız!');
                        }
                      }
                    }}
                  >Sil</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomerList; 