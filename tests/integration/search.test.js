import { describe, test, expect, beforeEach, vi, assert } from "vitest";

// =========================================================
// The beforeEach below sets up a mocked fetch and the DOM.
// It runs before every test in this file.
//
// - vi.resetModules() ensures each dynamic import gets a
//   fresh module that picks up the mocked fetch.
// - vi.stubGlobal("fetch", vi.fn()) replaces the global
//   fetch with a mock you can control per test.
// - The default mock returns { ok: true, Response: "False" }
//   so tests that do not override it still have a safe fallback.
// =========================================================

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal("fetch", vi.fn());
  fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ Response: "False" }),
  });
  document.body.innerHTML = `
    <form id="search-form">
      <div class="search-row">
        <input type="text" id="search-input" />
        <button type="submit">Sök</button>
      </div>
      <div class="filter-row">
        <select id="type-filter">
          <option value="">Alla</option>
          <option value="movie">Film</option>
          <option value="series">Serie</option>
          <option value="episode">Avsnitt</option>
        </select>
        <input type="number" id="year-filter" />
      </div>
    </form>
    <p id="result-info"></p>
    <div id="movie-list"></div>
  `;
});

// =========================================================
// G – Integration tests: model + view (no API mocking needed)
//
// These tests verify that data flows correctly from the model
// into the DOM via the view functions.
// Import SearchModel and renderMovies dynamically.
// =========================================================

describe("search results → model → view", () => {
  test("storing results in model and rendering shows movie cards", async () => {const{SearchModel}=await import('../../src/search-model.js');
const{renderMovies}=await import('../../src/search-view.js');
const model= new SearchModel();
model.setResults([{Title:'Batman Begins',Year:'2011',Type:'movie'},{Title:'Inception',Year:'2010',Type:'movie'}]);renderMovies(model.getResults());
const movieList=document.getElementById('movie-list');
expect(movieList.children.length).toBe(2);
expect(movieList.textContent).toContain('Batman Begins');
expect(movieList.textContent).toContain('Inception');
});

  test("renderMovies shows a placeholder message when given an empty array", async () => {const{renderMovies}=await import('../../src/search-view.js');
renderMovies([]);
const movieList=document.getElementById('movie-list');
expect(movieList.textContent).toContain('Inga resultat hittades')});

  test("showResultInfo displays the result count and search query", async () => {const{showResultInfo}=await import('../../src/search-view.js');
let resultInfo = document.getElementById("result-info");
showResultInfo(3,'Batman');
expect(resultInfo.textContent).toContain('3'); 
expect(resultInfo.textContent).toContain('Batman');})
});

// =========================================================
// VG – Integration tests: API mocking
//
// These tests verify that searchMovies calls the OMDB API
// correctly and handles responses and errors as expected.
//
// Use fetch.mockResolvedValueOnce({ ok: true, json: ... })
// to control what the API returns for each test.
//
// Required tests:
//   - searchMovies calls the API with the correct URL parameters
//   - searchMovies throws an error on a failed network response
//
// You should also identify at least one additional integration
// test that is meaningful for this application. Add it below.
// =========================================================

describe("searchMovies – API integration", () => {
  test("searchMovies calls the OMDB API with correct URL parameters", async () => {const {searchMovies}=await import('../../src/api-service.js'); 
fetch.mockResolvedValueOnce({ok:true,json:async()=>({response:true,search:[]})});
await searchMovies('Batman','movie','2011');
 expect(fetch).toHaveBeenCalledWith("https://www.omdbapi.com/?apikey=trilogy&s=Batman&type=movie&y=2011")})

  test("searchMovies throws on network error", async () => {
     const { searchMovies } = await import("../../src/api-service.js");
     fetch.mockResolvedValueOnce({ok:false});
     await expect(searchMovies()).rejects.toThrow('Nätverksfel vid sökning')
  });

  // Add your own test(s) here
  test('SearchMovies returns parsed JSON data when API responds successfully',async()=>{
    const {searchMovies}=await import('../../src/api-service.js');
    const fakeData={response:'True',search:[{Title:'Batman',Type:'movie',Year:'2020'}], totalResults: "1"}
    fetch.mockResolvedValueOnce({ok:true,json:async()=>fakeData});
    const result=await searchMovies('Batman');
    expect(result).toEqual(fakeData);
  })
});

