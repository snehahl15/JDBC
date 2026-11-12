package com.xworkz.netflix;

import com.xworkz.netflix.dao.MoviesDao;
import com.xworkz.netflix.dao.MoviesDaoImpl;
import com.xworkz.netflix.dto.MovieDto;

public class NetflixRunner {

    public static void main(String[] args) {
        MovieDto movieDto = new MovieDto();
        movieDto.setId(1);
        movieDto.setName("Ramayanam");
        movieDto.setRatings(5);

        MoviesDao moviesDao = new MoviesDaoImpl();

      String dfg =  moviesDao.saveMovie( movieDto);
        System.out.println(dfg);


    }
}
