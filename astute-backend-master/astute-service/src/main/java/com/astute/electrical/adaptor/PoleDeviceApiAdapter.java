package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.electrical.dtos.PoleDevice;
import com.astute.electrical.dtos.PolePoleDeviceMapping;
import com.astute.electrical.models.PoleDeviceDto;
import com.astute.electrical.models.PolePoleDeviceMappingDto;
import com.astute.electrical.repository.PoleDao;
import com.astute.electrical.repository.PoleDeviceDao;
import com.astute.electrical.repository.PolePoleDeviceMappingDao;
import com.astute.util.UtilElectrical;

@Component
public class PoleDeviceApiAdapter {
	@Autowired
	private PoleDeviceDao poleDeviceDao;

	@Autowired
	private UtilElectrical utilElectrical;

	@Autowired
	private PoleDao poleDao;

	@Autowired
	private PolePoleDeviceMappingDao polePoleDeviceMappingDao;

	@Transactional
	public PoleDevice addPoleDevice(PoleDevice poleDevice) {
		try {
			PoleDeviceDto poleDeviceDto = utilElectrical.copyRequestObjectForPoleDevice(poleDevice);
			poleDeviceDto.setStartDate(new Date(System.currentTimeMillis()));
			poleDeviceDto.setEndDate(new Date(System.currentTimeMillis()));
			poleDeviceDto.setIsActive(true);
			poleDevice = utilElectrical.copyResponseObjectForPoleDevice(poleDeviceDao.save(poleDeviceDto));
			return poleDevice;
		} catch (Exception e) {
			return null;
		}
	}

	public List<PoleDevice> getAllPoleDevice() {
		try {
			List<PoleDeviceDto> poleDeviceDtoList = poleDeviceDao.findAll();
			List<PoleDevice> poleDeviceList = new ArrayList<PoleDevice>();
			Iterator<PoleDeviceDto> itr = poleDeviceDtoList.iterator();
			while (itr.hasNext()) {
				PoleDeviceDto poleDeviceDto = itr.next();
				PoleDevice poleDevice = utilElectrical.copyResponseObjectForPoleDevice(poleDeviceDto);
				poleDeviceList.add(poleDevice);
			}
			return poleDeviceList;
		} catch (Exception e) {
			return null;
		}
	}

	public PoleDevice getPoleDeviceById(Integer poleDeviceId) {
		try {
			PoleDeviceDto poleDeviceDto = poleDeviceDao.findByIds(poleDeviceId);
			return utilElectrical.copyResponseObjectForPoleDevice(poleDeviceDto);
		} catch (Exception e) {
			return null;
		}

	}

