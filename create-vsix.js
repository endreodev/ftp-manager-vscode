const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Ler package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;
const name = packageJson.name;

// Nome do arquivo VSIX
const vsixFileName = `${name}-${version}.vsix`;

console.log(`📦 Criando pacote VSIX: ${vsixFileName}`);

// Criar arquivo ZIP (VSIX é um arquivo ZIP com extensão diferente)
const output = fs.createWriteStream(vsixFileName);
const archive = archiver('zip', {
    zlib: { level: 9 } // Máxima compressão
});

output.on('close', function() {
    const size = (archive.pointer() / 1024).toFixed(2);
    console.log(`✅ Pacote criado com sucesso!`);
    console.log(`📊 Tamanho: ${size} KB`);
    console.log(`📄 Arquivo: ${vsixFileName}`);
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);

// Adicionar extension.vsixmanifest
const manifest = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Language="en-US" Id="${name}" Version="${version}" Publisher="${packageJson.publisher || 'unknown'}"/>
    <DisplayName>${packageJson.displayName || name}</DisplayName>
    <Description xml:space="preserve">${packageJson.description || ''}</Description>
    <Tags>ftp,ftps,upload,download,sync,file manager</Tags>
    <Categories>Other</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <License>extension/LICENSE</License>
    <Icon>extension/icon.png</Icon>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code"/>
  </Installation>
  <Dependencies/>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json"/>
  </Assets>
</PackageManifest>`;

archive.append(manifest, { name: 'extension.vsixmanifest' });

// Adicionar [Content_Types].xml
const contentTypes = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension=".json" ContentType="application/json"/>
  <Default Extension=".vsixmanifest" ContentType="text/xml"/>
</Types>`;

archive.append(contentTypes, { name: '[Content_Types].xml' });

// Arquivos e pastas para incluir
const filesToInclude = [
    'package.json',
    'README.md',
    'README-PT.md',
    'LICENSE',
    'CHANGELOG.md'
];

const foldersToInclude = [
    'dist',
    'doc'
];

// Adicionar arquivos
filesToInclude.forEach(file => {
    if (fs.existsSync(file)) {
        archive.file(file, { name: `extension/${file}` });
        console.log(`📄 Adicionando: ${file}`);
    }
});

// Adicionar pastas
foldersToInclude.forEach(folder => {
    if (fs.existsSync(folder)) {
        archive.directory(folder, `extension/${folder}`);
        console.log(`📁 Adicionando pasta: ${folder}/`);
    }
});

// Finalizar o arquivo
archive.finalize();
