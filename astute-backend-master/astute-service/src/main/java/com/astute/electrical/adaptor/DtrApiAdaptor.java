package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.astute.customClasses.CustomFeeder11kvDtr;
import com.astute.electrical.dtos.Dtr;
import com.astute.electrical.dtos.Feeder11kvDtrMapping;
import com.astute.electrical.models.DtrCapacityDto;
import com.astute.electrical.models.DtrDto;
import com.astute.electrical.models.DtrMakeDto;
import com.astute.electrical.models.Feeder11kvDtrMappingDto;
import com.astute.electrical.repository.DtrCapacityDao;
import com.astute.electrical.repository.DtrDao;
import com.astute.electrical.repository.DtrDtrDeviceMappingDao;
import com.astute.electrical.repository.DtrMakeDao;
import com.astute.electrical.repository.Feeder11kvDao;
import com.astute.electrical.repository.Feeder11kvDtrMappingDao;
import com.astute.util.UtilElectrical;

@Component

public class DtrApiAdaptor {

	@Autowired
	private UtilElectrical utilElectrical;

	@Autowired
	private DtrDao dtrDao;

	@Autowired
	private Feeder11kvDao feeder11kvDao;

	@Autowired
	private DtrDtrDeviceMappingDao dtrDtrDeviceMappingDao;

	@Autowired
	private Feeder11kvDtrMappingDao feeder11kvDtrMappingDao;

	@Autowired
	private DtrCapacityDao dtrCapacityDao;

	@Autowired
	private DtrMakeDao dtrMakeDao;

	@Transactional
	public Dtr addDtr(Dtr dtr) {
		try {
			DtrDto dtrDto = utilElectrical.copyRequestObjectForDtr(dtr);
			dtrDto.setStartDate(new Date(System.currentTimeMillis()));
			dtrDto.setEndDate(new Date(System.currentTimeMillis()));
			dtrDto.setIsActive(true);
			dtr = utilElectrical.copyResponseObjectForDtr(dtrDao.save(dtrDto));
			return dtr;
		} catch (Exception e) {
			return null;
		}

	}

	@Transactional
	public Boolean disableDtr(Integer DtrId) {
		try {
			Integer count = dtrDtrDeviceMappingDao.getCount(DtrId);
			if (count == 0) {
				DtrDto dtrDto = dtrDao.findByIds(DtrId);
				dtrDto.setIsActive(false);
				dtrDto.setEndDate(new Date(System.currentTimeMillis()));
				List<Feeder11kvDtrMappingDto> feeder11kvDtrMappingDtos = dtrDto.getFeeder11kvDtrMapping();
				Iterator<Feeder11kvDtrMappingDto> itr = feeder11kvDtrMappingDtos.iterator();
				while (itr.hasNext()) {
					Feeder11kvDtrMappingDto feeder11kvDtrMappingDto = itr.next();
					feeder11kvDtrMappingDto.setIsActive(false);
					feeder11kvDtrMappingDto.setEndDate(new Date(System.currentTimeMillis()));
				}
				dtrDao.save(dtrDto);

				return true;
			}
			return false;
		} catch (Exception e) {
			return false;
		}
	}

	public List<Dtr> getAllDtr() {
		try {
			List<DtrDto> dtrDtoList = dtrDao.findAll();
			List<Dtr> dtrList = new ArrayList<Dtr>();
			Iterator<DtrDto> itr = dtrDtoList.iterator();
			while (itr.hasNext()) {
				DtrDto dtrDto = itr.next();
				Dtr dtr = utilElectrical.copyResponseObjectForDtr(dtrDto);
				dtrList.add(dtr);
			}
			return dtrList;
		} catch (Exception e) {
			return null;
		}
	}

//	public CustomFeeder11kvDtr getAllDtrByFeederId(Integer feeder11kvId) {
//
//		CustomFeeder11kvDtr customFeeder11kvDtr = new CustomFeeder11kvDtr();
//		List<Object[]> listObject = feeder11kvDao.findByIds(feeder11kvId);
//		Iterator<Object[]> itr = listObject.iterator();
//		while (itr.hasNext()) {
//			Object[] o = itr.next();
//			customFeeder11kvDtr.setFeeder11kvId((Integer) o[0]);
//			customFeeder11kvDtr.setName((String) o[1]);
//		}
//		List<Integer> integers = feeder11kvDtrMappingDao.getDtrIdsByFeederId(feeder11kvId);
//		List<Dtr> dtrList = new ArrayList<Dtr>();
//		Iterator<Integer> itr1 = integers.iterator();
//		while (itr1.hasNext()) {
//			Integer i = itr1.next();
//			DtrDto dtrDto = dtrDao.findByIds(i);
//			Dtr dtr = utilElectrical.copyResponseObjectForDtr(dtrDto);
//			dtrList.add(dtr);
//		}
//		customFeeder11kvDtr.setDtrList(dtrList);
//		return customFeeder11kvDtr;
//	}

