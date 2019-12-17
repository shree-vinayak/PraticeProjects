package com.astute.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.astute.electrical.dtos.Dtr;
import com.astute.electrical.dtos.DtrDevice;
import com.astute.electrical.dtos.DtrDtrDeviceMapping;
import com.astute.electrical.dtos.DtrPoleMapping;
import com.astute.electrical.dtos.EhvSs;
import com.astute.electrical.dtos.EhvSsCircleMapping;
import com.astute.electrical.dtos.Feeder11kv;
import com.astute.electrical.dtos.Feeder11kvDtrMapping;
import com.astute.electrical.dtos.Feeder11kvPtrMapping;
import com.astute.electrical.dtos.Line33kv;
import com.astute.electrical.dtos.Line33kvPtrMapping;
import com.astute.electrical.dtos.Pole;
import com.astute.electrical.dtos.PoleDevice;
import com.astute.electrical.dtos.PolePoleDeviceMapping;
import com.astute.electrical.dtos.Ptr;
import com.astute.electrical.dtos.SsDevice;
import com.astute.electrical.dtos.Substation;
import com.astute.electrical.dtos.SubstationDeviceMapping;
import com.astute.electrical.dtos.SubstationFeeder11kvMapping;
import com.astute.electrical.dtos.Vcb;
import com.astute.electrical.dtos.ZoneFeeder11kvMapping;
import com.astute.electrical.models.DtrDeviceDto;
import com.astute.electrical.models.DtrDto;
import com.astute.electrical.models.DtrDtrDeviceMappingDto;
import com.astute.electrical.models.DtrPoleMappingDto;
import com.astute.electrical.models.EhvSsCircleMappingDto;
import com.astute.electrical.models.EhvSsDto;
import com.astute.electrical.models.Feeder11kvDto;
import com.astute.electrical.models.Feeder11kvDtrMappingDto;
import com.astute.electrical.models.Feeder11kvPtrMappingDto;
import com.astute.electrical.models.Line33kvDto;
import com.astute.electrical.models.Line33kvPtrMappingDto;
import com.astute.electrical.models.PoleDeviceDto;
import com.astute.electrical.models.PoleDto;
import com.astute.electrical.models.PolePoleDeviceMappingDto;
import com.astute.electrical.models.PtrDto;
import com.astute.electrical.models.SsDeviceDto;
import com.astute.electrical.models.Substation33kvlineMappingDto;
import com.astute.electrical.models.SubstationDeviceMappingDto;
import com.astute.electrical.models.SubstationDto;
import com.astute.electrical.models.SubstationFeeder11kvMappingDto;
import com.astute.electrical.models.VcbDto;
import com.astute.electrical.models.ZoneFeeder11kvMappingDto;
import com.astute.electrical.models.ZoneSubstationMappingDto;

@Component
public class UtilElectrical {

	@Autowired
	private DiscomUtil util;

	@Autowired
	private ModelMapper modelMapper;

	// Method to copy EhvSs object into EhvSsDto object
	public EhvSsDto copyRequestObjectForEhvSs(EhvSs ehvSs) {

		EhvSsDto ehvSsDto = new EhvSsDto();

		if (ehvSs != null) {

			if (ehvSs.getEhvSsId() != null) {
				ehvSsDto.setEhvSsId(ehvSs.getEhvSsId());
			}
			if (ehvSs.getName() != null && ehvSs.getName().trim() != "") {
				ehvSsDto.setName(ehvSs.getName());
			}
			if (ehvSs.getEhvSsCircleMapping() != null) {
				List<EhvSsCircleMapping> ehvSsCircleMappingList = ehvSs.getEhvSsCircleMapping();
				List<EhvSsCircleMappingDto> ehvSsCircleMappingDtoList = new ArrayList<EhvSsCircleMappingDto>();
				Iterator<EhvSsCircleMapping> itr = ehvSsCircleMappingList.iterator();
				while (itr.hasNext()) {
					EhvSsCircleMapping ehvSsCircleMapping = itr.next();
					EhvSsCircleMappingDto ehvSsCircleMappingDto = new EhvSsCircleMappingDto();
					if (ehvSsCircleMapping.getEhvSsId() != null)
						ehvSsCircleMappingDto.setEhvSsId(ehvSsCircleMapping.getEhvSsId());
					if (ehvSsCircleMapping.getIdCircle() != null)
						ehvSsCircleMappingDto.setIdCircle(ehvSsCircleMapping.getIdCircle());
					ehvSsCircleMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					ehvSsCircleMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					ehvSsCircleMappingDto.setIsActive(true);
					ehvSsCircleMappingDtoList.add(ehvSsCircleMappingDto);
				}

				ehvSsDto.setEhvSsCircleMapping(ehvSsCircleMappingDtoList);
			}
			return ehvSsDto;
		}
		return null;
	}

