import { TestBed } from '@angular/core/testing';

import { Votations } from './votation';

describe('Votation', () => {
  let service: Votations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Votations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
