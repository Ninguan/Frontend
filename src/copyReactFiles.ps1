# Встановлення кореневої директорії проєкту (src або корінь)
$rootDir = ".\src"

# Отримуємо шлях до робочого столу
$desktopDir = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop")
$outputFile = Join-Path -Path $desktopDir -ChildPath "projectOutput.txt"

# Очищаємо попередній файл, якщо існує
if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

# Рекурсивне зчитування всіх файлів
function Read-FilesRecursively {
    param (
        [string]$directory
    )
    Get-ChildItem -Path $directory -Recurse -File | ForEach-Object {
        $filePath = $_.FullName
        $content = Get-Content -Path $filePath -Raw
        Add-Content -Path $outputFile -Value "=== $filePath ===`n$content`n`n"
    }
}
Get-ChildItem -Path $directory -Recurse -File | ForEach-Object {
    Write-Host "Обробляється файл: $_.FullName"
    $filePath = $_.FullName
    $content = Get-Content -Path $filePath -Raw
    Add-Content -Path $outputFile -Value "=== $filePath ===`n$content`n`n"
}
if (Test-Path $desktopDir) {
    Write-Host "Папка робочого столу знайдена."
} else {
    Write-Host "Помилка: Папка робочого столу не знайдена."
}
try {
    # Запуск функції для кореневої папки
    Read-FilesRecursively -directory $rootDir
    Write-Host "Файли успішно скопійовані у $outputFile"
} catch {
    Write-Host "Помилка при створенні файлу: $_"
}
Write-Host "Шлях до файлу: $outputFile"
# Запуск функції для кореневої папки
Read-FilesRecursively -directory $rootDir
Write-Host "Шлях до робочого столу: $desktopDir"
Write-Host "Файли успішно скопійовані у $outputFile"