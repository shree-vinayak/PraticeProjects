package com.astute.discom.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.discom.dtos.Subdivision;
import com.astute.discom.models.SubdivisionDto;
import com.astute.discom.repository.ZoneDao;
import com.astute.electrical.repository.SubDivisionDao;
import com.astute.util.DiscomUtil;

@Component
@Transactional
public class SubDivisionApiAdaptor {

	@Autowired
	private SubDivisionDao subDivisionDao;

	@Autowired
	private ZoneDao zoneDao;

	@Autowired
	private DiscomUtil util;

	public Subdivision addSubDivision(Subdivision subdivision) {
		try {
			SubdivisionDto subdivisionDto = util.copyRequestObjectForSubdivision(subdivision);
			subdivisionDto.setStartDate(new Date(System.currentTimeMillis()));
			subdivisionDto.setEndDate(new Date(System.currentTimeMillis()));
			subdivisionDto.setIsActive(true);
			subdivisionDto = subDivisionDao.save(subdivisionDto);
			return util.copyResponseObjectForSubdivision(subdivisionDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Subdivision deleteSubDivision(Integer id) {
		try {
			Integer count = zoneDao.getCount(id);
			if (count <= 0) {
				SubdivisionDto subdivisionDto = subDivisionDao.findSubdivision(id);
				subdivisionDto.setIsActive(false);
				subdivisionDto.setEndDate(new Date(System.currentTimeMillis()));
				subdivisionDto = subDivisionDao.save(subdivisionDto);
				return util.copyResponseObjectForSubdivision(subdivisionDto);
			}
			return null;

		} catch (Exception e) {
			return null;
		}
	}

	public List<Subdivision> getAllSubDivision(Integer idDivision) {
		try {
			List<SubdivisionDto> listSubDivisionDto = subDivisionDao.findSubDivisionByDivisionId(idDivision);
			List<Subdivision> listSubDivision = new ArrayList<Subdivision>();
			Iterator<SubdivisionDto> itr = listSubDivisionDto.iterator();
			while (itr.hasNext()) {
				SubdivisionDto subdivisionDto = itr.next();
				Subdivision subDivision = util.copyResponseObjectForSubdivision(subdivisionDto);
				listSubDivision.add(subDivision);
			}
			return listSubDivision;
		} catch (Exception e) {
			return null;
		}
	}

	public Subdivision getSubDivision(Integer id) {
		try {
			SubdivisionDto subdivisionDto = subDivisionDao.findSubdivision(id);
			return util.copyResponseObjectForSubdivision(subdivisionDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Integer getSubdivisionsCount(Integer idDivision) {
		try {
			Integer count = subDivisionDao.getCount(idDivision);
			if (count > 0) {
				return count;
			}
			return 0;
		} catch (Exception e) {
			return null;
		}
	}

	public Subdivision updateSubDivision(Subdivision subdivision) {
		try {
			SubdivisionDto subdivisionDto = util.copyRequestObjectForSubdivision(subdivision);
			SubdivisionDto subdivisionDto1 = subDivisionDao.findSubdivision(subdivisionDto.getIdSubdivision());
			subdivisionDto.setStartDate(subdivisionDto1.getStartDate());
			subdivisionDto.setEndDate(subdivisionDto1.getEndDate());
			subdivisionDto.setIsActive(subdivisionDto1.getIsActive());
			subdivisionDto = subDivisionDao.save(subdivisionDto);
			return util.copyResponseObjectForSubdivision(subdivisionDto);
		} catch (Exception e) {
			return null;
		}
	}

	public List<Subdivision> getSubdivision(String name) {
		try {
			List<SubdivisionDto> listSubdivisionDtos = subDivisionDao.findByName(name);
			List<Subdivision> listSubdivisions = new ArrayList<Subdivision>();
			Iterator<SubdivisionDto> itr = listSubdivisionDtos.iterator();
			while (itr.hasNext()) {
				SubdivisionDto subdivisionDto = itr.next();
				Subdivision subdivision = util.copyResponseObjectForSubdivision(subdivisionDto);
				listSubdivisions.add(subdivision);
			}
			return listSubdivisions;
		} catch (Exception e) {
			return null;
		}
	}

}