	// Method to convert the EhvSsDto object into EhvSs
	public EhvSs copyResponseObjectForEhvSs(EhvSsDto ehvSsDto) {
		EhvSs ehvSs = modelMapper.map(ehvSsDto, EhvSs.class);
		return ehvSs;
	}

	// method to convert the Feeder11kv object into Feeder11kvDto
	public Feeder11kvDto copyRequestObjectForFeeder11kv(Feeder11kv feeder11kv) {
		Feeder11kvDto feeder11kvDto = new Feeder11kvDto();
		if (feeder11kv != null) {
			if (feeder11kv.getFeeder11kvId() != null) {
				feeder11kvDto.setFeeder11kvId(feeder11kv.getFeeder11kvId());
			}
			if (feeder11kv.getFeederSupply() != null && feeder11kv.getFeederSupply().trim() != "") {
				feeder11kvDto.setFeederSupply(feeder11kv.getFeederSupply());
			}
			if (feeder11kv.getFeederType() != null && feeder11kv.getFeederType().trim() != "") {
				feeder11kvDto.setFeederType(feeder11kv.getFeederType());
			}

			if (feeder11kv.getName() != null && feeder11kv.getName().trim() != "") {
				feeder11kvDto.setName(feeder11kv.getName());
			}
			if (feeder11kv.getFeeder11kvPtrMapping() != null) {
				List<Feeder11kvPtrMapping> feeder11kvMappingList = feeder11kv.getFeeder11kvPtrMapping();
				List<Feeder11kvPtrMappingDto> feeder11kvMappingDtoList = new ArrayList<Feeder11kvPtrMappingDto>();
				Iterator<Feeder11kvPtrMapping> itr = feeder11kvMappingList.iterator();
				while (itr.hasNext()) {
					Feeder11kvPtrMapping feeder11kvMapping = itr.next();
					Feeder11kvPtrMappingDto feeder11kvPtrMappingDto = new Feeder11kvPtrMappingDto();
					if (feeder11kvMapping.getFeeder11kvPtrMappingId() != null) {
						feeder11kvPtrMappingDto
								.setFeeder11kvPtrMappingId(feeder11kvMapping.getFeeder11kvPtrMappingId());
					}
					if (feeder11kvMapping.getPtrId() != null)
						feeder11kvPtrMappingDto.setPtrId(feeder11kvMapping.getPtrId());
					if (feeder11kvMapping.getFeeder11kvId() != null) {
						feeder11kvPtrMappingDto.setFeeder11kvId(feeder11kvMapping.getFeeder11kvId());
					}
					feeder11kvPtrMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					feeder11kvPtrMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					feeder11kvPtrMappingDto.setIsActive(true);
					feeder11kvMappingDtoList.add(feeder11kvPtrMappingDto);
				}
				feeder11kvDto.setFeeder11kvPtrMapping(feeder11kvMappingDtoList);
			}
			if (feeder11kv.getSsFeeder11kvMapping() != null) {
				List<SubstationFeeder11kvMapping> ssFeeder11kvMappingList = feeder11kv.getSsFeeder11kvMapping();
				List<SubstationFeeder11kvMappingDto> ssFeeder11kvMappingDtoList = new ArrayList<SubstationFeeder11kvMappingDto>();
				Iterator<SubstationFeeder11kvMapping> itr = ssFeeder11kvMappingList.iterator();
				while (itr.hasNext()) {
					SubstationFeeder11kvMapping ssFeeder11kvMapping = itr.next();
					SubstationFeeder11kvMappingDto ssFeeder11kvMappingDto = new SubstationFeeder11kvMappingDto();
					if (ssFeeder11kvMapping.getFeeder11kvId() != null) {
						ssFeeder11kvMappingDto.setFeeder11kvId(ssFeeder11kvMapping.getFeeder11kvId());
					}
					if (ssFeeder11kvMapping.getSsFeeder11kvMappingId() != null) {
						ssFeeder11kvMappingDto.setSsFeeder11kvMappingId(ssFeeder11kvMapping.getSsFeeder11kvMappingId());
					}
					if (ssFeeder11kvMapping.getSubstationId() != null) {
						ssFeeder11kvMappingDto.setSubstationId(ssFeeder11kvMapping.getSubstationId());
					}
					ssFeeder11kvMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					ssFeeder11kvMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					ssFeeder11kvMappingDto.setIsActive(true);
					ssFeeder11kvMappingDtoList.add(ssFeeder11kvMappingDto);
				}
				feeder11kvDto.setSsFeeder11kvMapping(ssFeeder11kvMappingDtoList);
			}
			if (feeder11kv.getZoneFeeder11kvMapping() != null) {
				List<ZoneFeeder11kvMapping> zoneFeeder11kvMappingList = feeder11kv.getZoneFeeder11kvMapping();
				List<ZoneFeeder11kvMappingDto> zoneFeeder11kvMappingDtoList = new ArrayList<ZoneFeeder11kvMappingDto>();
				Iterator<ZoneFeeder11kvMapping> itr = zoneFeeder11kvMappingList.iterator();
				while (itr.hasNext()) {
					ZoneFeeder11kvMapping zoneFeeder11kvMapping = itr.next();
					ZoneFeeder11kvMappingDto zoneFeeder11kvMappingDto = new ZoneFeeder11kvMappingDto();
					if (zoneFeeder11kvMapping.getFeeder11kvId() != null) {
						zoneFeeder11kvMappingDto.setFeeder11kvId(zoneFeeder11kvMappingDto.getFeeder11kvId());
					}

					if (zoneFeeder11kvMapping.getZoneFeeder11kvMappingId() != null) {
						zoneFeeder11kvMappingDto
								.setZoneFeeder11kvMappingId(zoneFeeder11kvMappingDto.getZoneFeeder11kvMappingId());
					}
					;
					if (zoneFeeder11kvMapping.getIdZone() != null) {
						zoneFeeder11kvMappingDto.setIdZone(zoneFeeder11kvMapping.getIdZone());
					}
					zoneFeeder11kvMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					zoneFeeder11kvMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					zoneFeeder11kvMappingDto.setIsActive(true);
					zoneFeeder11kvMappingDtoList.add(zoneFeeder11kvMappingDto);
				}
				feeder11kvDto.setZoneFeeder11kvMapping(zoneFeeder11kvMappingDtoList);
			}

			return feeder11kvDto;
		}
		return null;

	}

