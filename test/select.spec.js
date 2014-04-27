'use strict';

describe('<select selectize>', function() {
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

  describe('with a string array of options', function() {
    beforeEach(function() {
      scope.options = stringOptions;
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
          var domOptions = selectElement.find('option');
          assert.strictEqual(domOptions.length, 1);
          assert.ok(domOptions.attr('selected'));
          assert.equal(domOptions.attr('value'), 0);
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

    //describe('when the model is updated', function() {});

    describe('when the options are updated', function() {
      it('should have the same number of options in the dropdown menu as scope.options', function() {
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
        scope.options.push('qux');
        scope.$apply();
        selectize = $(selectElement)[0].selectize;
        selectize.refreshOptions();
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
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
        assert.ok(selectize.$wrapper.hasClass('selectize-control'));
      });

      it('should have the same number of options in the dropdown menu as scope.options', function() {
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
      });

      it('should default to the ng-model value', function() {
        var domOptions = selectElement.find('option');
        var selectedValue = scope.options[parseInt(domOptions.attr('value'), 10)].value;
        assert.strictEqual(domOptions.length, 1);
        assert.ok(domOptions.attr('selected'));
        assert.equal(selectedValue, scope.selection);
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

    //describe('when the model is updated', function() {});

    describe('when the options are updated', function() {
      it('should have the same number of options in the dropdown menu as scope.options', function() {
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
        scope.options.push({
          value: 4,
          text: 'fourth'
        });
        scope.$apply();
        selectize = $(selectElement)[0].selectize;
        selectize.refreshOptions();
        assert.strictEqual(selectize.$dropdown_content.children().length, scope.options.length);
      });
    });
  });
});
