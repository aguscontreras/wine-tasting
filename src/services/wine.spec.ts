import { TestBed } from '@angular/core/testing';

import { Wine } from './wine';

describe('Wine', () => {
  let service: Wine;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Wine);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
