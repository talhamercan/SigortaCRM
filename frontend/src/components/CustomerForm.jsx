import React, { useState, useEffect } from "react";
import { addCustomer, getCustomers } from "../api/api";
import {
  TextField, Button, Paper, Typography, Stack, MenuItem, Select, InputLabel, FormControl, Grid
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import dayjs from "dayjs";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BadgeIcon from '@mui/icons-material/Badge';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const medeniDurumlar = ["Bekar", "Evli", "Boşanmış", "Dul"];
const sigortaTurleri = ["BES", "Ferdi Kaza", "Hayat", "Sağlık"];
const odemeTipleri = ["Aylık", "Yıllık"];
const odemeDurumlari = ["Ödendi", "Beklemede", "Gecikmiş"];
const iller = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];
const ilceler = {
  İstanbul: ["Kadıköy", "Beşiktaş", "Üsküdar"],
  Ankara: ["Çankaya", "Keçiören", "Yenimahalle"],
  İzmir: ["Konak", "Bornova", "Karşıyaka"],
  Bursa: ["Osmangazi", "Nilüfer", "Yıldırım"],
  Antalya: ["Muratpaşa", "Kepez", "Konyaaltı"]
};

const contractTypes = [
  { value: "BES", label: "BES" },
  { value: "FerdiKaza", label: "Ferdi Kaza" },
  { value: "Hayat", label: "Hayat" },
  { value: "Saglik", label: "Sağlık" }
];

// Validasyon fonksiyonları
function isValidTCKN(tc) {
  if (!/^[1-9][0-9]{10}$/.test(tc)) return false;
  const digits = tc.split('').map(Number);
  const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const sumEven = digits[1] + digits[3] + digits[5] + digits[7];
  const digit10 = ((sumOdd * 7) - sumEven) % 10;
  const digit11 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;
  return digits[9] === digit10 && digits[10] === digit11;
}

function isValidEmail(email) {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '').replace(/^0/, '');
  return /^5[0-9]{9}$/.test(digits);
}

const CustomerForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    birthDate: null,
    tc: "",
    il: "",
    ilce: "",
    medeniDurum: "",
    sigortaTuru: "",
    odemeTipi: "",
    odemeDurumu: "",
    phone: "",
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [contracts, setContracts] = useState([
    { type: "", startDate: null, endDate: null }
  ]);
  const [contractErrors, setContractErrors] = useState([]);

  useEffect(() => {
    getCustomers()
      .then((res) => setCustomers(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "il") setForm(f => ({ ...f, ilce: "" }));
  };

  const handleDateChange = (date) => {
    setForm({ ...form, birthDate: date });
  };

  const handleContractChange = (idx, field, value) => {
    setContracts(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };
  const handleAddContract = () => {
    setContracts(prev => [...prev, { type: "", startDate: null, endDate: null }]);
  };
  const handleRemoveContract = (idx) => {
    setContracts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let newContractErrors = [];
    if (!isValidTCKN(form.tc)) newErrors.tc = "Geçerli bir TC Kimlik No giriniz.";
    if (!isValidEmail(form.email)) newErrors.email = "Geçerli bir e-posta giriniz.";
    if (!isValidPhone(form.phone)) newErrors.phone = "Geçerli bir telefon numarası giriniz (5xx xxx xx xx).";
    // En güncel müşteri listesini çek
    let latestCustomers = customers;
    try {
      const res = await getCustomers();
      latestCustomers = res.data;
    } catch {}
    // E-posta, telefon ve TC'nin benzersizliğini kontrol et
    const emailExists = latestCustomers.some(c => c.contactInfo?.email === form.email);
    const phoneExists = latestCustomers.some(c => c.contactInfo?.phone === form.phone);
    const tcExists = latestCustomers.some(c => c.tckn === form.tc || c.TCKN === form.tc);
    if (emailExists) newErrors.email = "Bu e-posta ile daha önce kayıt yapılmış.";
    if (phoneExists) newErrors.phone = "Bu telefon numarası ile daha önce kayıt yapılmış.";
    if (tcExists) newErrors.tc = "Bu TC Kimlik No ile daha önce kayıt yapılmış.";
    // Contracts validasyonu
    newContractErrors = contracts.map(c => {
      const err = {};
      if (!c.type) err.type = true;
      if (!c.startDate) err.startDate = true;
      if (!c.endDate) err.endDate = true;
      return err;
    });
    const hasContractError = newContractErrors.some(e => Object.keys(e).length > 0);
    setContractErrors(newContractErrors);
    if (Object.keys(newErrors).length > 0 || hasContractError) {
      if (hasContractError) alert("Tüm sigorta sözleşmesi alanlarını doldurunuz.");
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setContractErrors([]);
    // Ad ve soyadı ayır
    const [FirstName, ...lastParts] = form.name.trim().split(" ");
    const LastName = lastParts.join(" ");

    // ContactInfo objesi oluştur
    const ContactInfo = {
      Phone: form.phone,
      Email: form.email,
      Address: `${form.il} / ${form.ilce} - ${form.medeniDurum}`
    };

    // Backend'in beklediği veri
    const data = {
      FirstName,
      LastName,
      TCKN: form.tc,
      ContactInfo,
      Contracts: contracts.map(c => ({
        Type: c.type,
        StartDate: c.startDate ? c.startDate.format("YYYY-MM-DD") : null,
        EndDate: c.endDate ? c.endDate.format("YYYY-MM-DD") : null
      }))
    };

    addCustomer(data)
      .then(() => {
        alert("Müşteri eklendi!");
        setForm({
          name: "",
          birthDate: null,
          tc: "",
          il: "",
          ilce: "",
          medeniDurum: "",
          sigortaTuru: "",
          odemeTipi: "",
          odemeDurumu: "",
          phone: "",
          email: ""
        });
        onSuccess && onSuccess();
      })
      .catch(() => alert("Ekleme başarısız!"));
  };

  return (
    <Paper sx={{
      p: { xs: 1, sm: 2 },
      maxWidth: 900,
      mx: 'auto',
      mt: 3,
      boxShadow: 8,
      borderRadius: 3,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)',
      border: '1px solid #e3e8ee',
      position: 'relative',
      overflow: 'visible',
      '::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'url(https://www.transparenttextures.com/patterns/cubes.png)',
        opacity: 0.04,
        zIndex: 0
      }
    }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 700, color: '#1976d2', letterSpacing: 0.5, fontSize: 24 }}>
        <PersonAddAlt1Icon sx={{ verticalAlign: "middle", mr: 1, fontSize: 24 }} />
        Müşteri Kaydı
      </Typography>
      <Typography align="center" sx={{ color: '#607d8b', mb: 1, fontSize: 13 }}>
        Yeni müşteri bilgilerini eksiksiz ve doğru giriniz.
      </Typography>
      <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <TextField name="name" label="Ad Soyad" value={form.name} onChange={handleChange} required fullWidth size="small"
                InputProps={{ startAdornment: <BadgeIcon sx={{ mr: 1, color: '#1976d2' }} /> }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Doğum Tarihi"
                  value={form.birthDate}
                  onChange={handleDateChange}
                  format="DD.MM.YYYY"
                  slotProps={{ textField: { fullWidth: true, required: true, size: 'small' } }}
                />
              </LocalizationProvider>
              <TextField name="tc" label="TC Kimlik No" value={form.tc} onChange={handleChange} required fullWidth size="small"
                error={!!errors.tc} helperText={errors.tc}
                InputProps={{ startAdornment: <BadgeIcon sx={{ mr: 1, color: '#1976d2' }} /> }}
              />
              <FormControl fullWidth required size="small">
                <InputLabel>İl</InputLabel>
                <Select name="il" value={form.il} label="İl" onChange={handleChange} size="small">
                  {iller.map((il) => (
                    <MenuItem key={il} value={il}>{il}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required size="small">
                <InputLabel>İlçe</InputLabel>
                <Select name="ilce" value={form.ilce} label="İlçe" onChange={handleChange} disabled={!form.il} size="small">
                  {(ilceler[form.il] || []).map((ilce) => (
                    <MenuItem key={ilce} value={ilce}>{ilce}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required size="small">
                <InputLabel>Medeni Durum</InputLabel>
                <Select name="medeniDurum" value={form.medeniDurum} label="Medeni Durum" onChange={handleChange} size="small">
                  {medeniDurumlar.map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required size="small">
                <InputLabel>Sigorta Türü</InputLabel>
                <Select name="sigortaTuru" value={form.sigortaTuru} label="Sigorta Türü" onChange={handleChange} size="small">
                  {sigortaTurleri.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required size="small">
                <InputLabel>Ödeme Tipi</InputLabel>
                <Select name="odemeTipi" value={form.odemeTipi} label="Ödeme Tipi" onChange={handleChange} size="small">
                  {odemeTipleri.map((o) => (
                    <MenuItem key={o} value={o}>{o}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required size="small">
                <InputLabel>Ödeme Durumu</InputLabel>
                <Select name="odemeDurumu" value={form.odemeDurumu} label="Ödeme Durumu" onChange={handleChange} size="small">
                  {odemeDurumlari.map((o) => (
                    <MenuItem key={o} value={o}>{o}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField name="phone" label="Telefon" value={form.phone} onChange={handleChange} required fullWidth size="small"
                error={!!errors.phone} helperText={errors.phone}
                InputProps={{ startAdornment: <PhoneIphoneIcon sx={{ mr: 1, color: '#1976d2' }} /> }}
              />
              <TextField name="email" label="E-posta" value={form.email} onChange={handleChange} required fullWidth size="small"
                error={!!errors.email} helperText={errors.email}
                InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: '#1976d2' }} /> }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 600, color: '#1976d2', mt: { xs: 2, md: 0 }, mb: 1, fontSize: 16 }}>Sigorta Sözleşmeleri</Typography>
            {contracts.map((c, idx) => (
              <Paper key={idx} elevation={2} sx={{ p: 1.2, mb: 1.2, position: 'relative', borderRadius: 2, boxShadow: 2, background: '#f5faff', minWidth: 0, overflow: 'visible' }}>
                <Button
                  onClick={() => handleRemoveContract(idx)}
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -16,
                    right: -16,
                    minWidth: 32,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: 2,
                    zIndex: 2,
                    p: 0,
                    '&:hover': {
                      background: '#ffeaea'
                    }
                  }}
                >
                  <DeleteOutlineIcon fontSize="medium" />
                </Button>
                <Stack spacing={0.7}>
                  <FormControl fullWidth size="small" error={!!contractErrors[idx]?.type}>
                    <InputLabel>Sigorta Türü</InputLabel>
                    <Select
                      value={c.type}
                      label="Sigorta Türü"
                      onChange={e => handleContractChange(idx, 'type', e.target.value)}
                      required
                      sx={{ fontSize: 13 }}
                    >
                      {contractTypes.map(opt => (
                        <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Başlangıç Tarihi"
                      value={c.startDate}
                      onChange={date => handleContractChange(idx, 'startDate', date)}
                      format="DD.MM.YYYY"
                      slotProps={{ textField: { size: 'small', required: true, error: !!contractErrors[idx]?.startDate, fullWidth: true, sx: { fontSize: 13, minWidth: 0 } } }}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Bitiş Tarihi"
                      value={c.endDate}
                      onChange={date => handleContractChange(idx, 'endDate', date)}
                      format="DD.MM.YYYY"
                      slotProps={{ textField: { size: 'small', required: true, error: !!contractErrors[idx]?.endDate, fullWidth: true, sx: { fontSize: 13, minWidth: 0 } } }}
                    />
                  </LocalizationProvider>
                </Stack>
              </Paper>
            ))}
            <Button onClick={handleAddContract} variant="outlined" size="small" fullWidth sx={{ fontWeight: 700, color: '#1976d2', borderColor: '#1976d2', mb: 1, mt: 1, borderRadius: 2, boxShadow: 1, fontSize: 14, py: 0.7 }}>
              + Sigorta Ekle
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="medium" fullWidth sx={{
              background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              py: 1,
              borderRadius: 2,
              boxShadow: 2,
              mt: 1,
              '&:hover': { background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)' }
            }}>
              Kaydet
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CustomerForm; 