import { TestBed } from '@angular/core/testing';

import { Cata } from './cata';

describe('Cata', () => {
  let service: Cata;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cata);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
