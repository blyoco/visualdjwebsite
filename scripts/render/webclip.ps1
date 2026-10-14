# Maakt van een ruwe render een webversie voor de site: 15 s (8 maten op 128 BPM) vanaf -Start, kleurtoon gedraaid
# (-Hue; de app rendert altijd in ADE-geel), 720p voor de secties, 360p voor de tunnel en de carrousel, en een poster.
#
# Gebruik (vanuit de map van de site):
#   powershell -File scripts\render\webclip.ps1 -Name standard -Hue 215 -Start 20 -In "$env:TEMP\visualdj-render\renders\standard2.mp4"
#   powershell -File scripts\render\webclip.ps1 -Name background -Hue 0 -Sat 1 -Start 1 -In ...\ltu-background.mp4
# Kleurtonen op de site: standard 215 (paars), story 245 (magenta), follow -30 (oranje), dance 110 (groen),
# world 130 (cyaan); background zonder draaiing (-Hue 0 -Sat 1).
# texts.mp4 is met de hand gemonteerd uit vijf tekstmomenten van 4 s (zie CLAUDE.md).
param([Parameter(Mandatory)][string]$Name, [Parameter(Mandatory)][string]$In, [int]$Hue = 0, [double]$Start = 4, [double]$Sat = 1.4)

$out = Resolve-Path "$PSScriptRoot\..\..\public\video"
$hf = "hue=h=$($Hue):s=$Sat"
ffmpeg -v error -y -ss $Start -t 15 -i $In -an -vf "$hf,scale=1280:720:flags=lanczos" -c:v libx264 -b:v 2200k -maxrate 2600k -bufsize 5000k -preset slow -pix_fmt yuv420p -movflags +faststart "$out\$Name.mp4"
ffmpeg -v error -y -ss $Start -t 15 -i $In -an -vf "$hf,scale=640:360:flags=lanczos" -c:v libx264 -b:v 650k -maxrate 800k -bufsize 1600k -preset slow -pix_fmt yuv420p -movflags +faststart "$out\$Name-sm.mp4"
ffmpeg -v error -y -ss ($Start + 6) -i $In -frames:v 1 -vf "$hf,scale=1280:720:flags=lanczos" -q:v 4 "$out\$Name.jpg"
"{0}: {1:N1} MB / {2:N1} MB / {3:N0} KB" -f $Name, ((Get-Item "$out\$Name.mp4").Length / 1MB), ((Get-Item "$out\$Name-sm.mp4").Length / 1MB), ((Get-Item "$out\$Name.jpg").Length / 1KB)
