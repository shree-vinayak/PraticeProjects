package com.astute.electrical.adaptor;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.electrical.dtos.SsDevice;
import com.astute.electrical.models.VcbDto;
import com.astute.electrical.repository.VcbDao;
import com.astute.util.UtilElectrical;

@Component
public class VcbApiAdaptor {

	@Autowired
	private UtilElectrical utilElectrical;

	@Autowired
	private VcbDao vcbDao;

	@Transactional
	public SsDevice addVcb(SsDevice ssDevice) {
		List<VcbDto> vcbDtoList = utilElectrical.copyRequestObjectForVcb(ssDevice);
		vcbDtoList = vcbDao.saveAll(vcbDtoList);
		SsDevice ssDevice1 = null;
		if (vcbDtoList != null) {
			ssDevice1 = utilElectrical.copyResponseObjectForVcb(vcbDtoList);
			ssDevice1.setSsDeviceId(ssDevice.getSsDeviceId());
			return ssDevice1;
		}
		return null;
	}

	@Transactional
	public Boolean deleteVcb(Integer id) {
		try {
			VcbDto vcbDto = vcbDao.findVcb(id);
			vcbDto.setEndDate(new Date(System.currentTimeMillis()));
			vcbDto.setIsActive(false);
			vcbDao.save(vcbDto);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public SsDevice getVcb(Integer ssDeviceId) {
		List<VcbDto> vcbDtoList = vcbDao.findAllActiveVcb(ssDeviceId);
		SsDevice ssDevice = utilElectrical.copyResponseObjectForVcb(vcbDtoList);
		ssDevice.setSsDeviceId(ssDeviceId);
		if (ssDevice != null)
			return ssDevice;
		return null;
	}

	public SsDevice updateVcb(SsDevice ssDevice) {
		// TODO Auto-generated method stub
		return null;
	}
}