	public Feeder11kv copyResponseObjectForFeeder11kv(Feeder11kvDto feeder11kvDto) {
		Feeder11kv feeder11kv = modelMapper.map(feeder11kvDto, Feeder11kv.class);
		return feeder11kv;
	}

	public PoleDeviceDto copyRequestObjectForPoleDevice(PoleDevice poleDevice) {
		PoleDeviceDto poleDeviceDto = new PoleDeviceDto();
		if (poleDevice != null) {
			if (poleDevice.getPoleDeviceId() != null) {
				poleDeviceDto.setPoleDeviceId(poleDevice.getPoleDeviceId());
			}
			if (poleDevice.getMobileNumber() != null)
				poleDeviceDto.setMobileNumber(poleDevice.getMobileNumber());

			if (poleDevice.getInstallationDate() != null)
				poleDeviceDto.setInstallationDate(poleDevice.getInstallationDate());

			if (poleDevice.getNumber() != null)
				poleDeviceDto.setNumber(poleDevice.getNumber());

			if (poleDevice.getSimNumber() != null)
				poleDeviceDto.setSimNumber(poleDevice.getSimNumber());

			if (poleDevice.getTelecomOperator() != null && poleDevice.getTelecomOperator().trim() != "")
				poleDeviceDto.setTelecomOperator(poleDevice.getTelecomOperator());

			if (poleDevice.getVendorId() != null)
				poleDeviceDto.setVendorId(poleDevice.getVendorId());

			if (poleDevice.getTerminal() != null)
				poleDeviceDto.setTerminal(poleDevice.getTerminal());

			if (poleDevice.getPolePoleDeviceMapping() != null) {
				List<PolePoleDeviceMapping> polePoleDeviceMappingList = poleDevice.getPolePoleDeviceMapping();
				List<PolePoleDeviceMappingDto> poleDeviceMappingDtoList = new ArrayList<PolePoleDeviceMappingDto>();
				Iterator<PolePoleDeviceMapping> itr = polePoleDeviceMappingList.iterator();
				while (itr.hasNext()) {
					PolePoleDeviceMapping polePoleDeviceMapping = itr.next();
					PolePoleDeviceMappingDto polePoleDeviceMappingDto = new PolePoleDeviceMappingDto();
					if (polePoleDeviceMapping.getPoleDeviceId() != null)
						polePoleDeviceMappingDto.setPoleDeviceId(polePoleDeviceMapping.getPoleDeviceId());
					if (polePoleDeviceMapping.getPoleId() != null)
						polePoleDeviceMappingDto.setPoleId(polePoleDeviceMapping.getPoleId());
					if (polePoleDeviceMapping.getPolePoleDeviceMappingId() != null)
						polePoleDeviceMappingDto
								.setPolePoleDeviceMappingId(polePoleDeviceMapping.getPolePoleDeviceMappingId());
					polePoleDeviceMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					polePoleDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					polePoleDeviceMappingDto.setIsActive(true);
					poleDeviceMappingDtoList.add(polePoleDeviceMappingDto);
				}
				poleDeviceDto.setPolePoleDeviceMapping(poleDeviceMappingDtoList);
			}
			return poleDeviceDto;

		}
		return null;
	}

