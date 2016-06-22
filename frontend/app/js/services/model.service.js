/* eslint no-use-before-define: 0 */

define('services/model.service', function () {
  /**
   * This service represent the data model used by the frontend.
   * @exports services/model.service
   */
  'use strict';

  var modelServiceFactory = function ($rootScope, lodash, logService) {
    /* The model service object */
    var modelService = {};
    /*
     * The model object is split in 2:
     * - the profiles: representing the profiles of the various views and tabs
     *                 for each profiles
     * - the status: the status of each components within the view
     */
    modelService = {
      model: {
        profiles: [],
        status: [],
      },
      currentProfile: 0,
      currentView: 0,
      currentTab: 0,
    };

    /*
     * Select the profile to use.
     * @access public
     */
    modelService.setCurrentProfile = function setCurrentProfile(profileIndex) {
      modelService.currentProfile = profileIndex;
    };

    /*
     * Set the current view
     * @access public
     */
    modelService.setCurrentView = function setCurrentView(viewIndex) {
      modelService.currentView = viewIndex;
      $rootScope.$broadcast('ModelService.onChange', 'view');
    };

    /*
     * Set the current tab
     * @access public
     */
    modelService.setCurrentTab = function setCurrentTab(tabIndex) {
      modelService.currentTab = tabIndex;
      $rootScope.$broadcast('ModelService.onChange', 'tab');
    };

    /*
     * Get the previously selected profile with setProfile
     * @access public
     * @returns Profile object
     */
    modelService.getCurrentProfile = function getCurrentProfile() {
      return modelService.model.profiles[modelService.currentProfile];
    };

    /*
     * Get the selected View from the selected Profile
     * @access public
     * @returns View object
     */
    modelService.getCurrentView = function getCurrentView() {
      return modelService.model
              .profiles[modelService.currentProfile]
              .views[modelService.currentView];
    };

    /*
     * Get the selected Tab from the selected View from the selected Profile
     * @access public
     * @returns Tab object
     */
    modelService.getCurrentTab = function getCurrentTab() {
      return modelService.model
               .profiles[modelService.currentProfile]
               .views[modelService.currentView]
               .tabs[modelService.currentTab];
    };

    /*
     * Return the list of profiles
     * @access public
     * @returns list of Profile object
     */
    modelService.getProfiles = function getProfiles() {
      return modelService.model.profiles;
    };

    /*
     * Return the list of views from the selected Profile
     * @access public
     * @returns list of View object
     */
    modelService.getCurrentViews = function getCurrentViews() {
      return modelService.model
              .profiles[modelService.currentProfile]
              .views;
    };

    /*
     * Return the list of tabs from the selected View and Profile
     * @access public
     * @returns list of Tab object
     */
    modelService.getCurrentTabs = function getCurrentTabs() {
      return modelService.model
               .profiles[modelService.currentProfile]
               .views[modelService.currentView]
               .tabs;
    };

    /*
     * Update the internal model form the one provided in parameter. Preserve
     * references as much as possible.
     * @access public
     */
    modelService.update = function update(updatedModel) {
      // Deep copy/Recursive merge
      lodash.assign(modelService.model, updatedModel);
      console.log('model:', modelService.model);
    };

    /*
     * Select components by their id
     * @access public
     * @return Component
     */
    modelService.getComponent = function getComponent(id) {
      if (!modelService.model.actions.hasOwnProperty(id)) {
        logService.error('Component ' + id + ' is unknown');
      }
      return modelService.model.actions[id];
    };
    return modelService;
  };

  return modelServiceFactory;
});
