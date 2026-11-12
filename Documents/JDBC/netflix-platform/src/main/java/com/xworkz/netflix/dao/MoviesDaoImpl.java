package com.xworkz.netflix.dao;

import com.xworkz.netflix.dto.MovieDto;

public class MoviesDaoImpl implements MoviesDao{

    @Override
    public String saveMovie(MovieDto movieDto) {
        System.out.println(movieDto);

        return " data saved";
    }
}
