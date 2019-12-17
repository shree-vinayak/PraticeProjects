import { TestBed, inject } from '@angular/core/testing';

import { IdeasSuggestionService } from './ideas-suggestion.service';

describe('IdeasSuggestionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdeasSuggestionService]
    });
  });

  it('should be created', inject([IdeasSuggestionService], (service: IdeasSuggestionService) => {
    expect(service).toBeTruthy();
  }));
});
