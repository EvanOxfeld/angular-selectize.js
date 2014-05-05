'use strict';

describe('<select selectize>', function() {
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

  function testSelectedOption(value) {
    var domOptions = selectElement.find('option');
    var selectedOption = scope.options[parseInt(domOptions.attr('value'), 10)];
    assert.strictEqual(domOptions.length, 1);
    assert.ok(domOptions.attr('selected'));
    assert.equal(selectedOption.value || selectedOption, value);
  }

  describe('with a string array of options', function() {
    beforeEach(function() {
      scope.options = angular.copy(stringOptions);
      scope.selection = 'foo';
      createDirective('<select ng-model="selection" ng-options="option for option in options" selectize></select>');
    });

    describe('when created', function() {
      describe('with no selectize options', function() {
        it('should convert a "<select>" into a selectize dropdown', function() {
          assert.ok(selectize.$wrapper.hasClass('selectize-control'));
        });

        it('should have the same number of options in the dropdown menu as scope.options', function() {
          assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
        });

        it('should default to the ng-model value', function() {
          testSelectedOption('foo');
        });
      });
    });

    describe('when an option is selected', function() {
      it('should update the model', function() {
        assert.strictEqual(scope.selection, 'foo');
        selectize.open();
        mousedownClickMouseup(selectize.$dropdown_content.find('[data-value="' + 2 + '"]'));
        assert.strictEqual(scope.selection, 'baz');
      });
    });

    describe('when the model is updated', function() {
      it('should update the selection', function() {
        testSelectedOption('foo');
        scope.selection = 'bar';
        scope.$apply();
        timeout.flush();
        testSelectedOption('bar');
      });
    });

    describe('when the options are updated', function() {
      it('should have the same number of options in the dropdown menu as scope.options', function() {
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
        scope.options.push('qux');
        scope.$apply();
        timeout.flush();
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
      });

      it('should not update the selection', function() {
        testSelectedOption('foo');
        scope.options.push('qux');
        scope.$apply();
        timeout.flush();
        testSelectedOption('foo');
      });
    });

    describe('when both the model and the options are updated', function() {
      it('should have the same number of options in the dropdown menu as scope.options', function() {
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);

        scope.selection = 'bar';
        scope.options.push('qux');
        scope.$apply();
        timeout.flush();

        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
      });

      it('should update the selection', function() {
        testSelectedOption('foo');

        scope.selection = 'bar';
        scope.options.push('qux');
        scope.$apply();
        timeout.flush();

        testSelectedOption('bar');
      });
    });
  });

  describe('with an object array of options', function() {
    beforeEach(function() {
      scope.options = angular.copy(objectOptions);
      scope.selection = 'guid1';
      createDirective('<select ng-model="selection" ng-options="option.value as option.text for option in options" selectize></select>');

    });

    describe('when created', function() {
      it('should convert a "<select>" into a selectize dropdown', function() {
        assert.ok(selectize.$wrapper.hasClass('selectize-control'));
      });

      it('should have the same number of options in the dropdown menu as scope.options', function() {
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
      });

      it('should default to the ng-model value', function() {
        testSelectedOption(scope.selection);
      });
    });

    describe('when an option is selected', function() {
      it('should update the model', function() {
        assert.strictEqual(scope.selection, 'guid1');
        selectize.open();
        mousedownClickMouseup(selectize.$dropdown_content.find('[data-value="' + 2 + '"]'));
        assert.strictEqual(scope.selection, 'guid3');
      });
    });

    describe('when the model is updated', function() {
      it('should update the selection', function() {
          testSelectedOption(scope.selection);
          scope.selection = 'guid3';
          scope.$apply();
          timeout.flush();
          testSelectedOption(scope.selection);
      });
    });

    describe('when the options are updated', function() {
      it('should have the same number of options in the dropdown menu as scope.options', function() {
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
        scope.options.push({
          value: 4,
          text: 'fourth'
        });
        scope.$apply();
        timeout.flush();
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
      });
    });

    describe('when both the model and the options are updated', function() {
      it('should have the same number of options in the dropdown menu as scope.options', function() {
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);

        scope.selection = 'bar';
        scope.options.push({
          value: 4,
          text: 'fourth'
        });
        scope.$apply();
        timeout.flush();

        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
      });

      it('should update the selection', function() {
        testSelectedOption(scope.selection);

        scope.selection = 'guid3';
        scope.options.push('qux');
        scope.$apply();
        timeout.flush();

        testSelectedOption(scope.selection);
      });
    });
  });
});
