import { TestBed } from '@angular/core/testing';

import { GlpiService } from './glpi.service';

describe('GlpiService', () => {
  let service: GlpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
