$ErrorActionPreference = 'Stop'
Set-Location "C:\Users\MINGOBLOX_AI\Desktop\JABESS\Digital Griot\VESTO Apparell"
$node = (Get-Command node).Source
Start-Process -FilePath $node -ArgumentList "serve.js" -WorkingDirectory "C:\Users\MINGOBLOX_AI\Desktop\JABESS\Digital Griot\VESTO Apparell" -WindowStyle Hidden
