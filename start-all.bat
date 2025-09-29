@echo off
start cmd /k "cd SigortaCRM\SigortaCRM && dotnet run"
start cmd /k "cd frontend && npm run dev"
start http://localhost:5173
start http://localhost:5082/swagger 