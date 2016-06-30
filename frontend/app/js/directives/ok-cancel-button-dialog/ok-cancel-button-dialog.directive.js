/* eslint indent: [0, 0] */

/**
 * @module directive/ok-cancel-button-dialog
 */
define('directives/ok-cancel-button-dialog/ok-cancel-button-dialog.directive', function () {
  'use strict';

  /**
   * Implement a dialog box with a OK and CANCEL button.
   * @param {string} title - contains the label to translate for the title
   * @param {string} cancel - if equals to 'no', the CANCEL button is not
   * @param {string} next - if not undefined, will call $state.go(next)
   * displayed
   * @constructor
   * @alias module:directive/ok-cancel-button-dialog
   */
  var okCancelButtonDialogDirective = function () {
    return {
      // 'E' - only matches element name
      restrict: 'E',
      controllerAs: 'vm',
      // To access the scope outside
      transclude: true,
      scope: {
        title: '@',
        cancel: '@',
        next: '@',
      },
      templateUrl: 'templates/ok-cancel-button-dialog.directive.html',
    };
  };

  return okCancelButtonDialogDirective;
});
