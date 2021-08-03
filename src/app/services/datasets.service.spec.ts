import { TestBed } from '@angular/core/testing';

import { DatasetsService } from './datasets.service';

describe('DatasetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetsService = TestBed.get(DatasetsService);
    expect(service).toBeTruthy();
  });
});
