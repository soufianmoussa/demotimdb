import { TestBed } from '@angular/core/testing';

import { ForumStorageService } from './forum-storage.service';

describe('ForumStorageService', () => {
  let service: ForumStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForumStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
