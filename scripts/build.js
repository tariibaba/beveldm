const builder = require('electron-builder');
const packageJson = require('../package.json');
const fs = require('fs/promises');
const path = require('path');

const version = packageJson.version;
const outputDir = `dist/v${version}`;
const outputPath = path.resolve(outputDir);

async function renameWin(arch) {
  console.log('Renaming files...');
  const oldFilename = `BevelDM-Installer-${version}-win.exe`;
  const newFilename = `BevelDM-Installer-${version}-win-${arch}.exe`;
  await fs.rename(
    path.join(outputPath, oldFilename),
    path.join(outputPath, newFilename)
  );
  const oldFilenameBlockmap = `BevelDM-Installer-${version}-win.exe.blockmap`;
  const newFilenameBlockmap = `BevelDM-Installer-${version}-win-${arch}.exe.blockmap`;
  await fs.rename(
    path.join(outputPath, oldFilenameBlockmap),
    path.join(outputPath, newFilenameBlockmap)
  );
}

const config = {
  ...packageJson.build,
  directories: {
    output: outputDir,
  },
};

async function build() {
  await builder.build({
    config: JSON.parse(JSON.stringify(config)),
    win: ['nsis'],
    ia32: true,
  });
  await renameWin('x86');

  await builder.build({
    config: JSON.parse(JSON.stringify(config)),
    win: ['nsis'],
    linux: ['tar.gz'],
    x64: true,
  });
  await renameWin('x64');
}

build().then(() => {});
