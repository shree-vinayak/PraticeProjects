package com.eureka.zuul.service;

import java.util.List;

import com.eureka.zuul.model.Pkg;
import com.eureka.zuul.results.ResultWrapper;

public interface PackageService {

	ResultWrapper<List<Pkg>> getAll();

	ResultWrapper<Pkg> createPkg(Pkg pkg);

}
