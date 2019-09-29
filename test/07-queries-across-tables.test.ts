import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(3));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async done => {
            const query = `select round(sum(budget_adj), 2) as total_budget, full_name as director
                          from movies 
                            join movie_directors
                                on movie_directors.movie_id = movies.id
                            join directors
                                on movie_directors.director_id = directors.id 
                            group by full_name
                            order by total_budget
                            desc
                            limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Steven Spielberg",
          total_budget: 2173663066.68
        },
        {
          director: "Ridley Scott",
          total_budget: 1740157354.14
        },
        {
          director: "Michael Bay",
          total_budget: 1501996071.5
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async done => {
            const query = `select keyword, count(*) as count 
                          from movies 
                            join movie_keywords
                                on movie_keywords.movie_id = movies.id
                            join keywords
                                on movie_keywords.keyword_id = keywords.id 
                            group by keyword
                            order by count desc
                            limit 10`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 411
        },
        {
          keyword: "independent film",
          count: 394
        },
        {
          keyword: "based on novel",
          count: 278
        },
        {
          keyword: "sex",
          count: 272
        },
        {
          keyword: "sport",
          count: 216
        },
        {
          keyword: "murder",
          count: 204
        },
        {
          keyword: "musical",
          count: 169
        },
        {
          keyword: "biography",
          count: 168
        },
        {
          keyword: "new york",
          count: 163
        },
        {
          keyword: "suspense",
          count: 157
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select one movie which has highest count of actors",
    async done => {
            const query = `select original_title, count(*) as count 
                          from movies 
                            join movie_actors
                                on movie_actors.movie_id = movies.id
                            join actors
                                on movie_actors.actor_id = actors.id 
                            group by original_title
                            order by count desc
                            limit 1`;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Hamlet",
        count: 20
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select three genres which has most ratings with 5 stars",
    async done => {
            const query = `select genre, count(*) as five_stars_count
                            from movies 
                            join movie_genres
                                on movie_genres.movie_id = movies.id
                            join genres
                                on movie_genres.genre_id = genres.id 
                            join movie_ratings
                                on movie_ratings.movie_id = movies.id
                            where rating = '5'
                            group by genre
                            order by five_stars_count desc
                            limit 3	`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 143663
        },
        {
          genre: "Thriller",
          five_stars_count: 96265
        },
        {
          genre: "Comedy",
          five_stars_count: 81184
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three genres ordered by average rating",
    async done => {
            const query = `select genre, round(sum(rating)/count(*), 2) as avg_rating
            from movies 
            join movie_genres
                on movie_genres.movie_id = movies.id
            join genres
                on movie_genres.genre_id = genres.id 
            join movie_ratings
                on movie_ratings.movie_id = movies.id
            group by genre
            order by avg_rating desc
            limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Western",
          avg_rating: 3.64
        },
        {
          genre: "Crime",
          avg_rating: 3.62
        },
        {
          genre: "Animation",
          avg_rating: 3.6
        }
      ]);

      done();
    },
    minutes(3)
  );
  it(
    "should select top three actors ordered by movie count",
    async done => {
            const query = `select full_name as actor, count(*) as count 
                          from movies 
                            join movie_actors
                              on movie_actors.movie_id = movies.id 
                            join actors
                              on actors.id = movie_actors.actor_id
                          group by actor
                          order by count desc
                          limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          actor: "Robert De Niro",
          count: 72
        },
        {
          actor: "Samuel L. Jackson",
          count: 71
        },
        {
          actor: "Bruce Willis",
          count: 62
        }
      ]);

      done();
    },
    minutes(3)
  );
  it(
    "should select top three movie companies ordered by movie count",
    async done => {
            const query = `select company_name, count(*) as count
                          from movies 
                            join movie_production_companies
                              on movie_production_companies.movie_id = movies.id 
                            join production_companies
                              on production_companies.id = movie_production_companies.company_id
                          group by company_name
                          order by count desc
                          limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          company_name: "Universal Pictures",
          count: 520
        },
        {
          company_name: "Warner Bros.",
          count: 506
        },
        {
          company_name: "Paramount Pictures",
          count: 430
        }
      ]);

      done();
    },
    minutes(3)
  );
  it(
    "should select top actor with longest movie runtime total",
    async done => {
            const query = `select full_name, sum(runtime) as total_runtime
                          from movies 
                          join movie_actors
                              on movie_actors.movie_id = movies.id
                          join actors
                              on movie_actors.actor_id = actors.id 
                          group by full_name
                          order by total_runtime desc
                          limit 1`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          full_name: "Robert De Niro",
          total_runtime: 8279
        }
      ]);

      done();
    },
    minutes(3)
  );
});
