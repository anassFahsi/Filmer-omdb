import { describe, test, expect, beforeEach } from "vitest";
import { SearchModel } from "../../src/search-model.js";

// =========================================================
// G – Write all unit tests for SearchModel
//
// All tests below must pass for G.
// Each test should use the model instance created in beforeEach.
// =========================================================

describe("SearchModel", () => {
  let model;

  beforeEach(() => {
    model = new SearchModel();
  });

  test("getResults returns empty array by default", () => {expect(model.getResults()).toEqual([])});

  test("setResults and getResults stores and returns results", () => {const data=[{title:'Batman',year:2010,type:'movie'}];
  model.setResults(data);
  expect(model.getResults()).toEqual(data)
});

  test("getTotalResults returns 0 by default", () => {expect(model.getTotalResults()).toEqual(0)});

  test("setTotalResults and getTotalResults tracks count", () => {model.setTotalResults(5);
    expect(model.getTotalResults()).toBe(5)
  });

  test("getSearchQuery returns empty string by default", () => {expect(model.getSearchQuery()).toBe('')});

  test("setSearchQuery and getSearchQuery tracks query", () => {model.setSearchQuery('Batman');
    expect(model.getSearchQuery()).toBe('Batman')
  });

  test("getTypeFilter returns empty string by default", () => {expect(model.getTypeFilter()).toBe('')});

  test("setTypeFilter and getTypeFilter tracks type", () => {model.setTypeFilter('film');
    expect(model.getTypeFilter()).toBe('film')
  });

  test("getYear returns empty string by default", () => {expect(model.getYear()).toBe('')});

  test("setYear and getYear tracks year", () => {model.setYear('2011');
    expect(model.getYear()).toBe('2011')
  });

  test("reset clears all state", () => {model.setResults([{title:'Batman Begins'}]);
  model.setTotalResults(2);
  model.setTypeFilter('film');
  model.setSearchQuery('Batman');
  model.setYear('2011');
  model.reset();
  expect(model.getResults()).toEqual([]);
  expect(model.getSearchQuery()).toBe('');
  expect(model.getTotalResults()).toBe(0);
  expect(model.getTypeFilter()).toBe('');
  expect(model.getYear()).toBe('')
  });
});
