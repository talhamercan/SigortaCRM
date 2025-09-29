import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import {
  TextField, Button, Paper, Typography, Stack, Alert, Box
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    login(form)
      .then((res) => {
        if (rememberMe) {
          localStorage.setItem("token", res.data.token);
        } else {
          sessionStorage.setItem("token", res.data.token);
        }
        onLogin && onLogin();
        navigate("/"); // Giriş başarılıysa ana sayfaya yönlendir
      })
      .catch(() => setError("Giriş başarısız! Lütfen bilgilerinizi kontrol edin."));
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #e0eafc 0%, #c3cfe2 100%)',
      py: { xs: 2, sm: 6 },
    }}>
      <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", boxShadow: 6, borderRadius: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 700, color: '#2d3a4b' }}>
          <LockIcon sx={{ verticalAlign: "middle", mr: 1, color: '#1976d2' }} />
          Kullanıcı Girişi
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              name="username"
              label="Kullanıcı Adı"
              value={form.username}
              onChange={handleChange}
              required
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
            />
            <TextField
              name="password"
              label="Şifre"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 15 }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Beni Hatırla
              </label>
            </Stack>
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ borderRadius: 2, fontWeight: 600, fontSize: 16 }}>
              Giriş Yap
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 