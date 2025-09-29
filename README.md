# SigortaCRM
Sigorta firmalarının kullandığı CRM sistemine örnek bir çalışma yapılmıştır.

## Kurulum
- Gereksinimler:
  - .NET 8 SDK
  - Node.js 20+

## Çalıştırma
- Hepsini birlikte başlatmak için kökteki `start-all.bat` dosyasını çalıştırın.
  - Backend: `http://localhost:5082` (Swagger: `/swagger`)
  - Frontend: `http://localhost:5173`

### Backend (manuel)
```
cd SigortaCRM/SigortaCRM
 dotnet restore
 dotnet run
```

### Frontend (manuel)
```
cd frontend
 npm ci
 npm run dev
```

## Geliştirme
- Frontend komutları `frontend/package.json` içindedir: `dev`, `build`, `lint`, `preview`.
- Backend için varsayılan profil `http` (5082). Port `Properties/launchSettings.json` dosyasında değiştirilebilir.

## Lisans
MIT