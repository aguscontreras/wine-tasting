import { TestBed } from '@angular/core/testing';

import { Wines } from './wines';

describe('Wine', () => {
  let service: Wines;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Wines);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
