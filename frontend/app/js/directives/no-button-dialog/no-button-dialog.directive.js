/**
 * @module directive/no-button-dialog
 */
define('directives/no-button-dialog/no-button-dialog.directive', function () {
  'use strict';

  /**
   * Implement a simple dialog box with nothing but the template content
   * @param {string} title - contains the label to translate for the title
   * @constructor
   * @alias module:directive/no-button-dialog
   */
  var noButtonDialogDirective = function () {
    return {
      // 'E' - only matches element name
      restrict: 'E',
      // To access the scope outside
      transclude: true,
      scope: {
        title: '@',
      },
      templateUrl: 'templates/no-button-dialog.directive.html',
    };
  };

  return noButtonDialogDirective;
});
