import { TestBed, inject } from '@angular/core/testing';

import { IotService } from './iot.service';

describe('IotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IotService]
    });
  });

  it('should be created', inject([IotService], (service: IotService) => {
    expect(service).toBeTruthy();
  }));
});