	public PoleDevice copyResponseObjectForPoleDevice(PoleDeviceDto poleDeviceDto) {
		return modelMapper.map(poleDeviceDto, PoleDevice.class);
	}

	public PtrDto copyRequestObjectForPtr(Ptr ptr) {
		PtrDto ptrDto = new PtrDto();
		if (ptr != null) {
			if (ptr.getPtrId() != null) {
				ptrDto.setPtrId(ptr.getPtrId());
			}
			if (ptr.getName() != null && ptr.getName().trim() != "") {
				ptrDto.setName(ptr.getName());
			}
			if (ptr.getMake() != null && ptr.getMake().trim() != "") {
				ptrDto.setMake(ptr.getMake());
			}
			if (ptr.getSubstationId() != null) {
				ptrDto.setSubstationId(ptr.getSubstationId());
			}
			if (ptr.getYearOfManufacturing() != null) {
				ptrDto.setYearOfManufacturing(ptr.getYearOfManufacturing());
			}

			if (ptr.getCapacity() != null) {
				ptrDto.setCapacity(ptr.getCapacity());
			}
			// ! TODO Feeder11kvPtrMapping
			if (ptr.getLine33kvPtrMapping() != null) {
				List<Line33kvPtrMapping> line33kvPtrMappingList = ptr.getLine33kvPtrMapping();
				List<Line33kvPtrMappingDto> line33kvPtrMappingDtoList = new ArrayList<Line33kvPtrMappingDto>();
				Iterator<Line33kvPtrMapping> line33kvPtrMappingItr = line33kvPtrMappingList.iterator();
				while (line33kvPtrMappingItr.hasNext()) {
					Line33kvPtrMapping line33kvPtrMapping = line33kvPtrMappingItr.next();
					Line33kvPtrMappingDto line33kvPtrMappingDto = new Line33kvPtrMappingDto();
					line33kvPtrMappingDto.setLine33kvId(line33kvPtrMapping.getLine33kvId());
					line33kvPtrMappingDto.setLine33kvPtrMappingId(line33kvPtrMapping.getLine33kvPtrMappingId());
					;
					line33kvPtrMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					line33kvPtrMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					line33kvPtrMappingDto.setIsActive(true);
					line33kvPtrMappingDtoList.add(line33kvPtrMappingDto);
				}
				ptrDto.setLine33kvPtrMapping(line33kvPtrMappingDtoList);
			}
			return ptrDto;
		}
		return null;
	}

	public Ptr copyResponseObjectForPtr(PtrDto ptrDto) {
		Ptr ptr = modelMapper.map(ptrDto, Ptr.class);
		return ptr;
	}

