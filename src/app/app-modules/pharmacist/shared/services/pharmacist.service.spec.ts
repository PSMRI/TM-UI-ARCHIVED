import { TestBed, inject } from '@angular/core/testing';

import { PharmacistService } from './pharmacist.service';

describe('PharmacistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PharmacistService]
    });
  });

  it('should be created', inject([PharmacistService], (service: PharmacistService) => {
    expect(service).toBeTruthy();
  }));
});
