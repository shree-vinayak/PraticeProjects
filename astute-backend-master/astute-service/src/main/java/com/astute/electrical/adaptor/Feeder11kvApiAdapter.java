package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.astute.customClasses.CustomPtrFeeder11kv;
import com.astute.electrical.dtos.Feeder11kv;
import com.astute.electrical.dtos.Feeder11kvPtrMapping;
import com.astute.electrical.models.Feeder11kvDto;
import com.astute.electrical.models.Feeder11kvPtrMappingDto;
import com.astute.electrical.models.FeederSupplyDto;
import com.astute.electrical.models.FeederTypeDto;
import com.astute.electrical.models.SubstationFeeder11kvMappingDto;
import com.astute.electrical.models.VendorDto;
import com.astute.electrical.models.ZoneFeeder11kvMappingDto;
import com.astute.electrical.repository.Feeder11kvDao;
import com.astute.electrical.repository.Feeder11kvDtrMappingDao;
import com.astute.electrical.repository.Feeder11kvPtrMappingDao;
import com.astute.electrical.repository.FeederSupplyDao;
import com.astute.electrical.repository.FeederTypeDao;
import com.astute.electrical.repository.PtrDao;
import com.astute.electrical.repository.SubstationFeeder11kvMappingDao;
import com.astute.electrical.repository.VendorDao;
import com.astute.electrical.repository.ZoneFeeder11kvMappingDao;
import com.astute.util.UtilElectrical;

@Component
public class Feeder11kvApiAdapter {
	@Autowired
	private UtilElectrical utilElectrical;
	@Autowired
	private Feeder11kvDao feeder11kvDao;

	@Autowired
	private PtrDao ptrDao;

	@Autowired
	private Feeder11kvDtrMappingDao feeder11kvDtrMappingDao;

	@Autowired
	private Feeder11kvPtrMappingDao feeder11kvPtrMappingDao;

	@Autowired
	private ZoneFeeder11kvMappingDao zoneFeeder11kvDao;

	@Autowired
	private SubstationFeeder11kvMappingDao substationFeeder11kvMappingDao;

	@Autowired
	private FeederSupplyDao feederSupplyDao;

	@Autowired
	private FeederTypeDao feederTypeDao;

	@Autowired
	private VendorDao vendorDao;

