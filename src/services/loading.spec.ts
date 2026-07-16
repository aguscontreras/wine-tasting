import { TestBed } from '@angular/core/testing';

import { Loading } from './loading';

describe('Loading', () => {
  let service: Loading;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Loading);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show and hide the loading overlay', () => {
    expect(service.visible()).toBe(false);

    service.show();
    expect(service.visible()).toBe(true);

    service.hide();
    expect(service.visible()).toBe(false);
  });

  it('should support nested show calls', () => {
    service.show();
    service.show();

    service.hide();
    expect(service.visible()).toBe(true);

    service.hide();
    expect(service.visible()).toBe(false);
  });

  it('should not go below zero on hide', () => {
    service.hide();
    expect(service.visible()).toBe(false);
  });

  it('should update the loading message', () => {
    service.show('Conectando...');
    expect(service.message()).toBe('Conectando...');
  });
});
