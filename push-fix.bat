@echo off
cd /d C:\precious-by-orocash

echo ✓ Cleaning up git lock file...
if exist ".git\index.lock" del ".git\index.lock"

echo ✓ Configuring git...
git config user.name "Precious Fix Bot"
git config user.email "fix@precious.local"

echo.
echo ✓ Git status:
git status

echo.
echo ✓ Adding file...
git add lib/firebase/db-service.ts

echo.
echo ✓ Making commit...
git commit -m "fix: restore correct template literals in uploadFile (line 171)"

echo.
echo ✓ Latest commits:
git log --oneline -3

echo.
echo ✓ Pushing to GitHub...
git push origin main

echo.
echo ✓✓ Push completed!
pause
