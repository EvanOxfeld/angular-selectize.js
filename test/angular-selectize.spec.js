'use strict';

describe('selectize directive', function() {
	beforeEach(module('selectize'));

	var selectElement, selectize, scope, compile, timeout;

	var stringOptions = ['foo', 'bar', 'baz'];
	var objectOptions = [{
		value: 'guid1',
		text: 'first'
	},{
		value: 'guid2',
		text: 'second'
	},{
		value: 'guid3',
		text: 'third'
	}];

	beforeEach(inject(function ($rootScope, $compile, $timeout) {
		scope = $rootScope.$new();
		compile = $compile;
		timeout = $timeout;
	}));

	afterEach(function() {
		scope.$destroy();
	});

	function createDirective(template) {
		selectElement = compile($(template))(scope);
		scope.$apply();
		selectize = $(selectElement)[0].selectize;
		selectize.refreshOptions();
	}

	function mousedownClickMouseup(element) {
		$(element).mousedown().click().mouseup();
	}

	describe('on a select', function() {
		describe('with a string array of options', function() {
			beforeEach(function() {
				scope.options = stringOptions;
				scope.selection = 'foo';
				createDirective('<select ng-model="selection" ng-options="option for option in options" selectize></select>');
			});

			describe('when created', function() {
				describe('with no selectize options', function() {
					it('should convert a "<select>" into a selectize dropdown', function() {
						expect(selectize.$wrapper.hasClass('selectize-control')).toBe(true);
					});

					it('should have the same number of options in the dropdown menu as scope.options', function() {
						expect(selectize.$dropdown_content.children().length).toBe(scope.options.length);
					});

					it('should default to the ng-model value', function() {
						var domOptions = selectElement.find('option');
						expect(domOptions.length).toBe(1);
						expect(domOptions.attr('selected')).toBeDefined();
						expect(parseInt(domOptions.attr('value'), 10)).toBe(0);
					});
				});
			});

			describe('when an option is selected', function() {
				it('should update the model', function() {
					expect(scope.selection).toBe('foo');
					selectize.open();
					mousedownClickMouseup(selectize.$dropdown_content.find('[data-value="' + 2 + '"]'));
					expect(scope.selection).toBe('baz');
				});
			});

			//describe('when the model is updated', function() {});

			describe('when the options are updated', function() {
				it('should have the same number of options in the dropdown menu as scope.options', function() {
					expect(selectize.$dropdown_content.children().length).toBe(scope.options.length);
					scope.options.push('qux');
					scope.$apply();
					selectize = $(selectElement)[0].selectize;
					selectize.refreshOptions();
					expect(selectize.$dropdown_content.children().length).toBe(scope.options.length);
				});
			});
		});

		describe('with an object array of options', function() {
			beforeEach(function() {
				scope.options = objectOptions;
				scope.selection = 'guid1';
				createDirective('<select ng-model="selection" ng-options="option.value as option.text for option in options" selectize></select>');

			});

			describe('when created', function() {
				it('should convert a "<select>" into a selectize dropdown', function() {
					expect(selectize.$wrapper.hasClass('selectize-control')).toBe(true);
				});

				it('should have the same number of options in the dropdown menu as scope.options', function() {
					expect(selectize.$dropdown_content.children().length).toBe(scope.options.length);
				});

				it('should default to the ng-model value', function() {
					var domOptions = selectElement.find('option');
					var selectedValue = scope.options[parseInt(domOptions.attr('value'), 10)].value;
					expect(domOptions.length).toBe(1);
					expect(domOptions.attr('selected')).toBeDefined();
					expect(selectedValue).toBe(scope.selection);
				});
			});

			describe('when an option is selected', function() {
				it('should update the model', function() {
					expect(scope.selection).toBe('guid1');
					selectize.open();
					mousedownClickMouseup(selectize.$dropdown_content.find('[data-value="' + 2 + '"]'));
					expect(scope.selection).toBe('guid3');
				});
			});

			//describe('when the model is updated', function() {});

			describe('when the options are updated', function() {
				it('should have the same number of options in the dropdown menu as scope.options', function() {
					expect(selectize.$dropdown_content.children().length).toBe(scope.options.length);
					scope.options.push({
						value: 4,
						text: 'fourth'
					});
					scope.$apply();
					selectize = $(selectElement)[0].selectize;
					selectize.refreshOptions();
					expect(selectize.$dropdown_content.children().length).toBe(scope.options.length);
				});
			});
		});
	});

	describe('on a multiselect', function() {
		describe('with create mode enabled', function() {
			// describe('with an empty ng-model', function() {});
			describe('with a single value in ng-model', function() {
				describe('with a string array of options', function() {
					beforeEach(function() {
						scope.options = stringOptions;
						scope.selection = ['foo'];
						createDirective('<select multiple ng-model="selection" ng-options="option for option in options" selectize="{ create:\'true\' }"></select>');

					});

					describe('when created', function() {
						it('should convert a "<select>" into a selectize dropdown', function() {
							expect(selectize.$wrapper.hasClass('selectize-control')).toBe(true);
						});

						it('should have the correct remaining options', function() {
							expect(selectize.$dropdown_content.children().length).toBe(scope.options.length - scope.selection.length);
						});

						it('should default to the ng-model value', function() {
							var domOptions = selectElement.find('option');
							expect(domOptions.length).toBe(1);
							expect(domOptions.attr('selected')).toBeDefined();
							expect(parseInt(domOptions.attr('value'), 10)).toBe(0);
						});
					});

					describe('when an option is selected', function() {
						it('should update the model', function() {
							expect(scope.selection).toEqual(['foo']);
							selectize.open();
							mousedownClickMouseup(selectize.$dropdown_content.find('[data-value="' + 2 + '"]'));
							expect(scope.selection).toEqual(['foo', 'baz']);
						});
					});

					describe('when a new option is added', function() {
						beforeEach(function() {
							expect(scope.selection).toEqual(['foo']);
							//would be nice to mock submitting the text input
							selectize.addOption({
								text: 'foobar',
								value: 'foobar'
							});
							selectize.addItem('foobar');
						});

						it('should update the model', function() {
							expect(scope.selection).toEqual(['foo', 'foobar']);
						});

						it('should update the model when removed', function() {
							expect(scope.selection).toEqual(['foo', 'foobar']);
							selectize.removeItem('foobar');
							expect(scope.selection).toEqual(['foo']);
						});
					});

					describe('when a selected option is unselected', function() {
						it('should update the model', function() {
							expect(scope.selection).toEqual(['foo']);
							selectize.removeItem(0);
							expect(scope.selection).toEqual([]);
						});
					});

					//describe('when the model is updated', function() {});

					describe('when the options are updated', function() {
						it('should have the correct number of unselected options in the dropdown menu', function() {
							expect(selectize.$dropdown_content.children().length).toBe(scope.options.length - scope.selection.length);
							scope.options.push('qux');
							scope.$apply();
							selectize = $(selectElement)[0].selectize;
							selectize.refreshOptions();
							expect(selectize.$dropdown_content.children().length).toBe(scope.options.length - scope.selection.length);
						});
					});
				});

				describe('with an object array of options', function() {
					beforeEach(function() {
						scope.options = objectOptions;
						scope.selection = ['guid1'];
						createDirective('<select multiple ng-model="selection" ng-options="option.value as option.text for option in options" selectize></select>');
					});

					describe('when created', function() {
						it('should convert a "<select>" into a selectize dropdown', function() {
							expect(selectize.$wrapper.hasClass('selectize-control')).toBe(true);
						});

						it('should have the correct remaining options', function() {
							expect(selectize.$dropdown_content.children().length).toBe(scope.options.length - scope.selection.length);
						});

						it('should default to the ng-model value', function() {
							var domOptions = selectElement.find('option');
							var selectedValue = scope.options[parseInt(domOptions.attr('value'), 10)].value;
							expect(domOptions.length).toBe(1);
							expect(domOptions.attr('selected')).toBeDefined();
							expect(selectedValue).toBe(scope.selection[0]);
						});
					});

					describe('when an option is selected', function() {
						it('should update the model', function() {
							expect(scope.selection).toEqual(['guid1']);
							selectize.open();
							mousedownClickMouseup(selectize.$dropdown_content.find('[data-value="' + 2 + '"]'));
							expect(scope.selection).toEqual(['guid1', 'guid3']);
						});
					});

					describe('when a new option is added', function() {
						beforeEach(function() {
							expect(scope.selection).toEqual(['guid1']);
							selectize.addOption({
								text: 'fourth',
								value: 'fourth'
							});
							selectize.addItem('fourth');
						});

						it('should update the model', function() {
							expect(scope.selection).toEqual(['guid1', 'fourth']);
						});

						it('should update the model when removed', function() {
							expect(scope.selection).toEqual(['guid1', 'fourth']);
							selectize.removeItem('fourth');
							expect(scope.selection).toEqual(['guid1']);
						});
					});

					describe('when a selected option is unselected', function() {
						it('should update the model', function() {
							expect(scope.selection).toEqual(['guid1']);
							selectize.removeItem(0);
							expect(scope.selection).toEqual([]);
						});
					});

					//describe('when the model is updated', function() {});

					describe('when the options are updated', function() {
						it('should have the same number of options in the dropdown menu as scope.options', function() {
							expect(selectize.$dropdown_content.children().length).toBe(scope.options.length - scope.selection.length);
							scope.options.push({
								value: 'guid4',
								text: 'fourth'
							});
							scope.$apply();
							selectize = $(selectElement)[0].selectize;
							selectize.refreshOptions();
							expect(selectize.$dropdown_content.children().length).toBe(scope.options.length - scope.selection.length);
						});
					});
				});
			});


			// describe('with two values in ng-model', function() {});
		});
	});
});
