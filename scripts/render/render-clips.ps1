# Rendert clips voor de site met VisualDJ zelf (RENDER VIDEO via de opdrachtregel), op basis van Rodney's eigen show.
#
# Nodig: de app gebouwd in ..\visuals (build\VisualDJ_artefacts\Release\VisualDJ.exe), de show
# ..\visuals\voorbeeld\Let Techno Unite 2.vdj, ffmpeg, en de loop in assets\audio.
#
# Gebruik (vanuit de map van de site):
#   powershell -File scripts\render\render-clips.ps1                    alles (achtergrond, Standard, zes teksten)
#   powershell -File scripts\render\render-clips.ps1 -Only standard2    één clip
# De ruwe renders komen in $env:TEMP\visualdj-render\renders. Maak er daarna webversies van met webclip.ps1.
#
# Goed om te weten:
# - Modus: 0 Standard, 1 Story, 2 Follow, 3 Dans, 4 World. logo=10 = het logo aan het begin (de D-achtergrond komt
#   dan rustig op na het logo), 00 = geen logo.
# - De app zet bij elke start ADE-beeld (geel) aan; webclip.ps1 draait de kleurtoon achteraf.
# - Zonder blokken blijven Standard en Dans zwart: een onzichtbare PNG in media\event telt als blok.
# - Een tekst komt binnen 15 s na de start: een .txt in media\event met als eerste regel [formaat: horizontaal|verticaal|tekstblok].
# - Dans in 1920x1080 bleef zwart; 1280x720 werkt.
param([string]$Only = "", [string]$Wav = "")

$site = Resolve-Path "$PSScriptRoot\..\.."
$visuals = Resolve-Path "$site\..\visuals"
$exe = "$visuals\build\VisualDJ_artefacts\Release\VisualDJ.exe"
$vdj = "$visuals\voorbeeld\Let Techno Unite 2.vdj"
if (-not $Wav) { $Wav = "$site\assets\audio\looptechno1.wav" }
$work = "$env:TEMP\visualdj-render"
$src = "$work\show"
$out = "$work\renders"
New-Item -ItemType Directory -Force $out | Out-Null

# De show één keer uitpakken (een .vdj is een zip: show.json, media\, session.json)
if (-not (Test-Path "$src\show.json")) {
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [IO.Compression.ZipFile]::ExtractToDirectory($vdj, $src)
}

function New-Data($name, $text = $null, $format = "horizontaal") {
  $d = "$work\data-$name"
  if (Test-Path $d) { Remove-Item -Recurse -Force $d }
  New-Item -ItemType Directory -Force $d | Out-Null
  Copy-Item "$src\show.json" $d
  Copy-Item -Recurse "$src\media" "$d\media"
  # De teksten, planning en achtergronden van het event weg: die zet elke render zelf
  Get-ChildItem "$d\media\event" -File | Remove-Item
  Get-ChildItem "$d\media\event\achtergrond" -File | Remove-Item
  ffmpeg -v error -y -f lavfi -i "color=c=black@0.0:s=2x2,format=rgba" -frames:v 1 "$d\media\event\leeg.png"
  if ($text) { [IO.File]::WriteAllText("$d\media\event\tekst.txt", "[formaat: $format]`n$text", (New-Object Text.UTF8Encoding $false)) }
  return $d
}
function Render($name, $data, $start, $end, $mode, $logo) {
  $file = "$out\$name.mp4"
  if (Test-Path $file) { "AL KLAAR $name"; return }
  $spec = "$Wav|$start|$end|1280x720|0|$file|q=3|logo=$logo|mode=$mode|fps=30"
  $p = Start-Process -FilePath $exe -ArgumentList "--data=$data", "--render=$spec" -PassThru
  if (-not $p.WaitForExit(1500000)) { $p.Kill(); "TIMEOUT $name" } else { "KLAAR $name " + (Get-Item $file -ErrorAction SilentlyContinue).Length }
}
function Want($name) { return (-not $Only) -or ($Only -eq $name) }

# 1. De D-achtergrond (IMG_5527, Ring Tower, direct na het logo), met een tekst
if (Want "ltu-background") {
  $d = New-Data "bg" "ONE FLOOR`nONE ENERGY" "verticaal"
  Copy-Item "$src\media\event\achtergrond\IMG_5527.JPG" "$d\media\event\achtergrond\"
  Render "ltu-background" $d 0 45 0 "10"
}

# 2. Standard, met een tekst
if (Want "standard2") {
  $d = New-Data "std" "FEEL THE FREQUENCY"
  Render "standard2" $d 0 45 0 "00"
}

# 3. Teksten: elk stukje één tekst (komt binnen 15 s na de start)
$texts = @(
  @("SOUND BECOMES SPACE", "horizontaal", 1),
  @("FEEL THE FREQUENCY", "horizontaal", 0),
  @("SEE`nTHE`nMUSIC", "verticaal", 2),
  @("NO TIME ONLY SOUND", "horizontaal", 1),
  @("THE FLOOR IS ALIVE", "horizontaal", 4),
  @("FOLLOW THE BASS", "horizontaal", 3)
)
for ($i = 0; $i -lt $texts.Count; $i++) {
  if (-not (Want "text$i")) { continue }
  $t = $texts[$i]
  $d = New-Data "txt$i" $t[0] $t[1]
  Render "text$i" $d 0 30 $t[2] "00"
}
"ALLES KLAAR - de renders staan in $out"
