package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.astute.electrical.dtos.DtrDevice;
import com.astute.electrical.dtos.DtrDtrDeviceMapping;
import com.astute.electrical.models.DtrDeviceDto;
import com.astute.electrical.models.DtrDtrDeviceMappingDto;
import com.astute.electrical.repository.DtrDao;
import com.astute.electrical.repository.DtrDeviceDao;
import com.astute.electrical.repository.DtrDtrDeviceMappingDao;
import com.astute.util.UtilElectrical;

@Component
public class DtrDeviceApiAdaptor {
	@Autowired
	private DtrDeviceDao dtrDeviceDao;

	@Autowired
	private UtilElectrical utilElectrical;

	@Autowired
	private DtrDao dtrDao;

	@Autowired
	private DtrDtrDeviceMappingDao dtrDtrDeviceMappingDao;

	@Transactional
	public DtrDevice addDtrDevice(DtrDevice dtrDevice) {
		try {
			DtrDeviceDto dtrDeviceDto = utilElectrical.copyRequestObjectForDtrDevice(dtrDevice);
			dtrDeviceDto.setStartDate(new Date(System.currentTimeMillis()));
			dtrDeviceDto.setEndDate(new Date(System.currentTimeMillis()));
			dtrDeviceDto.setIsActive(true);
			dtrDevice = utilElectrical.copyResponseObjectForDtrDevice(dtrDeviceDao.save(dtrDeviceDto));
			return dtrDevice;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Boolean disableDtrDevice(Integer dtrDeviceId) {
		try {
			DtrDeviceDto dtrDeviceDto = dtrDeviceDao.findByIds(dtrDeviceId);
			dtrDeviceDto.setIsActive(false);
			dtrDeviceDto.setEndDate(new Date(System.currentTimeMillis()));
			List<DtrDtrDeviceMappingDto> dtrDtrDeviceMappingDtos = dtrDeviceDto.getDtrDtrDeviceMapping();
			Iterator<DtrDtrDeviceMappingDto> itr = dtrDtrDeviceMappingDtos.iterator();
			while (itr.hasNext()) {
				DtrDtrDeviceMappingDto dtrDtrDeviceMappingDto = itr.next();
				dtrDtrDeviceMappingDto.setIsActive(false);
				dtrDtrDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
			}
			dtrDeviceDao.save(dtrDeviceDto);

			return true;
		} catch (Exception e) {
			return false;
		}

	}

//	public CustomDtrDtrDevice getDtrDeviceByDtrId(Integer dtrId) {
//		CustomDtrDtrDevice customDtrDtrDevice = new CustomDtrDtrDevice();
//		List<DtrDevice> dtrDevicesList = new ArrayList<DtrDevice>();
//		List<Object[]> listObject = dtrDao.getDtrByDtrId(dtrId);
//		Iterator<Object[]> itr = listObject.iterator();
//		while (itr.hasNext()) {
//			Object[] o = itr.next();
//			customDtrDtrDevice.setDtrId((Integer) o[0]);
//			customDtrDtrDevice.setName((String) o[1]);
//		}
//		List<Integer> integers = dtrDtrDeviceMappingDao.getDtrDeviceIdByDtrId(dtrId);
//		Iterator<Integer> itr1 = integers.iterator();
//		while (itr1.hasNext()) {
//			Integer i = itr1.next();
//			DtrDeviceDto dtrDeviceDto = dtrDeviceDao.findByIds(i);
//			DtrDevice dtrDevice = utilElectrical.copyResponseObjectForDtrDevice(dtrDeviceDto);
//			dtrDevicesList.add(dtrDevice);
//		}
//		customDtrDtrDevice.setDtrDeviceList(dtrDevicesList);
//		return customDtrDtrDevice;
//	}

	@Transactional
	public HashMap<String, Object> getDtrDeviceByDtrId(Integer dtrId) {
		try {
			HashMap<String, Object> hash = new HashMap<>();
			List<DtrDevice> dtrDevicesList = new ArrayList<DtrDevice>();
			List<Object[]> listObject = dtrDao.getDtrByDtrId(dtrId);
			Iterator<Object[]> itr = listObject.iterator();
			while (itr.hasNext()) {
				Object[] o = itr.next();
				hash.put("dtrId", (Integer) o[0]);
				hash.put("name", (String) o[1]);
			}
			List<Integer> integers = dtrDtrDeviceMappingDao.getDtrDeviceIdByDtrId(dtrId);
			Iterator<Integer> itr1 = integers.iterator();
			while (itr1.hasNext()) {
				Integer i = itr1.next();
				DtrDeviceDto dtrDeviceDto = dtrDeviceDao.findByIds(i);
				DtrDevice dtrDevice = utilElectrical.copyResponseObjectForDtrDevice(dtrDeviceDto);
				dtrDevicesList.add(dtrDevice);
			}
			hash.put("dtrDeviceList", dtrDevicesList);
			return hash;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public DtrDevice updateDtrDevice(DtrDevice dtrDevice) {
		try {
			DtrDeviceDto dtrDeviceDto = dtrDeviceDao.findByIds(dtrDevice.getDtrDeviceId());
			if (dtrDevice.getNumber() != null)
				dtrDeviceDto.setNumber(dtrDevice.getNumber());

			if (dtrDevice.getVendorId() != null)
				dtrDeviceDto.setVendorId(dtrDevice.getVendorId());

			if (dtrDevice.getInstallationDate() != null)
				dtrDeviceDto.setInstallationDate(dtrDevice.getInstallationDate());

			if (dtrDevice.getSimNumber() != null)
				dtrDeviceDto.setSimNumber(dtrDevice.getSimNumber());

			if (dtrDevice.getMobileNumber() != null)
				dtrDeviceDto.setMobileNumber(dtrDevice.getMobileNumber());

			if (dtrDevice.getTelecomOperator() != null && !dtrDevice.getTelecomOperator().trim().isEmpty())
				dtrDeviceDto.setTelecomOperator(dtrDevice.getTelecomOperator());

			if (dtrDevice.getDtrDtrDeviceMapping() != null && !dtrDevice.getDtrDtrDeviceMapping().isEmpty()) {
				List<DtrDtrDeviceMapping> dtrDtrDeviceMappingList = dtrDevice.getDtrDtrDeviceMapping();
				List<DtrDtrDeviceMappingDto> dtrDtrDeviceMappingDtoList = dtrDeviceDto.getDtrDtrDeviceMapping();
				List<DtrDtrDeviceMappingDto> dtrDtrDeviceMappingDtoResult = new ArrayList<DtrDtrDeviceMappingDto>();
				Iterator<DtrDtrDeviceMapping> Itr = dtrDtrDeviceMappingList.iterator();
				while (Itr.hasNext()) {
					DtrDtrDeviceMapping dtrDtrDeviceMapping = Itr.next();
					if (dtrDtrDeviceMapping.getDtrDtrDeviceMappingId() != null) {
						for (DtrDtrDeviceMappingDto dtrDtrDeviceMappingDto : dtrDtrDeviceMappingDtoList) {
							if (dtrDtrDeviceMappingDto.getDtrDtrDeviceMappingId() == dtrDtrDeviceMapping
									.getDtrDtrDeviceMappingId()) {
								dtrDtrDeviceMappingDtoResult.add(dtrDtrDeviceMappingDto);
							}
						}
					} else {
						DtrDtrDeviceMappingDto dtrDtrDeviceMappingDto = new DtrDtrDeviceMappingDto();
						dtrDtrDeviceMappingDto.setDtrDeviceId(dtrDtrDeviceMapping.getDtrDeviceId());
						dtrDtrDeviceMappingDto.setDtrId(dtrDtrDeviceMappingDto.getDtrId());
						dtrDtrDeviceMappingDto.setStartDate(new Date(System.currentTimeMillis()));
						dtrDtrDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
						dtrDtrDeviceMappingDto.setIsActive(true);
						dtrDtrDeviceMappingDtoResult.add(dtrDtrDeviceMappingDto);
					}
				}

				dtrDeviceDto.setDtrDtrDeviceMapping(dtrDtrDeviceMappingDtoResult);
			}

			DtrDeviceDto d1 = dtrDeviceDao.save(dtrDeviceDto);
			try {

				dtrDtrDeviceMappingDao.deleteWhereIdIsNull();

			} catch (Exception e) {
				dtrDevice = utilElectrical.copyResponseObjectForDtrDevice(d1);
				return dtrDevice;
			}
			dtrDevice = utilElectrical.copyResponseObjectForDtrDevice(d1);
			return dtrDevice;
		} catch (Exception e) {
			return null;
		}
	}

}