	@Transactional
	// Method to delete the poleDevices
	public Boolean disablePoleDevice(Integer poleDeviceId) {
		try {
			PoleDeviceDto poleDeviceDto = poleDeviceDao.findByIds(poleDeviceId);
			poleDeviceDto.setIsActive(false);
			poleDeviceDto.setEndDate(new Date(System.currentTimeMillis()));
			List<PolePoleDeviceMappingDto> polePoleDeviceMappingDtos = poleDeviceDto.getPolePoleDeviceMapping();
			Iterator<PolePoleDeviceMappingDto> itr = polePoleDeviceMappingDtos.iterator();
			while (itr.hasNext()) {
				PolePoleDeviceMappingDto polePoleDeviceMappingDto = itr.next();
				polePoleDeviceMappingDto.setIsActive(false);
				polePoleDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
			}
			poleDeviceDao.save(poleDeviceDto);

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public PoleDevice updatePoleDevice(PoleDevice poleDevice) {
		try {
			PoleDeviceDto poleDeviceDto = poleDeviceDao.findByIds(poleDevice.getPoleDeviceId());
			if (poleDevice.getNumber() != null)
				poleDeviceDto.setNumber(poleDevice.getNumber());

			if (poleDevice.getVendorId() != null)
				poleDeviceDto.setVendorId(poleDevice.getVendorId());

			if (poleDevice.getInstallationDate() != null)
				poleDeviceDto.setInstallationDate(poleDevice.getInstallationDate());

			if (poleDevice.getSimNumber() != null)
				poleDeviceDto.setSimNumber(poleDevice.getSimNumber());

			if (poleDevice.getMobileNumber() != null)
				poleDeviceDto.setMobileNumber(poleDevice.getMobileNumber());

			if (poleDevice.getTelecomOperator() != null && !poleDevice.getTelecomOperator().trim().isEmpty())
				poleDeviceDto.setTelecomOperator(poleDevice.getTelecomOperator());

			if (poleDevice.getTerminal() != null)
				poleDeviceDto.setTerminal(poleDevice.getTerminal());

			if (poleDevice.getPolePoleDeviceMapping() != null && !poleDevice.getPolePoleDeviceMapping().isEmpty()) {
				List<PolePoleDeviceMapping> polePoleDeviceMappingList = poleDevice.getPolePoleDeviceMapping();
				List<PolePoleDeviceMappingDto> polePoleDeviceMappingDtoList = poleDeviceDto.getPolePoleDeviceMapping();
				List<PolePoleDeviceMappingDto> polePoleDeviceMappingDtoResult = new ArrayList<PolePoleDeviceMappingDto>();
				Iterator<PolePoleDeviceMapping> Itr = polePoleDeviceMappingList.iterator();
				while (Itr.hasNext()) {
					PolePoleDeviceMapping polePoleDeviceMapping = Itr.next();
					if (polePoleDeviceMapping.getPolePoleDeviceMappingId() != null) {
						for (PolePoleDeviceMappingDto polePoleDeviceMappingDto : polePoleDeviceMappingDtoList) {
							if (polePoleDeviceMappingDto.getPolePoleDeviceMappingId() == polePoleDeviceMapping
									.getPolePoleDeviceMappingId()) {
								polePoleDeviceMappingDtoResult.add(polePoleDeviceMappingDto);
							}
						}
					} else {
						PolePoleDeviceMappingDto polePoleDeviceMappingDto = new PolePoleDeviceMappingDto();
						polePoleDeviceMappingDto.setPoleDeviceId(polePoleDeviceMapping.getPoleDeviceId());
						polePoleDeviceMappingDto.setPoleId(polePoleDeviceMapping.getPoleId());
						polePoleDeviceMappingDto.setStartDate(new Date(System.currentTimeMillis()));
						polePoleDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
						polePoleDeviceMappingDto.setIsActive(true);
						polePoleDeviceMappingDtoResult.add(polePoleDeviceMappingDto);
					}
				}
				poleDeviceDto.setPolePoleDeviceMapping(polePoleDeviceMappingDtoResult);
			}
			try {

				polePoleDeviceMappingDao.deleteWhereIdIsNull();

			} catch (Exception e) {
				poleDevice = utilElectrical.copyResponseObjectForPoleDevice(poleDeviceDao.save(poleDeviceDto));
				return poleDevice;
			}

			poleDevice = utilElectrical.copyResponseObjectForPoleDevice(poleDeviceDao.save(poleDeviceDto));
			return poleDevice;
		} catch (Exception e) {
			return null;
		}
	}

//	public CustomPolePoleDevice getPoleDeviceByPoleId(Integer poleId) {
//		CustomPolePoleDevice customPolePoleDevice = new CustomPolePoleDevice();
//
//		List<PoleDevice> poleDevicesList = new ArrayList<PoleDevice>();
//		List<Object[]> list = poleDao.getPoleByPoleId(poleId);
//		Iterator<Object[]> itr = list.iterator();
//		while (itr.hasNext()) {
//			Object[] o = itr.next();
//			customPolePoleDevice.setPoleId((Integer) o[0]);
//			customPolePoleDevice.setNumber((String) o[1]);
//		}
//		List<PoleDevice> poleList = new ArrayList<PoleDevice>();
//		List<Integer> integers = polePoleDeviceMappingDao.getPoleDeviceIdsByPoleId(poleId);
//		Iterator<Integer> itr1 = integers.iterator();
//
//		while (itr1.hasNext()) {
//			Integer i = itr1.next();
//			PoleDeviceDto poleDeviceDto = poleDeviceDao.findByIds(i);
//			PoleDevice poleDevice = utilElectrical.copyResponseObjectForPoleDevice(poleDeviceDto);
//			poleDevicesList.add(poleDevice);
//		}
//		customPolePoleDevice.setPoleDeviceList(poleDevicesList);
//		return customPolePoleDevice;
//	}

	public HashMap<String, Object> getPoleDeviceByPoleId(Integer poleId) {
		try {
			HashMap<String, Object> customPolePoleDevice = new HashMap<String, Object>();

			List<PoleDevice> poleDevicesList = new ArrayList<PoleDevice>();
			List<Object[]> list = poleDao.getPoleByPoleId(poleId);
			Iterator<Object[]> itr = list.iterator();
			while (itr.hasNext()) {
				Object[] o = itr.next();
				customPolePoleDevice.put("poleId", (Integer) o[0]);
				customPolePoleDevice.put("number", (String) o[1]);
			}
			List<PoleDevice> poleList = new ArrayList<PoleDevice>();
			List<Integer> integers = polePoleDeviceMappingDao.getPoleDeviceIdsByPoleId(poleId);
			Iterator<Integer> itr1 = integers.iterator();

			while (itr1.hasNext()) {
				Integer i = itr1.next();
				PoleDeviceDto poleDeviceDto = poleDeviceDao.findByIds(i);
				PoleDevice poleDevice = utilElectrical.copyResponseObjectForPoleDevice(poleDeviceDto);
				poleDevicesList.add(poleDevice);
			}
			customPolePoleDevice.put("poleDeviceList", poleDevicesList);
			return customPolePoleDevice;

		} catch (Exception e) {
			return null;
		}
	}

}
