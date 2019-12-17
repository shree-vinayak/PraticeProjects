package com.astute.discom.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.discom.dtos.Division;
import com.astute.discom.models.DivisionDto;
import com.astute.discom.repository.DivisionDao;
import com.astute.electrical.repository.SubDivisionDao;
import com.astute.util.DiscomUtil;

@Transactional
@Component
public class DivisionApiAdaptor {

	@Autowired
	private DivisionDao divisionDao;

	@Autowired
	private SubDivisionDao subdivisionDao;

	@Autowired
	private DiscomUtil util;

	public Division addDivision(Division division) {
		try {
			DivisionDto divisionDto = util.copyRequestObjectForDivision(division);
			divisionDto.setStartDate(new Date(System.currentTimeMillis()));
			divisionDto.setEndDate(new Date(System.currentTimeMillis()));
			divisionDto.setIsActive(true);
			divisionDto = divisionDao.save(divisionDto);
			return util.copyResponseObjectForDivision(divisionDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Division deleteDivision(Integer id) {

		try {
			Integer count = subdivisionDao.getCount(id);
			if (count <= 0) {
				DivisionDto divisionDto = divisionDao.findDivision(id);
				divisionDto.setIsActive(false);
				divisionDto.setEndDate(new Date(System.currentTimeMillis()));
				divisionDto = divisionDao.save(divisionDto);
				return util.copyResponseObjectForDivision(divisionDto);
			}
			return null;
		} catch (Exception e) {
			return null;
		}
	}

	public List<Division> getAllDivision(Integer idCircle) {
		try {
			List<DivisionDto> listDivisionDto = divisionDao.findDivisionByCircleId(idCircle);
			List<Division> listDivision = new ArrayList<Division>();
			Iterator<DivisionDto> itr = listDivisionDto.iterator();
			while (itr.hasNext()) {
				DivisionDto divisionDto = itr.next();
				Division division = util.copyResponseObjectForDivision(divisionDto);
				listDivision.add(division);
			}
			return listDivision;
		} catch (Exception e) {
			return null;
		}

	}

	public Division getDivision(Integer id) {
		try {
			DivisionDto divisionDto = divisionDao.findDivision(id);
			return util.copyResponseObjectForDivision(divisionDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Integer getDivisionsCount(Integer idCircle) {
		try {
			Integer count = divisionDao.getCount(idCircle);
			if (count > 0) {
				return count;
			}
			return 0;
		} catch (Exception e) {
			return null;
		}
	}

	public Division updateDivision(Division division) {
		try {
			DivisionDto divisionDto = util.copyRequestObjectForDivision(division);
			DivisionDto divisionDto1 = divisionDao.findDivision(divisionDto.getIdDivision());
			divisionDto.setStartDate(divisionDto1.getStartDate());
			divisionDto.setEndDate(divisionDto1.getEndDate());
			divisionDto.setIsActive(divisionDto1.getIsActive());
			divisionDto = divisionDao.save(divisionDto);
			return util.copyResponseObjectForDivision(divisionDto);
		} catch (Exception e) {
			return null;
		}
	}

	public List<Division> getDivision(String name) {
		try {
			List<DivisionDto> listDivisionDto = divisionDao.findByName(name);
			List<Division> listDivision = new ArrayList<Division>();
			Iterator<DivisionDto> itr = listDivisionDto.iterator();
			while (itr.hasNext()) {
				DivisionDto divisionDto = itr.next();
				Division division = util.copyResponseObjectForDivision(divisionDto);
				listDivision.add(division);
			}
			return listDivision;
		} catch (Exception e) {
			return null;
		}

	}
}
