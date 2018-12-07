describe('build', () => {
	function assertMenu(mode: string, legacy: boolean, id: string, resultText: string) {
		const directory = legacy ? `${mode}-legacy` : `${mode}-evergreen`;
		cy.visit(`/test-app/output/${directory}`);

		cy
			.get('[data-foo]')
			.should('have.attr', 'data-foo')
			.and('include', 'true');
		cy.get('[data-bar]').should('not.exist');

		cy
			.get(`#${id} button`)
			.as('menuItem')
			.should('have.text', `Menu Item ${id.toUpperCase()}`);
		cy
			.get('@menuItem')
			.should('have.attr', 'aria-pressed')
			.and('include', 'false');
		cy.get('@menuItem').click();
		cy
			.get('@menuItem')
			.should('have.attr', 'aria-pressed')
			.and('include', 'true');

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
});
