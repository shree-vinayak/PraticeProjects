package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.customClasses.CustomSubstation;
import com.astute.electrical.dtos.Line33kv;
import com.astute.electrical.dtos.Substation;
import com.astute.electrical.dtos.Substation33kvlineMapping;
import com.astute.electrical.models.Line33kvDto;
import com.astute.electrical.models.Substation33kvlineMappingDto;
import com.astute.electrical.models.SubstationDto;
import com.astute.electrical.models.ZoneSubstationMappingDto;
import com.astute.electrical.repository.Line33kvDao;
import com.astute.electrical.repository.PtrDao;
import com.astute.electrical.repository.Substation33kvlineMappingDao;
import com.astute.electrical.repository.SubstationDao;
import com.astute.electrical.repository.SubstationDeviceMappingDao;
import com.astute.electrical.repository.SubstationFeeder11kvMappingDao;
import com.astute.electrical.repository.ZoneSubstationMappingDao;
import com.astute.util.UtilElectrical;

@Component
public class SubstationApiAdaptor {

	@Autowired
	private UtilElectrical utilElectrical;

	@Autowired
	private SubstationDao substationDao;

	@Autowired
	private Line33kvDao line33kvDao;

	@Autowired
	private ZoneSubstationMappingDao zoneSubstationMappingDao;

	@Autowired
	private SubstationDeviceMappingDao substationDeviceMappingDao;

	@Autowired
	private PtrDao ptrDao;

	@Autowired
	private SubstationFeeder11kvMappingDao substationFeeder11kvMappingDao;

	@Autowired
	private Substation33kvlineMappingDao substation33kvlineMappingDao;

