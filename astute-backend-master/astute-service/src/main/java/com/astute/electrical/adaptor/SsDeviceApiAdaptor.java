package com.astute.electrical.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.electrical.dtos.SsDevice;
import com.astute.electrical.dtos.SubstationDeviceMapping;
import com.astute.electrical.models.SsDeviceDto;
import com.astute.electrical.models.SubstationDeviceMappingDto;
import com.astute.electrical.models.SubstationDto;
import com.astute.electrical.repository.SsDeviceDao;
import com.astute.electrical.repository.SubstationDao;
import com.astute.electrical.repository.SubstationDeviceMappingDao;
import com.astute.electrical.repository.VcbDao;
import com.astute.util.UtilElectrical;

@Component
public class SsDeviceApiAdaptor {

	@Autowired
	private SsDeviceDao ssDeviceDao;

	@Autowired
	private UtilElectrical utilElectrical;

	@Autowired
	private SubstationDao substationDao;

	@Autowired
	private SubstationDeviceMappingDao substationDeviceMappingDao;

	@Autowired
	private VcbDao vcbDao;

	@Transactional
	public SsDevice addSsDevice(SsDevice ssDevice) {
		try {
			SsDeviceDto ssDeviceDto = utilElectrical.copyRequestObjectForSsDevice(ssDevice);
			ssDeviceDto.setStartDate(new Date(System.currentTimeMillis()));
			ssDeviceDto.setEndDate(new Date(System.currentTimeMillis()));
			ssDeviceDto.setIsActive(true);
			ssDevice = utilElectrical.copyResponseObjectForSsDevice(ssDeviceDao.save(ssDeviceDto));
			return ssDevice;
		} catch (Exception e) {
			return null;
		}

	}

	@Transactional
	public Boolean disableSsDevice(Integer ssDeviceId) {
		try {
			Integer count = vcbDao.getCount(ssDeviceId);
			if (count == 0) {
				SsDeviceDto ssDeviceDto = ssDeviceDao.findByIds(ssDeviceId);
				ssDeviceDto.setIsActive(false);
				ssDeviceDto.setEndDate(new Date(System.currentTimeMillis()));
				List<SubstationDeviceMappingDto> substationDeviceMappingDtos = ssDeviceDto.getSubstationDeviceMapping();
				Iterator<SubstationDeviceMappingDto> itr = substationDeviceMappingDtos.iterator();
				while (itr.hasNext()) {
					SubstationDeviceMappingDto substationDeviceMappingDto = itr.next();
					substationDeviceMappingDto.setIsActive(false);
					substationDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
				}
				ssDeviceDao.save(ssDeviceDto);
				return true;
			}
			return false;
		} catch (Exception e) {
			return false;
		}
	}

//	public CustomSubstationSsDevice getSsDeviceBySubstationId(Integer substationId) {
//		CustomSubstationSsDevice customSubstationSsDevice = new CustomSubstationSsDevice();
//		List<SsDevice> ssDevicesList = new ArrayList<SsDevice>();
//		SubstationDto substationDto = substationDao.findSubstationDtoById(substationId);
//		customSubstationSsDevice.setSubstationId(substationDto.getSubstationId());
//		customSubstationSsDevice.setName(substationDto.getName());
//		List<Integer> integers = substationDeviceMappingDao.getSsDeviceIdBySubstationId(substationId);
//		Iterator<Integer> itr = integers.iterator();
//		while (itr.hasNext()) {
//			Integer i = itr.next();
//			SsDeviceDto ssDeviceDto = ssDeviceDao.findByIds(i);
//			SsDevice ssDevice = utilElectrical.copyResponseObjectForSsDevice(ssDeviceDto);
//			ssDevicesList.add(ssDevice);
//		}
//		customSubstationSsDevice.setSsDeviceList(ssDevicesList);
//		return customSubstationSsDevice;
//	}

