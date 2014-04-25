'use strict';

/**
 * Directive to convert a select into a selectize.js hybrid textbox and <select>
 * Supports an ngOptions expression. Tested with:
 *  `label for value in array`
 *  `select as label for value in array`
 * In theory supports the same options as selectize.js
 *
 * Usage:
 * <select
 *   multiple
 *   ng-model="selected"
 *   ng-options="option.id as option.name for option in options"
 *   selectize="{ plugins: ['remove_button'], create: 'true' }">
 * </select>

     Attributes:
    multiple: Converts the select into text input of tags
 **/

angular.module('selectize', [])

.directive('selectize', ['$parse', function($parse) {
  var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      var selectizeOptions = scope.$eval(attrs.selectize) || {};
      var isMultiselect = angular.isDefined(attrs.multiple);
      var match = attrs.ngOptions.match(NG_OPTIONS_REGEXP);
      var valueName = match[4] || match[6];
      var optionsProperty = match[7];
      var valueFn = $parse(match[2] ? match[1] : valueName);
      var selectize;

      scope.$watchCollection(optionsProperty, refreshSelectize);

      function refreshSelectize(newOptions, oldOptions) {
        if (selectize) {
          selectize.destroy();
        }
        scope.$evalAsync(function() {
          $(element).selectize(selectizeOptions);
          selectize = $(element)[0].selectize;
          if (isMultiselect) {
            selectize.on('item_add', function(value, $item) {
              var model = ngModelCtrl.$viewValue;

              var optionsModel = scope[optionsProperty];
              if (optionsModel[value]) {
                var optionContext = {};
                optionContext[valueName] = optionsModel[value];
                value = valueFn(optionContext);
              }

              model.push(value);
              scope.$evalAsync(function() {
                ngModelCtrl.$setViewValue(model);
              });
            });
            selectize.on('item_remove', function(value) {
              var model = ngModelCtrl.$viewValue;

              var optionsModel = scope[optionsProperty];
              if (optionsModel[value]) {
                var optionContext = {};
                optionContext[valueName] = optionsModel[value];
                value = valueFn(optionContext);
              }

              var index = model.indexOf(value);
              if (index >= 0) {
                model.splice(index, 1);
                scope.$evalAsync(function() {
                  ngModelCtrl.$setViewValue(model);
                });
              }
            });
          }
        });
      }
    }
  };
}]);