	// Method to convert dtr object to DtrDto object
	public DtrDto copyRequestObjectForDtr(Dtr dtr) {
		DtrDto dtrDto = new DtrDto();
		if (dtr != null) {
			if (dtr.getDtrId() != null) {
				dtrDto.setDtrId(dtr.getDtrId());
			}
			if (dtr.getMake() != null && dtr.getMake().trim() != "")
				dtrDto.setMake(dtr.getMake());
			if (dtr.getCapacity() != null && dtr.getCapacity().trim() != "")
				dtrDto.setCapacity(dtr.getCapacity());
			if (dtr.getName() != null && dtr.getName().trim() != "")
				dtrDto.setName(dtr.getName());
			if (dtr.getYearOfManufacturing() != null)
				dtrDto.setYearOfManufacturing(dtr.getYearOfManufacturing());
			if (dtr.getDtrDtrDeviceMapping() != null) {
				List<DtrDtrDeviceMapping> dtrDtrDeciveMappingList = dtr.getDtrDtrDeviceMapping();
				List<DtrDtrDeviceMappingDto> dtrDtrDeviceMappingDtoList = new ArrayList<DtrDtrDeviceMappingDto>();
				Iterator<DtrDtrDeviceMapping> itr = dtrDtrDeciveMappingList.iterator();
				while (itr.hasNext()) {
					DtrDtrDeviceMapping dtrDtrDeviceMapping = itr.next();
					DtrDtrDeviceMappingDto dtrDtrDeviceMappingDto = new DtrDtrDeviceMappingDto();

					if (dtrDtrDeviceMapping.getDtrDeviceId() != null)
						dtrDtrDeviceMappingDto.setDtrDeviceId(dtrDtrDeviceMapping.getDtrDeviceId());
					if (dtrDtrDeviceMapping.getDtrDtrDeviceMappingId() != null)
						dtrDtrDeviceMappingDto.setDtrDtrDeviceMappingId(dtrDtrDeviceMapping.getDtrDtrDeviceMappingId());
					if (dtrDtrDeviceMapping.getDtrId() != null)
						dtrDtrDeviceMappingDto.setDtrId(dtrDtrDeviceMapping.getDtrId());
					dtrDtrDeviceMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					dtrDtrDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					dtrDtrDeviceMappingDto.setIsActive(true);
					dtrDtrDeviceMappingDtoList.add(dtrDtrDeviceMappingDto);
				}
				dtrDto.setDtrDtrDeviceMapping(dtrDtrDeviceMappingDtoList);
			}
			if (dtr.getDtrPoleMapping() != null) {
				List<DtrPoleMapping> dtrPoleMappingList = dtr.getDtrPoleMapping();
				List<DtrPoleMappingDto> dtrPoleMappnigDtoList = new ArrayList<DtrPoleMappingDto>();
				Iterator<DtrPoleMapping> itr = dtrPoleMappingList.iterator();
				while (itr.hasNext()) {
					DtrPoleMapping dtrPoleMapping = itr.next();
					DtrPoleMappingDto dtrPoleMappingDto = new DtrPoleMappingDto();
					if (dtrPoleMapping.getDtrId() != null)
						dtrPoleMappingDto.setDtrId(dtrPoleMapping.getDtrId());
					if (dtrPoleMapping.getPoleId() != null)
						dtrPoleMappingDto.setPoleId(dtrPoleMapping.getPoleId());
					if (dtrPoleMapping.getDtrPoleMappingId() != null)
						dtrPoleMappingDto.setDtrPoleMappingId(dtrPoleMapping.getDtrPoleMappingId());
					dtrPoleMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					dtrPoleMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					dtrPoleMappingDto.setIsActive(true);
					dtrPoleMappnigDtoList.add(dtrPoleMappingDto);
				}
				dtrDto.setDtrPoleMapping(dtrPoleMappnigDtoList);
			}
			if (dtr.getFeeder11kvDtrMapping() != null) {
				List<Feeder11kvDtrMapping> feeder11kvDtrMappingList = dtr.getFeeder11kvDtrMapping();
				List<Feeder11kvDtrMappingDto> feeder11kvDtrMappingDtoList = new ArrayList<Feeder11kvDtrMappingDto>();
				Iterator<Feeder11kvDtrMapping> itr = feeder11kvDtrMappingList.iterator();
				while (itr.hasNext()) {
					Feeder11kvDtrMapping feeder11kvDtrMapping = itr.next();
					Feeder11kvDtrMappingDto feeder11kvDtrMappingDto = new Feeder11kvDtrMappingDto();
					if (feeder11kvDtrMapping.getDtrId() != null)
						feeder11kvDtrMappingDto.setDtrId(feeder11kvDtrMapping.getDtrId());
					if (feeder11kvDtrMapping.getFeeder11kvDtrMappingId() != null)
						feeder11kvDtrMappingDto
								.setFeeder11kvDtrMappingId(feeder11kvDtrMapping.getFeeder11kvDtrMappingId());
					if (feeder11kvDtrMapping.getFeeder11kvId() != null)
						feeder11kvDtrMappingDto.setFeeder11kvId(feeder11kvDtrMapping.getFeeder11kvId());
					feeder11kvDtrMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					feeder11kvDtrMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					feeder11kvDtrMappingDto.setIsActive(true);
					feeder11kvDtrMappingDtoList.add(feeder11kvDtrMappingDto);
				}
				dtrDto.setFeeder11kvDtrMapping(feeder11kvDtrMappingDtoList);

			}
			return dtrDto;
		}
		return null;
	}

	public Dtr copyResponseObjectForDtr(DtrDto dtrDto) {
		return modelMapper.map(dtrDto, Dtr.class);
	}

