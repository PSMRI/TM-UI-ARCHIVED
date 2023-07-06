import { TestBed, inject } from '@angular/core/testing';

import { IdrsscoreService } from './idrsscore.service';

describe('IdrsscoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdrsscoreService]
    });
  });

  it('should be created', inject([IdrsscoreService], (service: IdrsscoreService) => {
    expect(service).toBeTruthy();
  }));
});
