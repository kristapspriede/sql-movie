import _ from "lodash";
import { Database } from "../src/database";
import {
  selectGenreById,
  selectMovieById
} from "../src/queries/select";
import { minutes } from "./utils";

describe("Updates", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("08", "09");
    
  }, minutes(3));

  it(
    "should update genres",
    async done => {
      const genreId = 13;
      const query = `update genres
                    set genre = 'Love Story'
                    where id = ` + genreId;
      try {
        await db.update(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectGenreById(genreId));
      expect(row.genre).toBe("Love Story");

      done();
    },
    minutes(10)
  );
  it(
    "should update movies homepage",
    async done => {
      const movieId = 44;
      const query = `update movies
                    set homepage = 'https://www.warnerbros.com/movies/man-uncle/'
                    where id = ` + movieId;
      try {
        await db.update(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectMovieById(movieId));
      expect(row.homepage).toBe("https://www.warnerbros.com/movies/man-uncle/");

      done();
    },
    minutes(10)
  );
  it(
    "should update movies tagline",
    async done => {
      const movieId = 1;
      const query = `update movies
                    set tagline = ''
                    where id = ` + movieId;
      try {
        await db.update(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectMovieById(movieId));
      expect(row.tagline).toBe("");

      done();
    },
    minutes(10)
  );

  

});
