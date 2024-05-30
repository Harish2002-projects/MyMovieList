# Movie Watch List App

## Overview

The **Movie Watch List App** is a React-based application that allows users to search for movies using an API, rate them, and add them to their personal watch list. 

## Features

- **Search Movies**: Users can search for movies using a search bar that queries an external movie API.
- **Rate Movies**: Users can rate movies before adding them to their watch list.
- **Add to Watch List**: Users can add movies to their watch list with a click of a button.
- **View Watch List**: Users can view their watch list with the ratings they assigned.

## Demo

![Screenshot 2024-05-30 114927](https://github.com/Harish2002-projects/MyMovieList/assets/123865573/ee70fc5c-31c6-4c9d-9533-e3130e696f98)
![Screenshot 2024-05-30 114943](https://github.com/Harish2002-projects/MyMovieList/assets/123865573/cdd84454-676e-4211-91b3-e84ab836053f)


## Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/yourusername/movie-watch-list-app.git
   cd movie-watch-list-app
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Create a `.env` file** in the root directory and add your API key:

   ```
   REACT_APP_MOVIE_API_KEY=your_api_key_here
   ```

4. **Start the development server**:

   ```sh
   npm start
   ```

## Usage

1. **Search for Movies**:
   - Enter a movie title in the search bar.
   - The app will fetch and display a list of movies matching the search query.

2. **Rate and Add Movies**:
   - Click on a movie to view more details.
   - Rate the movie using the provided rating system.
   - Click the "Add to Watch List" button to add the movie to your watch list.

3. **View Watch List**:
   - Navigate to the watch list to see all the movies you have added along with your ratings.

## Code Structure

- `src/components`: Contains all the React components.
  - `SearchBar.js`: Component for the search bar.
  - `MovieList.js`: Component for displaying the list of movies.
  - `MovieItem.js`: Component for displaying individual movie details.
  - `WatchList.js`: Component for displaying the user's watch list.
- `src/services`: Contains API service functions.
  - `api.js`: Contains functions to fetch movie data from the API.
- `src/App.js`: Main application component.

## API

The app uses the OMDb API - The Open Movie Database(http://www.omdbapi.com/?apikey=[yourkey]&) to fetch movie data. You need to sign up and get an API key to use it.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin my-feature-branch`.
5. Submit a pull request.

