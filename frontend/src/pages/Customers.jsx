import React, { useState } from "react";
import CustomerList from "../components/CustomerList";
import CustomerForm from "../components/CustomerForm";
import { FormControl, InputLabel, Select, MenuItem, Box, Container, Button, Paper, Grid } from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ListAltIcon from '@mui/icons-material/ListAlt';

const Customers = () => {
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState('ekle');

  const handleSuccess = () => setRefresh((r) => !r);

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)',
      py: { xs: 2, sm: 6 },
    }}>
      <Paper elevation={8} sx={{
        display: 'flex',
        width: { xs: '100%', sm: 800, md: 1100 },
        borderRadius: 5,
        overflow: 'auto',
        maxHeight: '90vh',
        boxShadow: 12,
        background: 'linear-gradient(120deg, #f8fafc 0%, #e0eafc 100%)',
        my: 6,
      }}>
        {/* Sidebar */}
        <Box sx={{
          width: { xs: 100, sm: 220 },
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 5,
          gap: 3,
        }}>
          <Button
            startIcon={<PersonAddAlt1Icon />}
            variant="contained"
            sx={{
              width: '90%',
              height: 56,
              mb: 2,
              background: page === 'ekle' ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)' : 'linear-gradient(90deg, #64b5f6 0%, #bbdefb 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 3,
              boxShadow: page === 'ekle' ? 4 : 1,
              border: page === 'ekle' ? '2px solid #1976d2' : '2px solid #90caf9',
              '&:hover': { background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)', color: '#fff' }
            }}
            onClick={() => setPage('ekle')}
          >
            Müşteri Ekle
          </Button>
          <Button
            startIcon={<ListAltIcon />}
            variant="contained"
            sx={{
              width: '90%',
              height: 56,
              background: page === 'liste' ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)' : 'linear-gradient(90deg, #64b5f6 0%, #bbdefb 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 3,
              boxShadow: page === 'liste' ? 4 : 1,
              border: page === 'liste' ? '2px solid #1976d2' : '2px solid #90caf9',
              '&:hover': { background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)', color: '#fff' }
            }}
            onClick={() => setPage('liste')}
          >
            Müşteri Listesi
          </Button>
        </Box>
        {/* İçerik */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 5 },
        }}>
          {page === 'ekle' && <CustomerForm onSuccess={handleSuccess} />}
          {page === 'liste' && <CustomerList refresh={refresh} />}
        </Box>
      </Paper>
    </Box>
  );
};

export default Customers; 