	// method to convert Line33kv object to Line33kvDto object
	public Line33kvDto copyRequestObjectForLine33kv(Line33kv line33kv) {

		Line33kvDto line33kvDto = new Line33kvDto();
		if (line33kv != null) {

			if (line33kv.getLine33kvId() != null) {
				line33kvDto.setLine33kvId(line33kv.getLine33kvId());
			}

			if (line33kv.getName() != null && !line33kv.getName().trim().isEmpty())
				line33kvDto.setName(line33kv.getName());

			if (line33kv.getEhvSsid() != null)
				line33kvDto.setEhvSsId(line33kv.getEhvSsid());

			return line33kvDto;
		}
		return null;
	}

	public Line33kv copyResponseObjectForLine33kv(Line33kvDto line33kvDto) {
		Line33kv line33kv = modelMapper.map(line33kvDto, Line33kv.class);
		return line33kv;
	}

	public SubstationDto copyRequestObjectForSubstation(Substation substation) {

		SubstationDto substationDto = modelMapper.map(substation, SubstationDto.class);

		SubstationDto substationDto2 = new SubstationDto();
		substationDto2.setName(substationDto.getName());

		if (substationDto.getSubstationId() != null) {
			substationDto2.setSubstationId(substationDto.getSubstationId());
		}
		if (substationDto.getSubstationId() != null) {
			substationDto2.setSubstationId(substationDto.getSubstationId());
		}
		List<Substation33kvlineMappingDto> substation33kvlineMappingDtosList = substationDto
				.getSubstation33kvlineMapping();
		List<Substation33kvlineMappingDto> substation33kvlineMappingDtosList1 = new ArrayList<Substation33kvlineMappingDto>();
		Iterator<Substation33kvlineMappingDto> itr = substation33kvlineMappingDtosList.iterator();
		while (itr.hasNext()) {
			Substation33kvlineMappingDto substation33kvlineMappingDto = itr.next();
			substation33kvlineMappingDto.setSubstationId(substationDto2.getSubstationId());

			substation33kvlineMappingDto.setStartDate(new Date(System.currentTimeMillis()));
			substation33kvlineMappingDto.setEndDate(new Date(System.currentTimeMillis()));
			substation33kvlineMappingDto.setIsActive(true);
			substation33kvlineMappingDtosList1.add(substation33kvlineMappingDto);

		}
		substationDto2.setSubstation33kvlineMapping(substation33kvlineMappingDtosList1);

		List<ZoneSubstationMappingDto> zoneSubstationMappingDtosList = substationDto.getZoneSubstationMapping();
		List<ZoneSubstationMappingDto> zoneSubstationMappingDtosList1 = new ArrayList<ZoneSubstationMappingDto>();

		Iterator<ZoneSubstationMappingDto> itr1 = zoneSubstationMappingDtosList.iterator();

		while (itr1.hasNext()) {
			ZoneSubstationMappingDto zoneSubstationMappingDto = itr1.next();
			zoneSubstationMappingDto.setSubstationId(substationDto2.getSubstationId());
			zoneSubstationMappingDto.setStartDate(new Date(System.currentTimeMillis()));
			zoneSubstationMappingDto.setEndDate(new Date(System.currentTimeMillis()));
			zoneSubstationMappingDto.setIsActive(true);
			zoneSubstationMappingDtosList1.add(zoneSubstationMappingDto);
		}
		substationDto2.setZoneSubstationMapping(zoneSubstationMappingDtosList1);
		return substationDto2;
	}

	public Substation copyResponseObjectForSubstation(SubstationDto substationDto) {
		Substation substation = modelMapper.map(substationDto, Substation.class);
		return substation;
	}