	@Transactional
	// To save the substation
	public Substation addSubstation(Substation substation) {
		try {
			SubstationDto substationDto = utilElectrical.copyRequestObjectForSubstation(substation);
			substationDto.setStartDate(new Date(System.currentTimeMillis()));
			substationDto.setEndDate(new Date(System.currentTimeMillis()));
			substationDto.setIsActive(true);
			substation = utilElectrical.copyResponseObjectForSubstation(substationDao.save(substationDto));
			return substation;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	// To delete the substatoion
	public Boolean disableSubstation(Integer substationId) {
		try {
			Integer count1 = substationDeviceMappingDao.getCount(substationId);
			Integer count2 = ptrDao.getCount(substationId);
			Integer count3 = substationFeeder11kvMappingDao.getCount(substationId);

			if (count1 <= 0 && count2 <= 0 && count3 <= 0) {

				SubstationDto substationDto = substationDao.findSubstationDtoById(substationId);
				substationDto.setIsActive(false);
				substationDto.setEndDate(new Date(System.currentTimeMillis()));

				List<Substation33kvlineMappingDto> substation33kvlineMappingDtos = substationDto
						.getSubstation33kvlineMapping();
				Iterator<Substation33kvlineMappingDto> itr = substation33kvlineMappingDtos.iterator();
				while (itr.hasNext()) {
					Substation33kvlineMappingDto ehvSsCircleMappingDto = itr.next();
					ehvSsCircleMappingDto.setIsActive(false);
					ehvSsCircleMappingDto.setEndDate(new Date(System.currentTimeMillis()));
				}

				List<ZoneSubstationMappingDto> zoneSubstationMappingDtos = substationDto.getZoneSubstationMapping();
				Iterator<ZoneSubstationMappingDto> itr1 = zoneSubstationMappingDtos.iterator();
				while (itr1.hasNext()) {
					ZoneSubstationMappingDto zoneSubstationMappingDto = itr1.next();
					zoneSubstationMappingDto.setIsActive(false);
					zoneSubstationMappingDto.setEndDate(new Date(System.currentTimeMillis()));
				}
				substationDao.save(substationDto);
				return true;
			}
			return false;
		} catch (Exception e) {
			return false;
		}

	}

	public Substation getSubstationById(Integer substationId) {
		try {
			Substation substation = utilElectrical
					.copyResponseObjectForSubstation(substationDao.findSubstationDtoById(substationId));
			return substation;
		} catch (Exception e) {
			return null;
		}
	}

	public Substation updateSubstation(Substation substation) {
		try {
			SubstationDto substationDto = substationDao.findSubstationDtoById(substation.getSubstationId());

			if (substation.getName() != null && !substation.getName().trim().isEmpty())
				substationDto.setName(substation.getName());

			if (substation.getSubstation33kvlineMapping() != null
					&& !substation.getSubstation33kvlineMapping().isEmpty()) {
				List<Substation33kvlineMapping> substation33kvlineMappingList = substation
						.getSubstation33kvlineMapping();
				List<Substation33kvlineMappingDto> substation33kvlineMappingDtoList = substationDto
						.getSubstation33kvlineMapping();
				List<Substation33kvlineMappingDto> substation33kvlineMappingDtoResult = new ArrayList<Substation33kvlineMappingDto>();
				Iterator<Substation33kvlineMapping> Itr = substation33kvlineMappingList.iterator();
				while (Itr.hasNext()) {
					Substation33kvlineMapping substation33kvlineMapping = Itr.next();
					if (substation33kvlineMapping.getSubstation33kvlineMappingId() != null) {
						for (Substation33kvlineMappingDto substation33kvlineMappingDto : substation33kvlineMappingDtoList) {
							if (substation33kvlineMappingDto
									.getSubstation33kvlineMappingId() == substation33kvlineMapping
											.getSubstation33kvlineMappingId()) {
								substation33kvlineMappingDtoResult.add(substation33kvlineMappingDto);
							}
						}
					} else {
						Substation33kvlineMappingDto substation33kvlineMappingDto = new Substation33kvlineMappingDto();
						substation33kvlineMappingDto.setLine33kvId(substation33kvlineMapping.getLine33kvId());
						substation33kvlineMappingDto.setSubstationId(substation.getSubstationId());
						substation33kvlineMappingDto.setStartDate(new Date(System.currentTimeMillis()));
						substation33kvlineMappingDto.setEndDate(new Date(System.currentTimeMillis()));
						substation33kvlineMappingDto.setIsActive(true);
						substation33kvlineMappingDtoResult.add(substation33kvlineMappingDto);
					}
				}
				substationDto.setSubstation33kvlineMapping(substation33kvlineMappingDtoResult);
			}

			SubstationDto d1 = substationDao.save(substationDto);
			try {

				substation33kvlineMappingDao.deleteWhereIdIsNull();

			} catch (Exception e) {
				substation = utilElectrical.copyResponseObjectForSubstation(d1);
				return substation;
			}

			substation = utilElectrical.copyResponseObjectForSubstation(d1);
			return substation;
		} catch (Exception e) {
			return null;
		}

	}

	// To get all active lines according to the substationId
	public List<Line33kv> getLine33kvBySubstationId(Integer substationId) {
		try {
			List<Line33kv> line33kvList = new ArrayList<Line33kv>();
			List<Integer> integers = substation33kvlineMappingDao.getLine33kvIdsBySubstationId(substationId);
			Iterator<Integer> itr = integers.iterator();
			while (itr.hasNext()) {
				Integer i = itr.next();
				Line33kvDto line33kvDto = new Line33kvDto();
				line33kvDto = line33kvDao.findByIds(i);
				Line33kv line33kv = utilElectrical.copyResponseObjectForLine33kv(line33kvDto);
				line33kvList.add(line33kv);
			}
			return line33kvList;
		} catch (Exception e) {
			return null;
		}
	}

//To get all the the Substation 
	public List<CustomSubstation> getSubstationByZoneId(Integer zoneId) {
		if (zoneId != null) {
			List<ZoneSubstationMappingDto> substationIdList = zoneSubstationMappingDao.findSubstationByZoneId(zoneId);
			List<CustomSubstation> customSubstationList = new ArrayList<CustomSubstation>();
			if (!substationIdList.isEmpty()) {
				List<SubstationDto> substationList = new ArrayList<SubstationDto>();
				Iterator<ZoneSubstationMappingDto> itr = substationIdList.iterator();

				while (itr.hasNext()) {
					ZoneSubstationMappingDto zoneSubstationMappingDto = itr.next();
					if (zoneSubstationMappingDto.getSubstationId() != null) {
						SubstationDto substationDto = substationDao
								.findSubstationDtoById(zoneSubstationMappingDto.getSubstationId());
						if (substationDto != null) {
							Substation substation = utilElectrical.copyResponseObjectForSubstation(substationDto);
							CustomSubstation customSubstation = new CustomSubstation();
							customSubstation.setName(substation.getName());
							customSubstation.setSubstationId(substation.getSubstationId());
							Set<Substation33kvlineMapping> substation33kvlineMappingSet = new HashSet();
							List<Substation33kvlineMapping> substation33kvlineMappinglist = substation
									.getSubstation33kvlineMapping();
							substation33kvlineMappingSet.addAll(substation33kvlineMappinglist);
							List<Substation33kvlineMapping> substation33kvlineMappinglist1 = new ArrayList<Substation33kvlineMapping>();
							substation33kvlineMappinglist1.addAll(substation33kvlineMappingSet);
							customSubstation.setSubstation33kvlineMapping(substation33kvlineMappinglist1);
							customSubstationList.add(customSubstation);
						}
					}

				}
				return customSubstationList;
			}
		}
		return null;
	}

}
