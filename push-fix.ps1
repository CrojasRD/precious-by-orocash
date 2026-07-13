# Script para hacer push del archivo reparado
cd C:\precious-by-orocash

# Limpiar el lock file si existe
if (Test-Path ".git\index.lock") {
    Remove-Item ".git\index.lock" -Force
}

# Configurar git (en caso de que no esté configurado)
git config user.name "Precious Fix Bot"
git config user.email "fix@precious.local"

# Verificar estado
Write-Host "Git status:"
git status

# Agregar el archivo
git add lib/firebase/db-service.ts

# Commit
Write-Host "`nMaking commit..."
git commit -m "fix: restore correct template literals in uploadFile (line 171)"

# Log
Write-Host "`nLatest commits:"
git log --oneline -3

# Push
Write-Host "`nPushing to GitHub..."
git push origin main

Write-Host "`n✓ Push completed!"
