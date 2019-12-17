package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.astute.customClasses.CustomEhvSsLine33kv;
import com.astute.discom.repository.CircleDao;
import com.astute.electrical.dtos.EhvSs;
import com.astute.electrical.dtos.EhvSsCircleMapping;
import com.astute.electrical.dtos.Line33kv;
import com.astute.electrical.models.EhvSsCircleMappingDto;
import com.astute.electrical.models.EhvSsDto;
import com.astute.electrical.repository.EhvSsCircleMappingDao;
import com.astute.electrical.repository.EhvSsDao;
import com.astute.electrical.repository.Line33kvDao;
import com.astute.util.UtilElectrical;

@Component
public class EhvSsApiAdaptor {

	@Autowired
	private EhvSsDao ehvSsDao;

	@Autowired
	private Line33kvDao line33kvDao;

	@Autowired
	private CircleDao circleDao;

	@Autowired
	private UtilElectrical utilElectrical;

	@Autowired
	private EhvSsCircleMappingDao ehvSsCircleMappingDao;

	@Transactional
	public EhvSs addEhvSs(EhvSs ehvSs) {

		try {
			EhvSsDto ehvSsDto = utilElectrical.copyRequestObjectForEhvSs(ehvSs);
			if (ehvSsDto != null) {
				ehvSsDto.setStartDate(new Date(System.currentTimeMillis()));
				ehvSsDto.setEndDate(new Date(System.currentTimeMillis()));
				ehvSsDto.setIsActive(true);
				ehvSs = utilElectrical.copyResponseObjectForEhvSs(ehvSsDao.save(ehvSsDto));
				return ehvSs;
			}
			return null;
		} catch (Exception e) {
			return null;
		}

	}

	@Transactional
	public Boolean disableEhvSs(Integer ehvSsId) {
		try {
			Integer count = line33kvDao.getCount(ehvSsId);
			if (count <= 0) {
				EhvSsDto ehvSsDto = ehvSsDao.findByEhvSsId1(ehvSsId);
				ehvSsDto.setIsActive(false);
				ehvSsDto.setEndDate(new Date(System.currentTimeMillis()));
				List<EhvSsCircleMappingDto> ehvSsCircleMappingDtos = ehvSsDto.getEhvSsCircleMapping();
				Iterator<EhvSsCircleMappingDto> itr = ehvSsCircleMappingDtos.iterator();
				while (itr.hasNext()) {
					EhvSsCircleMappingDto ehvSsCircleMappingDto = itr.next();
					ehvSsCircleMappingDto.setIsActive(false);
					ehvSsCircleMappingDto.setEndDate(new Date(System.currentTimeMillis()));
				}
				ehvSsDao.save(ehvSsDto);
				return true;
			}
			return false;

		} catch (Exception e) {
			return false;
		}

	}

//	public List<CustomCircleEhvSs> getAllCustomCircleEhvSs(Integer idRegion)   {
//
//		List<Object[]> listCircleDtos = circleDao.getCircleNameAndIdByRegionId(idRegion);
//		Iterator<Object[]> itr = listCircleDtos.iterator();
//		List<CustomCircleEhvSs> listCustomCircleEhvSs = new ArrayList<CustomCircleEhvSs>();
//		while (itr.hasNext()) {
//			Object[] object = itr.next();
//			CustomCircleEhvSs customCircleEhvSs = new CustomCircleEhvSs();
//			customCircleEhvSs.setIdCircle((Integer) object[0]);
//			customCircleEhvSs.setName((String) object[1]);
//			EhvSsCircleMappingDto ehvSsCircleMappingDto = ehvSsCircleMappingDao.findByCircleId((Integer) object[0]);
//			if (ehvSsCircleMappingDto != null) {
//				List<Object[]> listEhvSsDtos = ehvSsDao.findById(ehvSsCircleMappingDto.getEhvSsId());
//				Iterator<Object[]> itr1 = listEhvSsDtos.iterator();
//				while (itr1.hasNext()) {
//					Object[] object1 = itr1.next();
//					EhvSs ehvSs = new EhvSs((Integer) object1[0], (String) object1[1]);
//					customCircleEhvSs.setEhvSs(ehvSs);
//					listCustomCircleEhvSs.add(customCircleEhvSs);
//				}
//			}
//		}
//		if (listCustomCircleEhvSs.size() > 0) {
//			return listCustomCircleEhvSs;
//		}
//
//		return null;
//	}

