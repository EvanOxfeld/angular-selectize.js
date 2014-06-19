'use strict';

describe('<select selectize>', function() {
  beforeEach(module('selectize'));

  var selectElement, selectize, scope, compile, timeout;
  var stringOptions = ['foo', 'bar', 'baz'];
  var optionElements = stringOptions.map(function(o, index) {
    return '<option value="' + index + '">' + o + '</option>';
  });

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

  function testSelectedOption(value) {
    var domOptions = selectElement.find('option[selected]');
    var index = parseInt(domOptions.attr('value'), 10);
    var selectedOption = index >= 0 ? stringOptions[index] || '' : '';
    assert.strictEqual(domOptions.length, 1);
    assert.equal(selectedOption.value || selectedOption, value);
  }

  describe('with options in the DOM', function() {
    beforeEach(function() {

      scope.selection = '0';
    });

    describe('with no selectize options', function() {
      beforeEach(function() {
        createDirective('<select ng-model="selection" selectize>' + optionElements.join('') + '</select>');
      });

      describe('when created', function() {
        it('should convert a "<select>" into a selectize dropdown', function() {
          assert.ok(selectize.$wrapper.hasClass('selectize-control'));
        });

        it('should have the same number of options in the dropdown menu as DOM options', function() {
          assert.strictEqual(selectize.$dropdown_content.children().length, stringOptions.length);
        });

        it('should default to the ng-model value', function() {
          testSelectedOption('foo');
        });
      });

      describe('when an option is selected', function() {
        it('should update the model', function() {
          assert.strictEqual(scope.selection, '0');
          selectize.open();
          mousedownClickMouseup(selectize.$dropdown_content.find('[data-value="' + 2 + '"]'));
          assert.strictEqual(scope.selection, '2');
        });
      });

      describe('when the model is updated', function() {
        it('should update the selection', function() {
          testSelectedOption('foo');
          scope.selection = '1';
          scope.$apply();
          timeout.flush();
          testSelectedOption('bar');
        });
      });
    });

    describe('with create mode enabled', function() {
      beforeEach(function() {
        createDirective('<select ng-model="selection" selectize="{ create:\'true\' }">' + optionElements.join('') + '</select>');
      });

      describe('when a new option is added', function() {
        beforeEach(function() {
          selectize.addOption({
            text: 'foobar',
            value: 'foobar'
          });
          selectize.addItem('foobar');
        });

        it('should update the model', function() {
          assert.deepEqual(scope.selection, 'foobar');
        });

        it('should update the model when removed', function() {
          selectize.removeItem('foobar');
          assert.deepEqual(scope.selection, '');
        });
      });
    });
  });
});