	public HashMap<String, Object> getAllDtrByFeederId(Integer feeder11kvId) {

		try {
			HashMap<String, Object> hash = new HashMap<>();
			List<Object[]> listObject = feeder11kvDao.findByIds(feeder11kvId);
			Iterator<Object[]> itr = listObject.iterator();
			while (itr.hasNext()) {
				Object[] o = itr.next();
				hash.put("feeder11kvId", (Integer) o[0]);
				hash.put("name", (String) o[1]);
			}
			List<Integer> integers = feeder11kvDtrMappingDao.getDtrIdsByFeederId(feeder11kvId);
			List<Dtr> dtrList = new ArrayList<Dtr>();
			Iterator<Integer> itr1 = integers.iterator();
			while (itr1.hasNext()) {
				Integer i = itr1.next();
				DtrDto dtrDto = dtrDao.findByIds(i);
				Dtr dtr = utilElectrical.copyResponseObjectForDtr(dtrDto);
				dtrList.add(dtr);
			}
			hash.put("dtrList", dtrList);
			return hash;
		} catch (Exception e) {
			return null;
		}
	}

	public Dtr updateDtr(Dtr dtr) {
		try {
			DtrDto dtrDto = dtrDao.findByIds(dtr.getDtrId());
			if (dtr.getName() != null && !dtr.getName().trim().isEmpty())
				dtrDto.setName(dtr.getName());

			if (dtr.getCapacity() != null && dtr.getCapacity().trim() != "")
				dtrDto.setCapacity(dtr.getCapacity());

			if (dtr.getMake() != null && dtr.getMake().trim() != "")
				dtrDto.setMake(dtr.getMake());

			if (dtr.getYearOfManufacturing() != null)
				dtrDto.setYearOfManufacturing(dtr.getYearOfManufacturing());

			if (dtr.getFeeder11kvDtrMapping() != null && !dtr.getFeeder11kvDtrMapping().isEmpty()) {
				List<Feeder11kvDtrMapping> feeder11kvDtrMappingList = dtr.getFeeder11kvDtrMapping();
				List<Feeder11kvDtrMappingDto> feeder11kvDtrMappingDtoList = dtrDto.getFeeder11kvDtrMapping();
				List<Feeder11kvDtrMappingDto> feeder11kvDtrMappingDtoResult = new ArrayList<Feeder11kvDtrMappingDto>();
				Iterator<Feeder11kvDtrMapping> Itr = feeder11kvDtrMappingList.iterator();
				while (Itr.hasNext()) {
					Feeder11kvDtrMapping feeder11kvDtrMapping = Itr.next();
					if (feeder11kvDtrMapping.getFeeder11kvDtrMappingId() != null) {
						for (Feeder11kvDtrMappingDto feeder11kvDtrMappingDto : feeder11kvDtrMappingDtoList) {
							if (feeder11kvDtrMappingDto.getFeeder11kvDtrMappingId() == feeder11kvDtrMapping
									.getFeeder11kvDtrMappingId()) {
								feeder11kvDtrMappingDtoResult.add(feeder11kvDtrMappingDto);
							}
						}
					} else {
						Feeder11kvDtrMappingDto feeder11kvDtrMappingDto = new Feeder11kvDtrMappingDto();
						feeder11kvDtrMappingDto.setFeeder11kvId(feeder11kvDtrMapping.getFeeder11kvId());
						feeder11kvDtrMappingDto.setDtrId(feeder11kvDtrMapping.getDtrId());
						feeder11kvDtrMappingDto.setStartDate(new Date(System.currentTimeMillis()));
						feeder11kvDtrMappingDto.setEndDate(new Date(System.currentTimeMillis()));
						feeder11kvDtrMappingDto.setIsActive(true);
						feeder11kvDtrMappingDtoResult.add(feeder11kvDtrMappingDto);
					}
				}
				dtrDto.setFeeder11kvDtrMapping(feeder11kvDtrMappingDtoResult);
			}

			DtrDto d1 = dtrDao.save(dtrDto);
			try {

				feeder11kvDtrMappingDao.deleteWhereIdIsNull();

			} catch (Exception e) {
				dtr = utilElectrical.copyResponseObjectForDtr(d1);
				return dtr;
			}

			dtr = utilElectrical.copyResponseObjectForDtr(d1);
			return dtr;
		} catch (Exception e) {
			return null;
		}
	}

	public Object getDtrById(Integer dtrId) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<DtrCapacityDto> getDtrCapacity() {
		try {
			List<DtrCapacityDto> dtrCapacityDtosList = dtrCapacityDao.findAll();
			return dtrCapacityDtosList;
		} catch (Exception e) {
			return null;
		}
	}

	public List<DtrMakeDto> getDtrMake() {
		try {
			List<DtrMakeDto> dtrMakeDtos = dtrMakeDao.findAll();
			return dtrMakeDtos;
		} catch (Exception e) {
			return null;
		}
	}
}
