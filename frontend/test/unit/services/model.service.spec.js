require([], function () {
  'use strict';

  describe('modelService', function () {
    // The service being tested
    var modelService;
    // For spying on $broadcast
    var $rootScope;
    var logServiceMock = {
      debug: function () { },
      info: function () { },
      warn: function () { },
      error: function () { },
    };

    // Initialize the app
    beforeEach(module('WebseedApp'));
    // Configure the restServiceProvider
    beforeEach(module('WebseedApp', function ($provide) {
      $provide.value('logService', logServiceMock);
    }));
    beforeEach(inject(function (_$rootScope_, _modelService_) {
      // Retrieve the service to test
      modelService = _modelService_;
      $rootScope = _$rootScope_;
      $rootScope.$broadcast = jasmine.createSpy('$broadcast').and.callThrough();
    }));

    it('shall allow to set the current profile', function () {
      // Set a mock model
      modelService.model = {
        profiles: [
          { id: 'profile1' },
          { id: 'profile2' },
          { id: 'profile3' },
        ],
      };
      // Set the current profile
      modelService.setCurrentProfile(1);
      // Check the proper profile is returned
      expect(modelService.getCurrentProfile()).toEqual({ id: 'profile2' });
    });

    it('shall allow to set the current view and broadcast ModelService.onChange/view', function () {
      // Set a mock model
      modelService.model = {
        profiles: [{
          views: [
            { id: 'view1' },
            { id: 'view2' },
            { id: 'view3' },
          ],
        }],
      };
      modelService.setCurrentProfile(0);
      // Set the current view
      modelService.setCurrentView(2);
      // Check the proper view is returned
      expect(modelService.getCurrentView()).toEqual({ id: 'view3' });
      // Check event broadcasted
      expect($rootScope.$broadcast).toHaveBeenCalledWith('ModelService.onChange', 'view');
    });

    it('shall allow to set the current tab and broadcast ModelService.onChange/tab', function () {
      // Set a mock model
      modelService.model = {
        profiles: [{
          views: [{
            tabs: [
              { id: 'tab1' },
              { id: 'tab2' },
              { id: 'tab3' },
            ],
          }],
        }],
      };
      modelService.setCurrentProfile(0);
      modelService.setCurrentView(0);
      // Set the current view
      modelService.setCurrentTab(0);
      // Check the proper view is returned
      expect(modelService.getCurrentTab()).toEqual({ id: 'tab1' });
      // Check event broadcasted
      expect($rootScope.$broadcast).toHaveBeenCalledWith('ModelService.onChange', 'tab');
    });

    it('shall provide the list of profiles', function () {
      // Set a mock model
      var profileList = [
        { id: 'profile1' },
        { id: 'profile2' },
        { id: 'profile3' },
      ];
      modelService.model = {
        profiles: profileList,
      };
      // Get the list of profiles
      expect(modelService.getProfiles()).toBe(profileList);
    });

    it('shall provide the list of views of the current profile', function () {
      // Set a mock model
      var viewList = [
        { id: 'view1' }, { id: 'view2' },
      ];
      var profileList = [
        { id: 'profile1', views: viewList },
        { id: 'profile2', views: [{ id: 'view2' }, { id: 'view3' }] },
        { id: 'profile3', views: [{ id: 'view3' }, { id: 'view1' }] },
      ];
      modelService.model = {
        profiles: profileList,
      };
      // Set the current profile
      modelService.setCurrentProfile(0);
      // Get the list of views
      expect(modelService.getCurrentViews()).toBe(viewList);
    });

    it('shall provide the list of tabs of the current profile and view', function () {
      // Set a mock model
      var tabList = [
        { id: 'tab1' }, { id: 'tab2' },
      ];
      var viewList = [
        { id: 'view1' }, { id: 'view2', tabs: tabList },
      ];
      var profileList = [
        { id: 'profile1', views: viewList },
        { id: 'profile2', views: [{ id: 'view2' }, { id: 'view3' }] },
        { id: 'profile3', views: [{ id: 'view3' }, { id: 'view1' }] },
      ];
      modelService.model = {
        profiles: profileList,
      };
      // Set the current profile
      modelService.setCurrentProfile(0);
      // Set the current view
      modelService.setCurrentView(1);
      // Get the list of views
      expect(modelService.getCurrentTabs()).toBe(tabList);
    });

    it('shall provide a way to update the model', function () {
      // Set a mock model
      modelService.model = {
        someField: [
          { toto: 1 },
          { titi: 'titi' },
        ],
        someObject: { key: 'value' },
      };
      // Update the model
      var newValue = {
        someField: [
          { tutu: 'tutu' },
          { toto: 2 },
        ],
        someObject: { key: 'value2' },
      };
      modelService.update(newValue);
      // Check the new model
      expect(modelService.model).toEqual(newValue);
    });

    it('shall be able to provide a component by its id', function () {
      modelService.model = {
        actions: {
          storePhoto: {
            enabled: true,
            activeFeature: true,
          },
          recallPhoto: {
            enabled: false,
            activeFeature: false,
          },
        },
      };
      // Get component
      var component = modelService.getComponent('storePhoto');
      // Expected the proper component to be provided
      expect(component).toBe(modelService.model.actions.storePhoto);
    });
  });
});
