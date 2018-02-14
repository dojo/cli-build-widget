const { describe, it, after, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as execa from 'execa';
import * as os from 'os';

const appRootDir = path.join(__dirname, '..', '..', '..', 'test-app');

const platform = os.platform().startsWith('win') ? 'windows' : 'unix';

function normalise(value: string) {
	const matches = value.match(/"webpack:\/\/\/webpack\/bootstrap ([a-z0-9]+)"/);
	if (matches) {
		const bootstrapRegExp = new RegExp(matches[1], 'g');
		value = value.replace(bootstrapRegExp, '');
	}

	return value
		.split('# sourceMappingURL')[0]
		.replace(/\r\n/g, '\n')
		.replace(/\\r\\n/g, '\\n')
		.replace(/([A-Za-z0-9\-_]+)\.[a-z0-9]+\.bundle/, '$1.[HASH].bundle');
}

function assertOutput(mode: string, widget: string) {
	const fixtureManifest = require(path.join(appRootDir, 'fixtures', platform, mode, widget, 'manifest'));
	const outputManifest = require(path.join(appRootDir, 'output', mode, 'manifest'));
	const fixtureFileIdentifiers = Object.keys(fixtureManifest);
	const outputFileIdentifiers = Object.keys(outputManifest);
	assert.deepEqual(outputFileIdentifiers, fixtureFileIdentifiers);
	fixtureFileIdentifiers.forEach(id => {
		const fixtureFilePath = path.join(appRootDir, 'fixtures', platform, mode, fixtureManifest[id]);
		const outputFilePath = path.join(appRootDir, 'output', mode, outputManifest[id]);
		const fixtureContents = fs.readFileSync(fixtureFilePath, 'utf8');
		const outputContents = fs.readFileSync(outputFilePath, 'utf8');

		assert.strictEqual(normalise(outputContents), normalise(fixtureContents), id);
	});
}

function clean() {
	rimraf.sync(path.join(appRootDir, 'output'));
	rimraf.sync(path.join(appRootDir, 'src', 'menu-item', 'menuItem.m.css.d.ts'));
	rimraf.sync(path.join(appRootDir, 'src', 'menu', 'menu.m.css.d.ts'));
}

describe('functional build tests', () => {
	beforeEach(() => {
		clean();
	});

	after(() => {
		clean();
	});

	it('correctly builds with dist configuration', () => {
		execa.shellSync('npm run build-dist', { cwd: appRootDir });
		assertOutput('dist', 'menu');
		assertOutput('dist', 'menu-item');
	});

	it('correctly builds with dev configuration', () => {
		execa.shellSync('npm run build-dev', { cwd: appRootDir });
		assertOutput('dev', 'menu');
		assertOutput('dev', 'menu-item');
	});

	it('correctly builds with test configuration', () => {
		execa.shellSync('npm run build-test', { cwd: appRootDir });

		const fixturePath = path.join(appRootDir, 'fixtures', platform, 'test');
		const outputPath = path.join(appRootDir, 'output', 'test');
		const normaliseTestOutput = (value: string) => {
			// Normalize CSS files to just the file name since the full path will differ between
			// environments (e.g., /path/to/menu.m.css => menu.m.css)
			return normalise(value).replace(/"([^"]+)\/([\w-\.]+).css"/g, '$2.css');
		};

		['functional.js', 'unit.js'].forEach(name => {
			const fixtureFilePath = path.join(fixturePath, name);
			const outputFilePath = path.join(outputPath, name);
			const fixtureContents = fs.readFileSync(fixtureFilePath, 'utf8');
			const outputContents = fs.readFileSync(outputFilePath, 'utf8');

			assert.strictEqual(normaliseTestOutput(outputContents), normaliseTestOutput(fixtureContents), name);
		});
	});
});
