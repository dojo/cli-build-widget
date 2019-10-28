const { describe, it, beforeEach, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { stub } from 'sinon';
import MockModule from '../support/MockModule';

const configJson: any = { widgets: ['widget'] };
let mockModule: MockModule;
let mockDevConfig: any;
let mockDistConfig: any;
let mockUnitTestConfig: any;
let mockFunctionalTestConfig: any;

describe('ejected config', () => {
	beforeEach(() => {
		mockModule = new MockModule('../../src/ejected.config', require);
		mockModule.dependencies([
			'./dev.config',
			'./dist.config',
			'./unit.config',
			'./functional.config',
			'./build-options.json'
		]);

		const configs = ['dev', 'dist', 'unit', 'functional'].map(name => {
			const config = mockModule.getMock(`./${name}.config`);
			config.default = stub();
			return config.default;
		});

		Object.assign(mockModule.getMock('./build-options.json'), configJson);
		mockDevConfig = configs[0];
		mockDistConfig = configs[1];
		mockUnitTestConfig = configs[2];
		mockFunctionalTestConfig = configs[3];
	});

	afterEach(() => {
		mockModule.destroy();
	});

	describe('custom elements', () => {
		it('can run dev mode', () => {
			const config = mockModule.getModuleUnderTest();
			config({ mode: 'dev' });
			assert.isTrue(mockDevConfig.calledOnce);
			assert.isTrue(
				mockDevConfig.calledWith({ widgets: [{ name: 'widget', path: 'widget' }], target: 'custom element' })
			);
		});

		it('can run dist mode', () => {
			const config = mockModule.getModuleUnderTest();
			config();
			assert.isTrue(mockDistConfig.calledOnce);
			assert.isTrue(
				mockDistConfig.calledWith({ widgets: [{ name: 'widget', path: 'widget' }], target: 'custom element' })
			);
		});

		it('can run unit mode', () => {
			const config = mockModule.getModuleUnderTest();
			config({ mode: 'unit' });
			assert.isTrue(mockUnitTestConfig.calledOnce);
			assert.isTrue(
				mockUnitTestConfig.calledWith({ widgets: [{ name: 'widget', path: 'widget' }], target: 'custom element' })
			);
		});

		it('can run functional mode', () => {
			const config = mockModule.getModuleUnderTest();
			config({ mode: 'functional' });
			assert.isTrue(mockFunctionalTestConfig.calledOnce);
			assert.isTrue(
				mockFunctionalTestConfig.calledWith({ widgets: [{ name: 'widget', path: 'widget' }], target: 'custom element' })
			);
		});
	});

	describe('widget libraries', () => {
		it('can run dev mode', () => {
			const config = mockModule.getModuleUnderTest();
			config({ mode: 'dev', target: 'lib' });
			assert.isTrue(mockDevConfig.calledOnce);
			assert.isTrue(mockDevConfig.calledWith({ widgets: [{ name: 'widget', path: 'widget' }], target: 'lib' }));
		});

		it('can run dist mode', () => {
			const config = mockModule.getModuleUnderTest();
			config({ target: 'lib' });
			assert.isTrue(mockDistConfig.calledOnce);
			assert.isTrue(mockDistConfig.calledWith({ widgets: [{ name: 'widget', path: 'widget' }], target: 'lib' }));
		});

		it('can run unit mode', () => {
			const config = mockModule.getModuleUnderTest();
			config({ mode: 'unit', target: 'lib' });
			assert.isTrue(mockUnitTestConfig.calledOnce);
			assert.isTrue(mockUnitTestConfig.calledWith({ widgets: [{ name: 'widget', path: 'widget' }], target: 'lib' }));
		});

		it('can run functional mode', () => {
			const config = mockModule.getModuleUnderTest();
			config({ mode: 'functional', target: 'lib' });
			assert.isTrue(mockFunctionalTestConfig.calledOnce);
			assert.isTrue(
				mockFunctionalTestConfig.calledWith({ widgets: [{ name: 'widget', path: 'widget' }], target: 'lib' })
			);
		});
	});
});
