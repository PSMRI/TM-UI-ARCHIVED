import { TestBed, inject } from '@angular/core/testing';

import { TestInVitalsService } from './test-in-vitals.service';

describe('TestInVitalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestInVitalsService]
    });
  });

  it('should be created', inject([TestInVitalsService], (service: TestInVitalsService) => {
    expect(service).toBeTruthy();
  }));
});
