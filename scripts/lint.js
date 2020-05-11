const path = require('path');
const { CLIEngine } = require('eslint');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const cli = new CLIEngine({
  fix: true,
  useEslintrc: false,
  configFile: path.resolve(__dirname, '../.eslintrc.js'),
  extensions: ['.js', '.vue'],
});

const report = cli.executeOnFiles([resolve('src')]);
CLIEngine.outputFixes(report);