	public List<EhvSs> getAllEhvSsByRegionId(Integer idRegion) {

		List<EhvSs> ehvSsList = new ArrayList<EhvSs>();
		List<Integer> listCircleDtos = circleDao.getCircleIdsByRegionId(idRegion);
		if (!listCircleDtos.isEmpty()) {
			Boolean isUnique;
			List<Integer> ehvSsIdList = new ArrayList<Integer>();
			Iterator<Integer> itr = listCircleDtos.iterator();
			while (itr.hasNext()) {
				Integer circleId = itr.next();
				List<EhvSsCircleMappingDto> ehvSsCircleMappingDtoList = ehvSsCircleMappingDao.findByCircleId1(circleId);
				Iterator<EhvSsCircleMappingDto> itr1 = ehvSsCircleMappingDtoList.iterator();

				if (ehvSsCircleMappingDtoList != null && !ehvSsCircleMappingDtoList.isEmpty()) {
					while (itr1.hasNext()) {
						EhvSsCircleMappingDto ehvSsCircleMappingDto = itr1.next();
						isUnique = true;
						if (!ehvSsIdList.isEmpty() && ehvSsIdList != null) {
							for (Integer ehvSsId : ehvSsIdList) {
								if (ehvSsId == ehvSsCircleMappingDto.getEhvSsId()) {
									isUnique = false;
								}
							}
						}
						if (isUnique) {
							List<EhvSsDto> listEhvSsDtos = ehvSsDao.findByEhvSsId(ehvSsCircleMappingDto.getEhvSsId());
							Iterator<EhvSsDto> itr2 = listEhvSsDtos.iterator();
							while (itr2.hasNext()) {
								EhvSsDto ehvSsDto = itr2.next();
								EhvSs ehvSs = utilElectrical.copyResponseObjectForEhvSs(ehvSsDto);
								ehvSs.setLine33kv(null);
								ehvSsList.add(ehvSs);
								ehvSsIdList.add(ehvSs.getEhvSsId());
							}
						}
					}
				}
			}
			return ehvSsList;
		}

		return null;
	}

//	public CustomEhvSsLine33kv getEhvById(Integer ehvSsId) {
//		List<Object[]> ehvSsDto = ehvSsDao.findByIds(ehvSsId);
//		CustomEhvSsLine33kv customEhvSsLine33kv = new CustomEhvSsLine33kv();
//		Iterator<Object[]> itr = ehvSsDto.iterator();
//		while (itr.hasNext()) {
//			Object[] o = itr.next();
//			customEhvSsLine33kv.setEhvSsId((Integer) o[0]);
//			customEhvSsLine33kv.setName((String) o[1]);
//		}
//		List<Object[]> line33kvDtos = line33kvDao.findByEhvSsId(customEhvSsLine33kv.getEhvSsId());
//		Iterator<Object[]> itr1 = line33kvDtos.iterator();
//		List<Line33kv> line33kvs = new ArrayList<Line33kv>();
//		while (itr1.hasNext()) {
//			Object[] o = itr1.next();
//			Line33kv line33kv = new Line33kv((Integer) o[0], (String) o[1]);
//			line33kv.setEhvSsid(customEhvSsLine33kv.getEhvSsId());
//			line33kvs.add(line33kv);
//		}
//		customEhvSsLine33kv.setLine33kv(line33kvs);
//
//		return customEhvSsLine33kv;
//
//	}

	
	public HashMap<String, Object> getEhvById(Integer ehvSsId) {
		try {
			List<Object[]> ehvSsDto = ehvSsDao.findByIds(ehvSsId);
			HashMap<String, Object> hash = new HashMap<>();

			Iterator<Object[]> itr = ehvSsDto.iterator();
			while (itr.hasNext()) {
				Object[] o = itr.next();
				hash.put("ehvSsId", (Integer) o[0]);
				hash.put("name", (String) o[1]);
			}
			List<Object[]> line33kvDtos = line33kvDao.findByEhvSsId((Integer) hash.get("ehvSsId"));
			Iterator<Object[]> itr1 = line33kvDtos.iterator();
			List<Line33kv> line33kvs = new ArrayList<Line33kv>();
			while (itr1.hasNext()) {
				Object[] o = itr1.next();
				Line33kv line33kv = new Line33kv((Integer) o[0], (String) o[1]);
				line33kv.setEhvSsid((Integer) hash.get("ehvSsId"));
				line33kvs.add(line33kv);
			}
			hash.put("line33kv", line33kvs);
			return hash;
		} catch (Exception e) {
			return null;
		}

	}

