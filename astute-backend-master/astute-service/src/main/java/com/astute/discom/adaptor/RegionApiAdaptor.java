package com.astute.discom.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.discom.dtos.Region;
import com.astute.discom.models.RegionDto;
import com.astute.discom.repository.CircleDao;
import com.astute.discom.repository.RegionDao;
import com.astute.util.DiscomUtil;

@Transactional
@Component
public class RegionApiAdaptor {

	@Autowired
	private CircleDao circleDao;

	@Autowired
	private RegionDao regionDao;

	@Autowired
	private DiscomUtil util;

	public Region addRegion(Region region) {
		try {
			RegionDto regionDto = util.copyRequestObjectForRegion(region);
			regionDto.setStartDate(new Date(System.currentTimeMillis()));
			regionDto.setEndDate(new Date(System.currentTimeMillis()));
			regionDto.setIsActive(true);
			regionDto = regionDao.save(regionDto);
			return util.copyResponseObjectForRegion(regionDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Region deleteRegion(Integer id) {
		try {
			Integer count = circleDao.getCount(id);
			if (count <= 0) {
				RegionDto regionDto = regionDao.findRegion(id);
				regionDto.setIsActive(false);
				regionDto.setEndDate(new Date(System.currentTimeMillis()));
				regionDto = regionDao.save(regionDto);
				return util.copyResponseObjectForRegion(regionDto);
			}
			return null;

		} catch (Exception e) {
			return null;
		}

	}

	public List<Region> getAllRegion(Integer idCompany) {
		try {
			List<RegionDto> listRegionDto = regionDao.findRegionByCompanyId(idCompany);
			List<Region> listRegion = new ArrayList<Region>();
			Iterator<RegionDto> itr = listRegionDto.iterator();
			while (itr.hasNext()) {
				RegionDto regionDto = itr.next();
				Region region = util.copyResponseObjectForRegion(regionDto);
				listRegion.add(region);
			}
			return listRegion;
		} catch (Exception e) {
			return null;
		}
	}

	public List<Region> getAllRegion() {
		try {
			List<RegionDto> listRegionDto = regionDao.findAllActiveRegion();
			List<Region> listRegion = new ArrayList<Region>();
			Iterator<RegionDto> itr = listRegionDto.iterator();
			while (itr.hasNext()) {
				RegionDto regionDto = itr.next();
				Region region = util.copyResponseObjectForRegion(regionDto);
				listRegion.add(region);
			}
			return listRegion;
		} catch (Exception e) {
			return null;
		}
	}

	public Region getRegion(Integer id) {
		try {
			RegionDto regionDto = regionDao.findRegion(id);
			return util.copyResponseObjectForRegion(regionDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Integer getRegionsCount(Integer idCompany) {
		try {
			Integer count = regionDao.getCount(idCompany);
			if (count > 0) {
				return count;
			}
			return 0;
		} catch (Exception e) {
			return null;
		}

	}

	// To update the region
	public Region updateRegion(Region region) {
		try {
			RegionDto regionDto = util.copyRequestObjectForRegion(region);
			RegionDto regionDto1 = regionDao.findRegion(regionDto.getIdRegion());
			regionDto.setStartDate(regionDto1.getStartDate());
			regionDto.setEndDate(regionDto1.getEndDate());
			regionDto.setIsActive(regionDto1.getIsActive());
			regionDto = regionDao.save(regionDto);
			return util.copyResponseObjectForRegion(regionDto);
		} catch (Exception e) {
			return null;
		}
	}

	// To get the region according to the name of the region
	public List<Region> getCompany(String name) {
		try {
			List<RegionDto> listRegionDto = regionDao.findByName(name);
			List<Region> listregion = new ArrayList<Region>();
			Iterator<RegionDto> itr = listRegionDto.iterator();
			while (itr.hasNext()) {
				RegionDto regionDto = itr.next();
				Region region = util.copyResponseObjectForRegion(regionDto);
				listregion.add(region);
			}
			return listregion;
		} catch (Exception e) {
			return null;
		}
	}

}
