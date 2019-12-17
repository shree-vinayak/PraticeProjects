package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.electrical.dtos.Line33kvPtrMapping;
import com.astute.electrical.dtos.Ptr;
import com.astute.electrical.models.Line33kvPtrMappingDto;
import com.astute.electrical.models.PtrCapacityDto;
import com.astute.electrical.models.PtrDto;
import com.astute.electrical.models.PtrMakeDto;
import com.astute.electrical.repository.Feeder11kvPtrMappingDao;
import com.astute.electrical.repository.Line33kvPtrMappingDao;
import com.astute.electrical.repository.PtrCapacityDao;
import com.astute.electrical.repository.PtrDao;
import com.astute.electrical.repository.PtrMakeDao;
import com.astute.electrical.repository.SubstationDao;
import com.astute.util.UtilElectrical;

@Component
public class PtrApiAdaptor {

	@Autowired
	private UtilElectrical utilElectrical;

	@Autowired
	private SubstationDao substationDao;

	@Autowired
	private PtrDao ptrDao;

	@Autowired
	private Feeder11kvPtrMappingDao feeder11kvPtrMappingDao;

	@Autowired
	private PtrMakeDao ptrMakeDao;

	@Autowired
	private PtrCapacityDao ptrCapacityDao;

	@Autowired
	private Line33kvPtrMappingDao line33kvPtrMappingDao;