	public EhvSs updateEhvSs(EhvSs ehvSs) {
		try {
			EhvSsDto ehvSsDto = ehvSsDao.findByEhvSsId1(ehvSs.getEhvSsId());

			if (ehvSs.getName() != null && !ehvSs.getName().trim().isEmpty())
				ehvSsDto.setName(ehvSs.getName());

			if (ehvSs.getEhvSsCircleMapping() != null && !ehvSs.getEhvSsCircleMapping().isEmpty()) {
				List<EhvSsCircleMapping> ehvSsCircleMappingList = ehvSs.getEhvSsCircleMapping();
				List<EhvSsCircleMappingDto> ehvSsCircleMappingDtoList = ehvSsDto.getEhvSsCircleMapping();
				List<EhvSsCircleMappingDto> ehvSsCircleMappingDtoResult = new ArrayList<EhvSsCircleMappingDto>();
				Iterator<EhvSsCircleMapping> Itr = ehvSsCircleMappingList.iterator();
				while (Itr.hasNext()) {
					EhvSsCircleMapping ehvSsCircleMapping = Itr.next();

					if (ehvSsCircleMapping.getEhvSsCircleMappingId() != null) {

						for (EhvSsCircleMappingDto ehvSsCircleMappingDto : ehvSsCircleMappingDtoList) {

							if (ehvSsCircleMappingDto.getEhvSsCircleMappingId() == ehvSsCircleMapping
									.getEhvSsCircleMappingId()) {
								ehvSsCircleMappingDtoResult.add(ehvSsCircleMappingDto);
							}
						}
					} else {
						EhvSsCircleMappingDto ehvSsCircleMappingDto = new EhvSsCircleMappingDto();
						ehvSsCircleMappingDto.setIdCircle(ehvSsCircleMapping.getIdCircle());
						ehvSsCircleMappingDto.setStartDate(new Date(System.currentTimeMillis()));
						ehvSsCircleMappingDto.setEndDate(new Date(System.currentTimeMillis()));
						ehvSsCircleMappingDto.setIsActive(true);
						ehvSsCircleMappingDtoResult.add(ehvSsCircleMappingDto);
					}
				}
				ehvSsDto.setEhvSsCircleMapping(ehvSsCircleMappingDtoResult);
			}

			EhvSsDto ehvSsDto1 = ehvSsDao.save(ehvSsDto);

			try {

				ehvSsCircleMappingDao.deleteWhereIdIsNull();

			} catch (Exception e) {
				ehvSs = utilElectrical.copyResponseObjectForEhvSs(ehvSsDto1);

				return ehvSs;
			}

			ehvSs = utilElectrical.copyResponseObjectForEhvSs(ehvSsDto1);

			return ehvSs;
		} catch (Exception e) {
			return null;
		}
	}

	public List<EhvSs> getDuplicateEhvSs(String name) {
		try {
			List<EhvSsDto> listSsDtos = ehvSsDao.findByName(name);
			List<EhvSs> listEhvSs = new ArrayList<EhvSs>();
			Iterator<EhvSsDto> itr = listSsDtos.iterator();
			while (itr.hasNext()) {
				EhvSsDto ehvSsDto = itr.next();
				EhvSs ehvSs = utilElectrical.copyResponseObjectForEhvSs(ehvSsDto);
				listEhvSs.add(ehvSs);
			}
			if (listEhvSs.size() > 0) {
				return listEhvSs;
			}
			return null;
		} catch (Exception e) {
			return null;
		}
	}

	public List<EhvSs> getAllEhvSs(Integer idCircle) {

		try {
			List<EhvSsCircleMappingDto> ehvSsCircleMappingDtos = ehvSsCircleMappingDao.findByCircleId1(idCircle);
			Iterator<EhvSsCircleMappingDto> itr = ehvSsCircleMappingDtos.iterator();
			List<EhvSs> listEhvSs = new ArrayList<EhvSs>();

			List<EhvSsCircleMapping> listEhvSsCircleMapping = new ArrayList<EhvSsCircleMapping>();

			while (itr.hasNext()) {
				EhvSsCircleMappingDto ehvSsCircleMappingDto = itr.next();
				EhvSsDto ehvSsDto = ehvSsDao.findByEhvSsId1(ehvSsCircleMappingDto.getEhvSsId());
				EhvSs ehvSs = new EhvSs(ehvSsDto.getEhvSsId(), ehvSsDto.getName());
				EhvSsCircleMapping ehvSsCircleMapping = new EhvSsCircleMapping(
						ehvSsCircleMappingDto.getEhvSsCircleMappingId(), ehvSsCircleMappingDto.getEhvSsId(),
						ehvSsCircleMappingDto.getIdCircle());
				listEhvSsCircleMapping.add(ehvSsCircleMapping);
				ehvSs.setEhvSsCircleMapping(listEhvSsCircleMapping);
				listEhvSs.add(ehvSs);
			}
			return listEhvSs;
		} catch (Exception e) {
			return null;
		}
	}

}