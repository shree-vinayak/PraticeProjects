package com.astute.discom.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.discom.dtos.Zone;
import com.astute.discom.models.ZoneDto;
import com.astute.discom.repository.ZoneDao;
import com.astute.util.DiscomUtil;

@Transactional
@Component
public class ZoneApiAdaptor {

	@Autowired
	private DiscomUtil util;

	@Autowired
	private ZoneDao zoneDao;

	public Zone addZone(Zone zone) {
		try {
			ZoneDto zoneDto = util.copyRequestObjectForZone(zone);
			zoneDto.setStartDate(new Date(System.currentTimeMillis()));
			zoneDto.setEndDate(new Date(System.currentTimeMillis()));
			zoneDto.setIsActive(true);
			zoneDto = zoneDao.save(zoneDto);
			return util.copyResponseObjectForZone(zoneDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Zone deleteZone(Integer id) {
		try {
			ZoneDto zoneDto = zoneDao.findZone(id);
			zoneDto.setIsActive(false);
			zoneDto.setEndDate(new Date(System.currentTimeMillis()));
			zoneDto = zoneDao.save(zoneDto);
			return util.copyResponseObjectForZone(zoneDto);

		} catch (Exception e) {
			return null;
		}
	}

	public List<Zone> getAllZone(Integer idSubdivision) {
		try {
			List<ZoneDto> listZoneDto = zoneDao.findZoneBySubDivisionId(idSubdivision);
			List<Zone> zoneList = new ArrayList<Zone>();
			Iterator<ZoneDto> itr = listZoneDto.iterator();
			while (itr.hasNext()) {
				ZoneDto zoneDto = itr.next();
				Zone zone = util.copyResponseObjectForZone(zoneDto);
				zoneList.add(zone);
			}
			return zoneList;
		} catch (Exception e) {
			return null;
		}
	}

	public Zone getZone(Integer id) {
		try {
			ZoneDto zoneDto = zoneDao.findZone(id);
			return util.copyResponseObjectForZone(zoneDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Integer getZonesCount(Integer idSubdivision) {
		try {
			Integer count = zoneDao.getCount(idSubdivision);
			if (count > 0) {
				return count;
			}
			return 0;
		} catch (Exception e) {
			return null;
		}
	}

	public Zone updateZone(Zone zone) {
		try {
			ZoneDto zoneDto = util.copyRequestObjectForZone(zone);
			ZoneDto zoneDto1 = zoneDao.findZone(zoneDto.getIdZone());
			zoneDto.setStartDate(zoneDto1.getStartDate());
			zoneDto.setEndDate(zoneDto1.getEndDate());
			zoneDto.setIsActive(zoneDto1.getIsActive());
			zoneDto = zoneDao.save(zoneDto);
			return util.copyResponseObjectForZone(zoneDto);
		} catch (Exception e) {
			return null;
		}
	}

	public List<Zone> getZone(String name) {

		try {
			List<ZoneDto> listZoneDto = zoneDao.findByName(name);
			List<Zone> listZone = new ArrayList<Zone>();
			Iterator<ZoneDto> itr = listZoneDto.iterator();
			while (itr.hasNext()) {
				ZoneDto zoneDto = itr.next();
				Zone zone = util.copyResponseObjectForZone(zoneDto);
				listZone.add(zone);
			}
			return listZone;
		} catch (Exception e) {
			return null;
		}
	}

}
