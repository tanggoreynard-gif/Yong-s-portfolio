Add-Type -AssemblyName System.Runtime.WindowsRuntime
 = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { .Name -eq 'AsTask' -and .GetParameters().Count -eq 1 -and .GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation1' })[0]
function AwaitTask(, ) {
     = .MakeGenericMethod()
     = .Invoke(, @())
    .Wait(-1) | Out-Null
    return .Result
}
[Windows.Graphics.Imaging.BitmapDecoder,Windows.Foundation,ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile,Windows.Foundation,ContentType=WindowsRuntime] | Out-Null

 = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new('en-US'))
 = Join-Path (Get-Location) 'scratch/user_prompt_image.png'
 = AwaitTask ([Windows.Storage.StorageFile]::GetFileFromPathAsync()) ([Windows.Storage.StorageFile])
 = AwaitTask (.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
 = AwaitTask ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync()) ([Windows.Graphics.Imaging.BitmapDecoder])
 = AwaitTask (.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
 = AwaitTask (.RecognizeAsync()) ([Windows.Media.Ocr.OcrResult])
Write-Host .Text
