describe('build', () => {
	function assertMenu(mode: string, legacy: boolean, id: string, resultText: string) {
		const directory = legacy ? `${mode}-legacy` : `${mode}-evergreen`;
		cy.visit(`/test-app/output/${directory}/`);
		cy.wait(1000); // Wait for the elements to become interactive

		cy
			.get('[data-foo]')
			.should('have.attr', 'data-foo')
			.and('include', 'true');
		cy.get('[data-bar]').should('not.exist');

		cy
			.get(`#${id} button`)
			.as('menuItem')
			.should('have.text', `Menu Item ${id.toUpperCase()}`);

		cy.get('@menuItem').click();
		cy.get('#result').should('have.text', resultText);
	}

	it('evergreen dist', () => {
		assertMenu('dist', false, 'a', 'bar');
		assertMenu('dist', false, 'b', 'baz');
		assertMenu('dist', false, 'c', 'bat');
	});

	it('legacy dist', () => {
		assertMenu('dist', true, 'a', 'bar');
		assertMenu('dist', true, 'b', 'baz');
		assertMenu('dist', true, 'c', 'bat');
	});

	it('evergreen dev', () => {
		assertMenu('dev', false, 'a', 'bar');
		assertMenu('dev', false, 'b', 'baz');
		assertMenu('dev', false, 'c', 'bat');
	});

	it('legacy dev', () => {
		assertMenu('dev', true, 'a', 'bar');
		assertMenu('dev', true, 'b', 'baz');
		assertMenu('dev', true, 'c', 'bat');
	});

	function assertLibMenu(mode: 'dev' | 'dist', legacy: boolean, index: number, resultText: string) {
		const titles = ['A', 'B', 'C'].map(title => `Menu Item ${title}`);
		const directory = legacy ? `${mode}-lib-legacy` : `${mode}-lib`;
		cy.visit(`/test-lib-app/output/${directory}/`);
		cy.wait(1000); // Wait for the elements to become interactive

		cy
			.get('[data-foo]')
			.should('have.attr', 'data-foo')
			.and('include', 'true');
		cy.get('[data-bar]').should('not.exist');

		cy
			.get('li button')
			.eq(index)
			.as('menuItem')
			.should('have.text', titles[index]);

		cy.get('@menuItem').click();
		cy.get('#result').should('have.text', resultText);
	}

	it('lib: evergreen dist', () => {
		assertLibMenu('dist', false, 0, 'bar');
		assertLibMenu('dist', false, 1, 'baz');
		assertLibMenu('dist', false, 2, 'bat');
	});

	it('lib: legacy dist', () => {
		assertLibMenu('dist', true, 0, 'bar');
		assertLibMenu('dist', true, 1, 'baz');
		assertLibMenu('dist', true, 2, 'bat');
	});

	it('lib: evergreen dev', () => {
		assertLibMenu('dev', false, 0, 'bar');
		assertLibMenu('dev', false, 1, 'baz');
		assertLibMenu('dev', false, 2, 'bat');
	});

	it('lib: legacy dev', () => {
		assertLibMenu('dev', true, 0, 'bar');
		assertLibMenu('dev', true, 1, 'baz');
		assertLibMenu('dev', true, 2, 'bat');
	});
});
