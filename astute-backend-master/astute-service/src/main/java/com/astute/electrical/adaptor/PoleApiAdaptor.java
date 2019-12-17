package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.astute.electrical.dtos.DtrPoleMapping;
import com.astute.electrical.dtos.Pole;
import com.astute.electrical.models.DtrPoleMappingDto;
import com.astute.electrical.models.PoleDto;
import com.astute.electrical.repository.DtrDao;
import com.astute.electrical.repository.DtrPoleMappingDao;
import com.astute.electrical.repository.PoleDao;
import com.astute.electrical.repository.PolePoleDeviceMappingDao;
import com.astute.util.UtilElectrical;

@Component
public class PoleApiAdaptor {
	@Autowired
	private UtilElectrical utilElectrical;

	@Autowired
	private PoleDao poleDao;

	@Autowired
	private PolePoleDeviceMappingDao polePoleDeviceMappingDao;

	@Autowired
	private DtrDao dtrDao;

	@Autowired
	private DtrPoleMappingDao dtrPoleMappingDao;

	@Transactional
	public Pole addPole(Pole pole) {
		try {
			PoleDto poleDto = utilElectrical.copyRequestObjectForPole(pole);
			poleDto.setStartDate(new Date(System.currentTimeMillis()));
			poleDto.setEndDate(new Date(System.currentTimeMillis()));
			poleDto.setIsActive(true);
			pole = utilElectrical.copyResponseObjectForPole(poleDao.save(poleDto));
			return pole;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Boolean disablePole(Integer poleId) {
		try {
			Integer count = polePoleDeviceMappingDao.getCount(poleId);
			if (count == 0) {
				PoleDto poleDto = poleDao.findByIds(poleId);
				poleDto.setIsActive(false);
				poleDto.setEndDate(new Date(System.currentTimeMillis()));
				List<DtrPoleMappingDto> dtrPoleMappingDtos = poleDto.getDtrPoleMapping();
				Iterator<DtrPoleMappingDto> itr = dtrPoleMappingDtos.iterator();
				while (itr.hasNext()) {
					DtrPoleMappingDto dtrPoleMappingDto = itr.next();
					dtrPoleMappingDto.setIsActive(false);
					dtrPoleMappingDto.setEndDate(new Date(System.currentTimeMillis()));
				}
				poleDao.save(poleDto);

				return true;
			}
			return false;
		} catch (Exception e) {
			return false;
		}
	}

//	public CustomDtrPole getAllPoleByDtrId(Integer dtrId) {
//
//		CustomDtrPole customDtrPole = new CustomDtrPole();
//		List<Object[]> listObject = dtrDao.getDtrByDtrId(dtrId);
//		Iterator<Object[]> itr = listObject.iterator();
//		while (itr.hasNext()) {
//			Object[] o = itr.next();
//			customDtrPole.setDtrId((Integer) o[0]);
//			customDtrPole.setName((String) o[1]);
//		}
//		List<Pole> poleList = new ArrayList<Pole>();
//		List<Integer> integers = dtrPoleMappingDao.getPoleIdsByDtrId(dtrId);
//		Iterator<Integer> itr1 = integers.iterator();
//		while (itr1.hasNext()) {
//			Integer i = itr1.next();
//			PoleDto poleDto = poleDao.findByIds(i);
//			Pole pole = utilElectrical.copyResponseObjectForPole(poleDto);
//			poleList.add(pole);
//		}
//		customDtrPole.setPoleList(poleList);
//		return customDtrPole;
//	}

	public HashMap<String, Object> getAllPoleByDtrId(Integer dtrId) {
		try {
			HashMap<String, Object> customDtrPole = new HashMap<>();
			List<Object[]> listObject = dtrDao.getDtrByDtrId(dtrId);
			Iterator<Object[]> itr = listObject.iterator();
			while (itr.hasNext()) {
				Object[] o = itr.next();
				customDtrPole.put("dtrId", (Integer) o[0]);
				customDtrPole.put("name", (String) o[1]);
			}
			List<Pole> poleList = new ArrayList<Pole>();
			List<Integer> integers = dtrPoleMappingDao.getPoleIdsByDtrId(dtrId);
			Iterator<Integer> itr1 = integers.iterator();
			while (itr1.hasNext()) {
				Integer i = itr1.next();
				PoleDto poleDto = poleDao.findByIds(i);
				Pole pole = utilElectrical.copyResponseObjectForPole(poleDto);
				poleList.add(pole);
			}
			customDtrPole.put("poleList", poleList);
			return customDtrPole;
		} catch (Exception e) {
			return null;
		}
	}

	public Pole updatePole(Pole pole) {
		try {
			PoleDto poleDto = poleDao.findByIds(pole.getPoleId());
			if (pole.getNumber() != null)
				poleDto.setNumber(pole.getNumber());

			if (pole.getDtrPoleMapping() != null && !pole.getDtrPoleMapping().isEmpty()) {
				List<DtrPoleMapping> dtrPoleMappingList = pole.getDtrPoleMapping();
				List<DtrPoleMappingDto> dtrPoleMappingDtoList = poleDto.getDtrPoleMapping();
				List<DtrPoleMappingDto> dtrPoleMappingDtoResult = new ArrayList<DtrPoleMappingDto>();
				Iterator<DtrPoleMapping> Itr = dtrPoleMappingList.iterator();
				while (Itr.hasNext()) {
					DtrPoleMapping dtrPoleMapping = Itr.next();
					if (dtrPoleMapping.getDtrPoleMappingId() != null) {
						for (DtrPoleMappingDto dtrPoleMappingDto : dtrPoleMappingDtoList) {
							if (dtrPoleMappingDto.getDtrPoleMappingId() == dtrPoleMapping.getDtrPoleMappingId()) {
								dtrPoleMappingDtoResult.add(dtrPoleMappingDto);
							}
						}
					} else {
						DtrPoleMappingDto dtrPoleMappingDto = new DtrPoleMappingDto();
						dtrPoleMappingDto.setDtrId(dtrPoleMappingDto.getDtrId());
						dtrPoleMappingDto.setPoleId(dtrPoleMappingDto.getPoleId());
						dtrPoleMappingDto.setStartDate(new Date(System.currentTimeMillis()));
						dtrPoleMappingDto.setEndDate(new Date(System.currentTimeMillis()));
						dtrPoleMappingDto.setIsActive(true);
						dtrPoleMappingDtoResult.add(dtrPoleMappingDto);
					}
				}
				poleDto.setDtrPoleMapping(dtrPoleMappingDtoResult);
			}

			PoleDto p1 = poleDao.save(poleDto);

			try {

				dtrPoleMappingDao.deleteWhereIdIsNull();

			} catch (Exception e) {
				pole = utilElectrical.copyResponseObjectForPole(p1);
				return pole;
			}

			pole = utilElectrical.copyResponseObjectForPole(p1);
			return pole;
		} catch (Exception e) {
			return null;
		}
	}

}
