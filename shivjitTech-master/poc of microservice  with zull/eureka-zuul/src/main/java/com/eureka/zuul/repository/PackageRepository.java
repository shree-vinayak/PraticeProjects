package com.eureka.zuul.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eureka.zuul.model.Pkg;

@Repository
public interface PackageRepository extends JpaRepository<Pkg, Long>{

	Pkg findByPkgName(String packageName);

}
