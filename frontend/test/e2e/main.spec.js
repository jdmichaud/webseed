describe('Webseed', function () {
  'use strict';

  it('shall have the proper title', function () {
    browser.get('http://localhost:8080/');

    expect(browser.getTitle()).toEqual('Webseed');
  });
});