	public DtrDeviceDto copyRequestObjectForDtrDevice(DtrDevice dtrDevice) {

		DtrDeviceDto dtrDeviceDto = new DtrDeviceDto();

		if (dtrDevice.getDtrDeviceId() != null)
			dtrDeviceDto.setDtrDeviceId(dtrDevice.getDtrDeviceId());

		if (dtrDevice.getInstallationDate() != null)
			dtrDeviceDto.setInstallationDate(dtrDevice.getInstallationDate());

		if (dtrDevice.getMobileNumber() != null)
			dtrDeviceDto.setMobileNumber(dtrDevice.getMobileNumber());

		if (dtrDevice.getNumber() != null)
			dtrDeviceDto.setNumber(dtrDevice.getNumber());

		if (dtrDevice.getSimNumber() != null)
			dtrDeviceDto.setSimNumber(dtrDevice.getSimNumber());

		if (dtrDevice.getTelecomOperator() != null && !dtrDevice.getTelecomOperator().trim().isEmpty())
			dtrDeviceDto.setTelecomOperator(dtrDevice.getTelecomOperator());

		if (dtrDevice.getVendorId() != null)
			dtrDeviceDto.setVendorId(dtrDevice.getVendorId());

		if (dtrDevice.getDtrDtrDeviceMapping() != null && !dtrDevice.getDtrDtrDeviceMapping().isEmpty()) {
			List<DtrDtrDeviceMappingDto> dtrDtrDeviceMappingDtoList = new ArrayList<DtrDtrDeviceMappingDto>();
			List<DtrDtrDeviceMapping> dtrDtrDeviceMappingList = dtrDevice.getDtrDtrDeviceMapping();
			Iterator<DtrDtrDeviceMapping> itr = dtrDtrDeviceMappingList.iterator();
			while (itr.hasNext()) {
				DtrDtrDeviceMapping dtrDtrDeviceMapping = itr.next();
				DtrDtrDeviceMappingDto dtrDtrDeviceMappingDto = new DtrDtrDeviceMappingDto();
				if (dtrDtrDeviceMapping.getDtrDtrDeviceMappingId() != null) {
					dtrDtrDeviceMappingDto.setDtrDtrDeviceMappingId(dtrDtrDeviceMapping.getDtrDtrDeviceMappingId());
				}
				if (dtrDtrDeviceMapping.getDtrDeviceId() != null) {
					dtrDtrDeviceMappingDto.setDtrDeviceId(dtrDtrDeviceMapping.getDtrDeviceId());
				}

				if (dtrDtrDeviceMapping.getDtrId() != null) {
					dtrDtrDeviceMappingDto.setDtrId(dtrDtrDeviceMapping.getDtrId());
				}
				dtrDtrDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
				dtrDtrDeviceMappingDto.setIsActive(true);
				dtrDtrDeviceMappingDto.setStartDate(new Date(System.currentTimeMillis()));
				dtrDtrDeviceMappingDtoList.add(dtrDtrDeviceMappingDto);
			}
			dtrDeviceDto.setDtrDtrDeviceMapping(dtrDtrDeviceMappingDtoList);
		}
		return dtrDeviceDto;
	}

	public DtrDevice copyResponseObjectForDtrDevice(DtrDeviceDto dtrDeviceDto) {
		if (dtrDeviceDto != null) {
			DtrDevice dtrDevice = modelMapper.map(dtrDeviceDto, DtrDevice.class);
			return dtrDevice;
		}
		return null;
	}

	public PoleDto copyRequestObjectForPole(Pole pole) {
		PoleDto poleDto = new PoleDto();

		if (pole.getPoleId() != null)
			poleDto.setPoleId(pole.getPoleId());

		if (pole.getNumber() != null)
			poleDto.setNumber(pole.getNumber());

		if (pole.getDtrPoleMapping() != null && !pole.getDtrPoleMapping().isEmpty()) {
			List<DtrPoleMapping> dtrPoleMappinglist = pole.getDtrPoleMapping();
			List<DtrPoleMappingDto> dtrPoleMappingDtoList = new ArrayList<DtrPoleMappingDto>();
			Iterator<DtrPoleMapping> itr = dtrPoleMappinglist.iterator();
			while (itr.hasNext()) {
				DtrPoleMapping dtrPoleMapping = itr.next();
				if (dtrPoleMapping.getDtrId() != null) {
					DtrPoleMappingDto dtrPoleMappingDto = new DtrPoleMappingDto();
					if (dtrPoleMapping.getDtrId() != null) {
						dtrPoleMappingDto.setDtrId(dtrPoleMapping.getDtrId());
					}
					dtrPoleMappingDto.setStartDate(new Date(System.currentTimeMillis()));
					dtrPoleMappingDto.setEndDate(new Date(System.currentTimeMillis()));
					dtrPoleMappingDto.setIsActive(true);
					dtrPoleMappingDtoList.add(dtrPoleMappingDto);
				}
			}
			poleDto.setDtrPoleMapping(dtrPoleMappingDtoList);
		}
		return poleDto;
	}

	public Pole copyResponseObjectForPole(PoleDto poleDto) {
		if (poleDto != null) {
			Pole pole = modelMapper.map(poleDto, Pole.class);
			return pole;
		}
		return null;
	}

