package com.aartek.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aartek.location.model.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {

}
