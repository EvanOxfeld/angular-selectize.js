'use strict';

describe('<select multiple selectize>', function() {
  beforeEach(module('selectize'));

  var selectElement, selectize, scope, compile;

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

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
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

  function testSelectedOptions(values) {
    values = angular.isArray(values) ? values : [values];
    var domValues = selectElement
                      .find('option[selected]')
                      .map(function() {
                        return parseInt($(this).attr('value'), 10);
                      })
                      .toArray()
                      .reduce(function(arr, v) {
                        if (arr.indexOf(v) < 0) arr.push(v);
                        return arr;
                      }, []);
    assert.strictEqual(domValues.length, values.length);
    assert.ok(domValues.every(function(v) {
      return values.indexOf(v) >= 0;
    }));
  }

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
            assert.ok(selectize.$wrapper.hasClass('selectize-control'));
          });

          it('should have the correct remaining options', function() {
            assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length - scope.selection.length);
          });

          it('should default to the ng-model value', function() {
            testSelectedOptions(0);
          });
        });

        describe('when an option is selected', function() {
          it('should update the model', function() {
            assert.deepEqual(scope.selection, ['foo']);
            selectize.open();
            mousedownClickMouseup(selectize.$dropdown_content.find('[data-value="' + 2 + '"]'));
            assert.deepEqual(scope.selection, ['foo', 'baz']);
          });
        });

        describe('when a new option is added', function() {
          beforeEach(function() {
            assert.deepEqual(scope.selection, ['foo']);
            //would be nice to mock submitting the text input
            selectize.addOption({
              text: 'foobar',
              value: 'foobar'
            });
            selectize.addItem('foobar');
          });

          it('should update the model', function() {
            assert.deepEqual(scope.selection, ['foo', 'foobar']);
          });

          it('should update the model when removed', function() {
            assert.deepEqual(scope.selection, ['foo', 'foobar']);
            selectize.removeItem('foobar');
            assert.deepEqual(scope.selection, ['foo']);
          });
        });

        describe('when a selected option is unselected', function() {
          it('should update the model', function() {
            selectize.addItem(1);
            selectize.addItem(2);
            assert.deepEqual(scope.selection, ['foo','bar','baz']);

            selectize.removeItem(0);
            assert.deepEqual(scope.selection, ['bar','baz']);
          });
        });

        describe('when the model is updated', function() {
          beforeEach(function() {
            testSelectedOptions(0);
          });

          it('should clear the selection when the model is empty', function() {
            scope.selection = [];
            scope.$apply();
            assert.strictEqual(selectElement.find('option').length, 0);
          });

          it('should update the selection when the model contains a single item', function() {
            scope.selection = ['bar'];
            scope.$apply();
            testSelectedOptions(1);
          });

          it('should update the selection when the model contains two items', function() {
            scope.selection = ['bar', 'baz'];
            scope.$apply();
            testSelectedOptions([1,2]);
          });
        });

        describe('when the options are updated', function() {
          it('should have the correct number of unselected options in the dropdown menu', function() {
            assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length - scope.selection.length);
            scope.options.push('qux');
            scope.$apply();
            selectize = $(selectElement)[0].selectize;
            selectize.refreshOptions();
            assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length - scope.selection.length);
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
            assert.ok(selectize.$wrapper.hasClass('selectize-control'));
          });

          it('should have the correct remaining options', function() {
            assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length - scope.selection.length);
          });

          it('should default to the ng-model value', function() {
            testSelectedOptions(0);
          });
        });

        describe('when an option is selected', function() {
          it('should update the model', function() {
            assert.deepEqual(scope.selection, ['guid1']);
            selectize.open();
            mousedownClickMouseup(selectize.$dropdown_content.find('[data-value="' + 2 + '"]'));
            assert.deepEqual(scope.selection, ['guid1', 'guid3']);
          });
        });

        describe('when a new option is added', function() {
          beforeEach(function() {
            assert.deepEqual(scope.selection, ['guid1']);
            selectize.addOption({
              text: 'fourth',
              value: 'fourth'
            });
            selectize.addItem('fourth');
          });

          it('should update the model', function() {
            assert.deepEqual(scope.selection, ['guid1', 'fourth']);
          });

          it('should update the model when removed', function() {
            assert.deepEqual(scope.selection, ['guid1', 'fourth']);
            selectize.removeItem('fourth');
            assert.deepEqual(scope.selection, ['guid1']);
          });
        });

        describe('when a selected option is unselected', function() {
          it('should update the model', function() {
            selectize.addItem(1);
            selectize.addItem(2);
            assert.deepEqual(scope.selection, ['guid1','guid2','guid3']);

            selectize.removeItem(0);
            assert.deepEqual(scope.selection, ['guid2','guid3']);
          });
        });

        describe('when the model is updated', function() {
          beforeEach(function() {
            testSelectedOptions(0);
          });

          it('should clear the selection when the model is empty', function() {
            scope.selection = [];
            scope.$apply();
            assert.strictEqual(selectElement.find('option').length, 0);
          });

          it('should update the selection when the model contains a single item', function() {
            scope.selection = ['guid2'];
            scope.$apply();
            testSelectedOptions(1);
          });

          it('should update the selection when the model contains two items', function() {
            scope.selection = ['guid2', 'guid3'];
            scope.$apply();
            testSelectedOptions([1,2]);
          });
        });

        describe('when the options are updated', function() {
          it('should have the same number of options in the dropdown menu as scope.options', function() {
            assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length - scope.selection.length);
            scope.options.push({
              value: 'guid4',
              text: 'fourth'
            });
            scope.$apply();
            selectize = $(selectElement)[0].selectize;
            selectize.refreshOptions();
            assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length - scope.selection.length);
          });
        });
      });

      // describe('with two values in ng-model', function() {});
    });
  });
});