	// method to convert the SsDevice Object into SsDevice object
	public SsDeviceDto copyRequestObjectForSsDevice(SsDevice ssDevice) {
		SsDeviceDto ssDeviceDto = new SsDeviceDto();

		if (ssDevice.getSsDeviceId() != null)
			ssDeviceDto.setSsDeviceId(ssDevice.getSsDeviceId());

		if (ssDevice.getInstallationDate() != null)
			ssDeviceDto.setInstallationDate(ssDevice.getInstallationDate());

		if (ssDevice.getMobileNumber() != null)
			ssDeviceDto.setMobileNumber(ssDevice.getMobileNumber());

		if (ssDevice.getNumber() != null)
			ssDeviceDto.setNumber(ssDevice.getNumber());

		if (ssDevice.getSimNumber() != null)
			ssDeviceDto.setSimNumber(ssDevice.getSimNumber());

		if (ssDevice.getTelecomOperator() != null && !ssDevice.getTelecomOperator().trim().isEmpty())
			ssDeviceDto.setTelecomOperator(ssDevice.getTelecomOperator());

		if (ssDevice.getVendorId() != null)
			ssDeviceDto.setVendorId(ssDevice.getVendorId());

		if (ssDevice.getSubstationDeviceMapping() != null && !ssDevice.getSubstationDeviceMapping().isEmpty()) {
			List<SubstationDeviceMappingDto> substationDeviceMappingDtosList = new ArrayList<SubstationDeviceMappingDto>();
			List<SubstationDeviceMapping> substationDeviceMappings = ssDevice.getSubstationDeviceMapping();
			Iterator<SubstationDeviceMapping> itr = substationDeviceMappings.iterator();
			while (itr.hasNext()) {
				SubstationDeviceMapping substationDeviceMapping = itr.next();
				SubstationDeviceMappingDto substationDeviceMappingDto = new SubstationDeviceMappingDto();
				if (substationDeviceMapping.getSubstationDeviceMappingId() != null) {
					substationDeviceMappingDto
							.setSubstationDeviceMappingId(substationDeviceMapping.getSubstationDeviceMappingId());
				}
				if (substationDeviceMapping.getSsDeviceId() != null) {
					substationDeviceMappingDto.setSsDeviceId(substationDeviceMapping.getSsDeviceId());
				}

				if (substationDeviceMapping.getSubstationId() != null) {
					substationDeviceMappingDto.setSubstationId(substationDeviceMapping.getSubstationId());
				}
				substationDeviceMappingDto.setEndDate(new Date(System.currentTimeMillis()));
				substationDeviceMappingDto.setIsActive(true);
				substationDeviceMappingDto.setStartDate(new Date(System.currentTimeMillis()));
				substationDeviceMappingDtosList.add(substationDeviceMappingDto);
			}
			ssDeviceDto.setSubstationDeviceMapping(substationDeviceMappingDtosList);
		}
		return ssDeviceDto;
	}

	// method to convert SsDeviceDto object inot SsDevice object
	public SsDevice copyResponseObjectForSsDevice(SsDeviceDto ssDeviceDto) {
		if (ssDeviceDto != null) {
			SsDevice ssDevice = modelMapper.map(ssDeviceDto, SsDevice.class);
			return ssDevice;
		}
		return null;
	}

	public List<VcbDto> copyRequestObjectForVcb(SsDevice ssDevice) {
		List<VcbDto> vcbDtosList = new ArrayList<VcbDto>();
		if (ssDevice != null) {
			List<Vcb> vcbList = ssDevice.getVcb();
			Iterator<Vcb> itr = vcbList.iterator();
			while (itr.hasNext()) {
				Vcb vcb = itr.next();
				VcbDto vcbDto = new VcbDto();
				if (vcb.getVcbId() != null)
					vcbDto.setVcbId(vcb.getVcbId());
				if (vcb.getName() != null)
					vcbDto.setName(vcb.getName());
				if (vcb.getType() != null)
					vcbDto.setType(vcb.getType());
				if (vcb.getIndex() != null)
					vcbDto.setIndex(vcb.getIndex());
				if (vcb.getSsDeviceId() != null)
					vcbDto.setSsDeviceId(vcb.getSsDeviceId());
				vcbDto.setStartDate(new Date(System.currentTimeMillis()));
				vcbDto.setEndDate(new Date(System.currentTimeMillis()));
				vcbDto.setIsActive(true);
				vcbDtosList.add(vcbDto);

			}

		}
		return vcbDtosList;
	}

	public SsDevice copyResponseObjectForVcb(List<VcbDto> vcbDtoList) {

		SsDevice ssDevice = new SsDevice();
		if (vcbDtoList != null) {
			List<Vcb> vcbList = new ArrayList<Vcb>();
			Iterator<VcbDto> itr = vcbDtoList.iterator();
			while (itr.hasNext()) {
				VcbDto vcbDto = itr.next();
				Vcb vcb = modelMapper.map(vcbDto, Vcb.class);
				vcbList.add(vcb);
			}
			ssDevice.setVcb(vcbList);

			return ssDevice;

		}
		return null;
	}
}
