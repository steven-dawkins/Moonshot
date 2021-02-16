$scriptpath = $MyInvocation.MyCommand.Path
$folder = Split-Path $scriptpath

# temporarily change to the correct folder
Push-Location $folder

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$PSDefaultParameterValues['*:ErrorAction']='Stop'
function ThrowOnNativeFailure {
    if (-not $?)
    {
        throw 'Native Failure'
    }
}

docker build . --tag moonshot
ThrowOnNativeFailure
docker tag moonshot eu.gcr.io/moonshot-813/moonshot
ThrowOnNativeFailure
docker push eu.gcr.io/moonshot-813/moonshot
ThrowOnNativeFailure

Pop-Location