	public HashMap<String, Object> getSsDeviceBySubstationId(Integer substationId) {
		try {
			HashMap<String, Object> hash = new HashMap<>();
			List<SsDevice> ssDevicesList = new ArrayList<SsDevice>();
			SubstationDto substationDto = substationDao.findSubstationDtoById(substationId);
			hash.put("substationId", substationDto.getSubstationId());
			hash.put("name", substationDto.getName());
			List<Integer> integers = substationDeviceMappingDao.getSsDeviceIdBySubstationId(substationId);
			Iterator<Integer> itr = integers.iterator();
			while (itr.hasNext()) {
				Integer i = itr.next();
				SsDeviceDto ssDeviceDto = ssDeviceDao.findByIds(i);
				SsDevice ssDevice = utilElectrical.copyResponseObjectForSsDevice(ssDeviceDto);
				ssDevicesList.add(ssDevice);
			}
			hash.put("ssDeviceList", ssDevicesList);
			return hash;
		} catch (Exception e) {
			return null;
		}
	}

	public SsDevice updateSsDevice(SsDevice ssDevice) {
		try {
			SsDeviceDto ssDeviceDto = ssDeviceDao.findByIds(ssDevice.getSsDeviceId());
			if (ssDevice.getNumber() != null)
				ssDeviceDto.setNumber(ssDevice.getNumber());

			if (ssDevice.getVendorId() != null)
				ssDeviceDto.setVendorId(ssDevice.getVendorId());

			if (ssDevice.getInstallationDate() != null)
				ssDeviceDto.setInstallationDate(ssDevice.getInstallationDate());

			if (ssDevice.getSimNumber() != null)
				ssDeviceDto.setSimNumber(ssDevice.getSimNumber());

			if (ssDevice.getMobileNumber() != null)
				ssDeviceDto.setMobileNumber(ssDevice.getMobileNumber());

			if (ssDevice.getTelecomOperator() != null && !ssDevice.getTelecomOperator().trim().isEmpty())
				ssDeviceDto.setTelecomOperator(ssDevice.getTelecomOperator());

			if (ssDevice.getSubstationDeviceMapping() != null && !ssDevice.getSubstationDeviceMapping().isEmpty()) {
				List<SubstationDeviceMapping> substationDeviceMappingList = ssDevice.getSubstationDeviceMapping();
				List<SubstationDeviceMappingDto> substationDeviceMappingDtoList = ssDeviceDto
						.getSubstationDeviceMapping();
				List<SubstationDeviceMappingDto> substationDeviceMappingDtoResult = new ArrayList<SubstationDeviceMappingDto>();
				Iterator<SubstationDeviceMapping> Itr = substationDeviceMappingList.iterator();
				while (Itr.hasNext()) {
					SubstationDeviceMapping substationDeviceMapping = Itr.next();
					if (substationDeviceMapping.getSubstationDeviceMappingId() != null) {
						for (SubstationDeviceMappingDto substationDeviceMappingDto : substationDeviceMappingDtoList) {
							if (substationDeviceMappingDto.getSubstationDeviceMappingId() == substationDeviceMapping
									.getSubstationDeviceMappingId()) {
								substationDeviceMappingDtoResult.add(substationDeviceMappingDto);
							}
						}
					} else {
						SubstationDeviceMappingDto substationDeviceMappingDto = new SubstationDeviceMappingDto();
						substationDeviceMappingDto.setSsDeviceId(substationDeviceMappingDto.getSsDeviceId());
						substationDeviceMappingDto.setSubstationId(substationDeviceMappingDto.getSubstationId());
						substationDeviceMappingDto.setStartDate(new Date(System.currentTimeMillis()));
						substationDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
						substationDeviceMappingDto.setIsActive(true);
						substationDeviceMappingDtoResult.add(substationDeviceMappingDto);
					}
				}
				ssDeviceDto.setSubstationDeviceMapping(substationDeviceMappingDtoResult);
			}
			SsDeviceDto s1 = ssDeviceDao.save(ssDeviceDto);
			try {

				substationDeviceMappingDao.deleteWhereIdIsNull();

			} catch (Exception e) {
				ssDevice = utilElectrical.copyResponseObjectForSsDevice(s1);
				return ssDevice;
			}

			ssDevice = utilElectrical.copyResponseObjectForSsDevice(s1);
			return ssDevice;
		} catch (Exception e) {
			return null;
		}
	}
}
