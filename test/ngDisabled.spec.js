'use strict';

describe('<select ng-disabled selectize>', function() {
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

  describe('created with a truthy ngDisabled expression', function() {
    beforeEach(function() {
      scope.selection = '0';
      scope.disabled = true;
      createDirective('<select ng-disabled="disabled" ng-model="selection" selectize>' + optionElements.join('') + '</select>');
    });

    it('should start disabled', function() {
      assert.ok(selectize.isDisabled);
    });

    it('should be enabled when the ngDisabled expression is falsy', function() {
      scope.disabled = false;
      scope.$apply();
      timeout.flush();
      assert.notOk(selectize.isDisabled);
    });
  });

  describe('created with a falsy ngDisabled expression', function() {
    beforeEach(function() {
      scope.selection = '0';
      scope.disabled = false;
      createDirective('<select ng-disabled="disabled" ng-model="selection" ng-options="option for option in options" selectize></select>');
    });

    it('should start enabled', function() {
      assert.notOk(selectize.isDisabled);
    });

    it('should be enabled when the ngDisabled expression is truthy', function() {
      scope.disabled = true;
      scope.$apply();
      timeout.flush();
      assert.ok(selectize.isDisabled);
    });
  });
});
