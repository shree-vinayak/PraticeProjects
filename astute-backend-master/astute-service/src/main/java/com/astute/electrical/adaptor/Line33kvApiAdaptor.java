package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.astute.electrical.dtos.Line33kv;
import com.astute.electrical.models.Line33kvDto;
import com.astute.electrical.repository.Line33kvDao;
import com.astute.electrical.repository.Line33kvPtrMappingDao;
import com.astute.electrical.repository.Substation33kvlineMappingDao;
import com.astute.util.UtilElectrical;

@Component
public class Line33kvApiAdaptor {

	@Autowired
	private Line33kvDao line33kvDao;

	@Autowired
	private Substation33kvlineMappingDao substation33kvlineMappingDao;

	@Autowired
	private Line33kvPtrMappingDao line33kvPtrMappingDao;

	@Autowired
	private UtilElectrical utilElectrical;

	@Transactional
	public Line33kv addLine33kv(Line33kv line33kv) {
		try {
			Line33kvDto line33kvDto = utilElectrical.copyRequestObjectForLine33kv(line33kv);
			line33kvDto.setStartDate(new Date(System.currentTimeMillis()));
			line33kvDto.setEndDate(new Date(System.currentTimeMillis()));
			line33kvDto.setIsActive(true);
			line33kv = utilElectrical.copyResponseObjectForLine33kv(line33kvDao.save(line33kvDto));
			return line33kv;
		} catch (Exception e) {
			return null;
		}

	}

	@Transactional
	public Boolean disableLine33kv(Integer id) {

		try {
			Integer count = substation33kvlineMappingDao.getCount(id);
			Integer count1 = line33kvPtrMappingDao.getCount(id);

			if (count <= 0 && count1 <= 0) {
				Line33kvDto line33kvDto = line33kvDao.findByIds(id);
				line33kvDto.setIsActive(false);
				line33kvDto.setEndDate(new Date(System.currentTimeMillis()));
				line33kvDto = line33kvDao.save(line33kvDto);
				return true;
			}
			return false;
		} catch (Exception e) {
			return false;
		}
	}

	public List<Line33kv> getAllLine33kv() {
		try {
			List<Line33kvDto> line33kvDtosList = line33kvDao.findAllActiveLine33kv();
			List<Line33kv> line33kvList = new ArrayList<Line33kv>();
			Iterator<Line33kvDto> itr = line33kvDtosList.iterator();
			while (itr.hasNext()) {
				Line33kvDto line33kvDto = itr.next();
				Line33kv line33kv = utilElectrical.copyResponseObjectForLine33kv(line33kvDto);
				line33kvList.add(line33kv);
			}
			return line33kvList;
		} catch (Exception e) {
			return null;
		}

	}

	public Line33kv getLine33kvById(Integer line33kvId) {
		try {
			Line33kvDto line33kvDto = line33kvDao.findByIds(line33kvId);
			return utilElectrical.copyResponseObjectForLine33kv(line33kvDto);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	// To update the Line33kv
	public Line33kv updateLine33kv(Line33kv line33kv) {
		try {
			Line33kvDto line33kvDto = utilElectrical.copyRequestObjectForLine33kv(line33kv);

			Line33kvDto line33kvDto1 = line33kvDao.findByIds(line33kvDto.getLine33kvId());

			if (line33kvDto.getEhvSsId() != null)
				line33kvDto1.setEhvSsId(line33kvDto.getEhvSsId());

			if (line33kvDto.getName() != null && !line33kvDto.getName().trim().isEmpty())
				line33kvDto1.setName(line33kvDto.getName());

			line33kv = utilElectrical.copyResponseObjectForLine33kv(line33kvDao.save(line33kvDto1));
			return line33kv;
		} catch (Exception e) {
			return null;
		}
	}

}