	@Transactional
	// To save the ptr
	public Ptr addPtr(Ptr ptr) {
		try {
			PtrDto ptrDto = utilElectrical.copyRequestObjectForPtr(ptr);
			ptrDto.setStartDate(new Date(System.currentTimeMillis()));
			ptrDto.setEndDate(new Date(System.currentTimeMillis()));
			ptrDto.setIsActive(true);
			ptr = utilElectrical.copyResponseObjectForPtr(ptrDao.save(ptrDto));
			return ptr;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	// To delete the ptr
	public Boolean disablePtr(Integer ptrId) {
		try {
			Integer count = feeder11kvPtrMappingDao.getCount(ptrId);
			if (count <= 0) {

				PtrDto ptrDto = ptrDao.findByIds(ptrId);
				ptrDto.setIsActive(false);
				ptrDto.setEndDate(new Date(System.currentTimeMillis()));
				List<Line33kvPtrMappingDto> line33kvPtrMappingDtoList = ptrDto.getLine33kvPtrMapping();
				Iterator<Line33kvPtrMappingDto> itr = line33kvPtrMappingDtoList.iterator();
				while (itr.hasNext()) {
					Line33kvPtrMappingDto line33kvPtrMappingDto = itr.next();
					line33kvPtrMappingDto.setIsActive(false);
					line33kvPtrMappingDto.setEndDate(new Date(System.currentTimeMillis()));
				}
				ptrDto = ptrDao.save(ptrDto);
				return true;
			}
			return false;
		} catch (Exception e) {
			return false;
		}
	}

	public List<Ptr> getAllPtr() {
		try {
			List<PtrDto> ptrDtoList = ptrDao.findAll();
			List<Ptr> ptrList = new ArrayList<Ptr>();
			Iterator<PtrDto> itr = ptrDtoList.iterator();
			while (itr.hasNext()) {
				PtrDto ptrDto = itr.next();
				Ptr ptr = utilElectrical.copyResponseObjectForPtr(ptrDto);
				ptrList.add(ptr);
			}
			return ptrList;
		} catch (Exception e) {
			return null;
		}
	}

//	// To get all the ptr according to substation Id
//	public CustomSubstationPtr getAllPtrBySubstationId(Integer substationId) {
//
//		List<Object[]> listObject = substationDao.findByIds(substationId);
//		CustomSubstationPtr customSubstationPtr = new CustomSubstationPtr();
//		Iterator<Object[]> itr = listObject.iterator();
//		while (itr.hasNext()) {
//			Object[] o = itr.next();
//			customSubstationPtr.setSubstationId((Integer) o[0]);
//			customSubstationPtr.setName((String) o[1]);
//		}
//		List<PtrDto> ptrDtoslist = ptrDao.findBySubstationId(substationId);
//		List<Ptr> ptrList = new ArrayList<Ptr>();
//		Iterator<PtrDto> itr1 = ptrDtoslist.iterator();
//		while (itr1.hasNext()) {
//			PtrDto ptrDto = itr1.next();
//			Ptr ptr = utilElectrical.copyResponseObjectForPtr(ptrDto);
//			ptrList.add(ptr);
//		}
//		customSubstationPtr.setListPtr(ptrList);
//		return customSubstationPtr;
//	}

	// To get all the ptr according to substation Id
	public HashMap<String, Object> getAllPtrBySubstationId(Integer substationId) {
		try {
			List<Object[]> listSubdationDto = substationDao.findByIds(substationId);
			HashMap<String, Object> hash = new HashMap<>();
			Iterator<Object[]> itr = listSubdationDto.iterator();
			while (itr.hasNext()) {
				Object[] o = itr.next();
				hash.put("substationId", (Integer) o[0]);
				hash.put("name", (String) o[1]);
			}
			List<PtrDto> ptrDtoslist = ptrDao.findBySubstationId(substationId);
			List<Ptr> ptrList = new ArrayList<Ptr>();
			Iterator<PtrDto> itr1 = ptrDtoslist.iterator();
			while (itr1.hasNext()) {
				PtrDto ptrDto = itr1.next();
				Ptr ptr = utilElectrical.copyResponseObjectForPtr(ptrDto);
				ptrList.add(ptr);
			}
			hash.put("listPtr", ptrList);
			return hash;
		} catch (Exception e) {
			return null;
		}
	}

	public Ptr getPtrById(Integer ptrId) {
		try {
			PtrDto ptrDto = ptrDao.findByIds(ptrId);
			return utilElectrical.copyResponseObjectForPtr(ptrDto);
		} catch (Exception e) {
			return null;
		}

	}

	public Ptr updatePtr(Ptr ptr) {
		try {
			PtrDto ptrDto = ptrDao.findByIds(ptr.getPtrId());

			if (ptr.getName() != null && !ptr.getName().trim().isEmpty())
				ptrDto.setName(ptr.getName());

			if (!ptr.getCapacity().trim().isEmpty() && ptr.getCapacity() != null)
				ptrDto.setCapacity(ptr.getCapacity());

			if (!ptr.getMake().trim().isEmpty() && ptr.getMake() != null)
				ptrDto.setMake(ptr.getMake());

			if (ptr.getYearOfManufacturing() != null)
				ptrDto.setYearOfManufacturing(ptr.getYearOfManufacturing());

			if (ptr.getLine33kvPtrMapping() != null && !ptr.getLine33kvPtrMapping().isEmpty()) {
				List<Line33kvPtrMapping> line33kvPtrMappingList = ptr.getLine33kvPtrMapping();
				List<Line33kvPtrMappingDto> line33kvPtrMappingDtoList = ptrDto.getLine33kvPtrMapping();
				List<Line33kvPtrMappingDto> line33kvPtrMappingDtoResult = new ArrayList<Line33kvPtrMappingDto>();
				Iterator<Line33kvPtrMapping> Itr = line33kvPtrMappingList.iterator();
				while (Itr.hasNext()) {
					Line33kvPtrMapping line33kvPtrMapping = Itr.next();
					if (line33kvPtrMapping.getLine33kvPtrMappingId() != null) {
						for (Line33kvPtrMappingDto line33kvPtrMappingDto : line33kvPtrMappingDtoList) {
							if (line33kvPtrMappingDto.getLine33kvPtrMappingId() == line33kvPtrMapping
									.getLine33kvPtrMappingId()) {
								line33kvPtrMappingDtoResult.add(line33kvPtrMappingDto);
							}
						}
					} else {
						Line33kvPtrMappingDto line33kvPtrMappingDto = new Line33kvPtrMappingDto();
						line33kvPtrMappingDto.setLine33kvId(line33kvPtrMapping.getLine33kvId());
						line33kvPtrMappingDto.setPtrId(line33kvPtrMapping.getPtrId());
						line33kvPtrMappingDto.setStartDate(new Date(System.currentTimeMillis()));
						line33kvPtrMappingDto.setEndDate(new Date(System.currentTimeMillis()));
						line33kvPtrMappingDto.setIsActive(true);
						line33kvPtrMappingDtoResult.add(line33kvPtrMappingDto);
					}
				}
				ptrDto.setLine33kvPtrMapping(line33kvPtrMappingDtoResult);
			}
			PtrDto p1 = ptrDao.save(ptrDto);

			try {

				line33kvPtrMappingDao.deleteWhereIdIsNull();

			} catch (Exception e) {
				ptr = utilElectrical.copyResponseObjectForPtr(p1);
				return ptr;

			}

			ptr = utilElectrical.copyResponseObjectForPtr(p1);
			return ptr;
		} catch (Exception e) {
			return null;
		}

	}

	public List<PtrMakeDto> getPtrMake() {
		try {
			List<PtrMakeDto> ptrMakeDtosList = ptrMakeDao.findAll();
			return ptrMakeDtosList;
		} catch (Exception e) {
			return null;
		}
	}

	public List<PtrCapacityDto> getptrCapacity() {
		try {
			List<PtrCapacityDto> ptrCapacityDtosList = ptrCapacityDao.findAll();
			return ptrCapacityDtosList;
		} catch (Exception e) {
			return null;
		}
	}

}
