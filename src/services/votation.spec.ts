import { TestBed } from '@angular/core/testing';

import { Votation } from './votation';

describe('Votation', () => {
  let service: Votation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Votation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