	@Transactional
	public Feeder11kv addFeeder11kv(Feeder11kv feeder11kv) {
		try {
			Feeder11kvDto feeder11kvDto = utilElectrical.copyRequestObjectForFeeder11kv(feeder11kv);
			feeder11kvDto.setStartDate(new Date(System.currentTimeMillis()));
			feeder11kvDto.setEndDate(new Date(System.currentTimeMillis()));
			feeder11kvDto.setIsActive(true);
			feeder11kv = utilElectrical.copyResponseObjectForFeeder11kv(feeder11kvDao.save(feeder11kvDto));
			return feeder11kv;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Boolean disableFeeder11kv(Integer feederId) {
		try {
			Integer count = feeder11kvDtrMappingDao.getCount(feederId);
			if (count == 0) {
				Feeder11kvDto feeder11kvDto = feeder11kvDao.findFeeder11kvDtoById(feederId);
				feeder11kvDto.setIsActive(false);
				feeder11kvDto.setEndDate(new Date(System.currentTimeMillis()));

				List<Feeder11kvPtrMappingDto> feeder11kvPtrMappingDtos = feeder11kvDto.getFeeder11kvPtrMapping();
				Iterator<Feeder11kvPtrMappingDto> itr = feeder11kvPtrMappingDtos.iterator();
				while (itr.hasNext()) {
					Feeder11kvPtrMappingDto feeder11kvPtrMappingDto = itr.next();
					feeder11kvPtrMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					feeder11kvPtrMappingDto.setIsActive(false);
				}

				List<ZoneFeeder11kvMappingDto> zoneFeeder11kvMappingDtos = feeder11kvDto.getZoneFeeder11kvMapping();
				Iterator<ZoneFeeder11kvMappingDto> itr1 = zoneFeeder11kvMappingDtos.iterator();
				while (itr1.hasNext()) {
					ZoneFeeder11kvMappingDto zoneFeeder11kvMappingDto = itr1.next();
					zoneFeeder11kvMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					zoneFeeder11kvMappingDto.setIsActive(false);
				}

				List<SubstationFeeder11kvMappingDto> substationFeeder11kvMappingDtos = feeder11kvDto
						.getSsFeeder11kvMapping();
				Iterator<SubstationFeeder11kvMappingDto> itr2 = substationFeeder11kvMappingDtos.iterator();
				while (itr2.hasNext()) {
					SubstationFeeder11kvMappingDto substationFeeder11kvMappingDto = itr2.next();
					substationFeeder11kvMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					substationFeeder11kvMappingDto.setIsActive(false);
				}
				feeder11kvDao.save(feeder11kvDto);

				return true;
			}
			return false;
		} catch (Exception e) {
			return false;
		}

	}

	public List<FeederSupplyDto> getFeederSupply() {
		try {
			List<FeederSupplyDto> feederSupplyDtos = feederSupplyDao.findAll();
			return feederSupplyDtos;
		} catch (Exception e) {
			return null;
		}
	}

//	public CustomPtrFeeder11kv getFeeder11kvByPtrId(Integer ptrId) {
//
//		CustomPtrFeeder11kv customPtrFeeder11kvs = new CustomPtrFeeder11kv();
//		List<Object[]> PtrDto = ptrDao.getPtrByPtrId(ptrId);
//		Iterator<Object[]> itr = PtrDto.iterator();
//		while (itr.hasNext()) {
//			Object[] o = itr.next();
//			customPtrFeeder11kvs.setPtrId((Integer) o[0]);
//			customPtrFeeder11kvs.setName((String) o[1]);
//		}
//		List<Feeder11kv> feeder11kvsList = new ArrayList<Feeder11kv>();
//		List<Feeder11kvPtrMappingDto> feeder11kvPtrMappingDtos = feeder11kvPtrMappingDao
//				.feeder11kvPtrMappingDtoByPtrId(ptrId);
//		Iterator<Feeder11kvPtrMappingDto> iterator = feeder11kvPtrMappingDtos.iterator();
//		while (iterator.hasNext()) {
//			Feeder11kvPtrMappingDto feeder11kvPtrMappingDto = iterator.next();
//			Feeder11kvDto feeder11kvDto = feeder11kvDao
//					.findFeeder11kvDtoById(feeder11kvPtrMappingDto.getFeeder11kvId());
//			Feeder11kv feeder11kv = utilElectrical.copyResponseObjectForFeeder11kv(feeder11kvDto);
//			feeder11kvsList.add(feeder11kv);
//
//		}
//		customPtrFeeder11kvs.setFeeder11kvList(feeder11kvsList);
//		return customPtrFeeder11kvs;
//
//	}

	public HashMap<String, Object> getFeeder11kvByPtrId(Integer ptrId) {

		try {
			HashMap<String, Object> customPtrFeeder11kvs = new HashMap<String, Object>();
			List<Object[]> PtrDto = ptrDao.getPtrByPtrId(ptrId);
			Iterator<Object[]> itr = PtrDto.iterator();
			while (itr.hasNext()) {
				Object[] o = itr.next();
				customPtrFeeder11kvs.put("ptrId", (Integer) o[0]);
				customPtrFeeder11kvs.put("name", (String) o[1]);
			}
			List<Feeder11kv> feeder11kvsList = new ArrayList<Feeder11kv>();
			List<Feeder11kvPtrMappingDto> feeder11kvPtrMappingDtos = feeder11kvPtrMappingDao
					.feeder11kvPtrMappingDtoByPtrId(ptrId);
			Iterator<Feeder11kvPtrMappingDto> iterator = feeder11kvPtrMappingDtos.iterator();
			while (iterator.hasNext()) {
				Feeder11kvPtrMappingDto feeder11kvPtrMappingDto = iterator.next();
				Feeder11kvDto feeder11kvDto = feeder11kvDao
						.findFeeder11kvDtoById(feeder11kvPtrMappingDto.getFeeder11kvId());
				Feeder11kv feeder11kv = utilElectrical.copyResponseObjectForFeeder11kv(feeder11kvDto);
				feeder11kvsList.add(feeder11kv);

			}
			customPtrFeeder11kvs.put("feeder11kvList", feeder11kvsList);
			return customPtrFeeder11kvs;
		} catch (Exception e) {
			return null;
		}

	}

	public Feeder11kv updateFeeder11kv(Feeder11kv feeder11kv) {
		try {
			Feeder11kvDto feeder11kvDto = feeder11kvDao.findFeeder11kvDtoById(feeder11kv.getFeeder11kvId());
			if (feeder11kv.getName() != null && !feeder11kv.getName().trim().isEmpty())
				feeder11kvDto.setName(feeder11kv.getName());

			if (feeder11kv.getFeederType() != null && !feeder11kv.getFeederType().trim().isEmpty())
				feeder11kvDto.setFeederType(feeder11kv.getFeederType());

			if (feeder11kv.getFeederSupply() != null && !feeder11kv.getFeederSupply().trim().isEmpty())
				feeder11kvDto.setFeederSupply(feeder11kv.getFeederSupply());

			if (feeder11kv.getFeeder11kvPtrMapping() != null && !feeder11kv.getFeeder11kvPtrMapping().isEmpty()) {
				List<Feeder11kvPtrMapping> feeder11kvPtrMappingList = feeder11kv.getFeeder11kvPtrMapping();
				List<Feeder11kvPtrMappingDto> feeder11kvPtrMappingDtoList = feeder11kvDto.getFeeder11kvPtrMapping();
				List<Feeder11kvPtrMappingDto> feeder11kvPtrMappingDtoResult = new ArrayList<Feeder11kvPtrMappingDto>();
				Iterator<Feeder11kvPtrMapping> Itr = feeder11kvPtrMappingList.iterator();
				while (Itr.hasNext()) {
					Feeder11kvPtrMapping feeder11kvPtrMapping = Itr.next();
					if (feeder11kvPtrMapping.getFeeder11kvPtrMappingId() != null) {
						for (Feeder11kvPtrMappingDto feeder11kvPtrMappingDto : feeder11kvPtrMappingDtoList) {
							if (feeder11kvPtrMappingDto.getFeeder11kvPtrMappingId() == feeder11kvPtrMapping
									.getFeeder11kvPtrMappingId()) {
								feeder11kvPtrMappingDtoResult.add(feeder11kvPtrMappingDto);
							}
						}
					} else {
						Feeder11kvPtrMappingDto feeder11kvPtrMappingDto = new Feeder11kvPtrMappingDto();
						feeder11kvPtrMappingDto.setFeeder11kvId(feeder11kvPtrMapping.getFeeder11kvId());
						feeder11kvPtrMappingDto.setPtrId(feeder11kvPtrMapping.getPtrId());
						feeder11kvPtrMappingDto.setStartDate(new Date(System.currentTimeMillis()));
						feeder11kvPtrMappingDto.setEndDate(new Date(System.currentTimeMillis()));
						feeder11kvPtrMappingDto.setIsActive(true);
						feeder11kvPtrMappingDtoResult.add(feeder11kvPtrMappingDto);
					}
				}
				feeder11kvDto.setFeeder11kvPtrMapping(feeder11kvPtrMappingDtoResult);
			}

			Feeder11kvDto f1 = feeder11kvDao.save(feeder11kvDto);
			try {

				feeder11kvPtrMappingDao.deleteWhereIdIsNull();

			} catch (Exception e) {
				return utilElectrical.copyResponseObjectForFeeder11kv(f1);
			}
			return utilElectrical.copyResponseObjectForFeeder11kv(f1);
		} catch (Exception e) {
			return null;
		}
	}

	public List<Feeder11kv> getFeeder11kvBySubstationId(Integer substationId) {
		try {
			List<Feeder11kv> feeder11kvsList = new ArrayList<Feeder11kv>();
			List<Integer> integers = substationFeeder11kvMappingDao.getFeeder11kvIdsBySubstationId(substationId);
			Iterator<Integer> itr = integers.iterator();
			while (itr.hasNext()) {
				Integer i = itr.next();
				Feeder11kvDto feeder11kvDto = feeder11kvDao.findFeeder11kvDtoById(i);
				Feeder11kv feeder11kv = utilElectrical.copyResponseObjectForFeeder11kv(feeder11kvDto);
				feeder11kvsList.add(feeder11kv);
			}

			return feeder11kvsList;
		} catch (Exception e) {
			return null;
		}
	}

	public List<Feeder11kv> getFeeder11kvByZoneId(Integer zoneId) {
		try {
			List<Feeder11kv> feeder11kvsList = new ArrayList<Feeder11kv>();
			List<Integer> integers = zoneFeeder11kvDao.getFeederKvIdsByZoneId(zoneId);
			Iterator<Integer> itr = integers.iterator();
			while (itr.hasNext()) {
				Integer i = itr.next();
				Feeder11kvDto feeder11kvDto = feeder11kvDao.findFeeder11kvDtoById(i);
				Feeder11kv feeder11kv = utilElectrical.copyResponseObjectForFeeder11kv(feeder11kvDto);
				feeder11kvsList.add(feeder11kv);
			}

			return feeder11kvsList;
		} catch (Exception e) {
			return null;
		}
	}

	public List<FeederTypeDto> getFeederType() {
		try {
			List<FeederTypeDto> feederTypeDtosList = feederTypeDao.findAll();
			return feederTypeDtosList;
		} catch (Exception e) {
			return null;
		}
	}

	public List<VendorDto> getAllVendor() {
		try {
			List<VendorDto> vendorDtos = vendorDao.findAll();
			return vendorDtos;
		} catch (Exception e) {
			return null;
		}
	}
}
