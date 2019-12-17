package com.astute.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.astute.discom.dtos.Address;
import com.astute.discom.dtos.Circle;
import com.astute.discom.dtos.Company;
import com.astute.discom.dtos.Division;
import com.astute.discom.dtos.Region;
import com.astute.discom.dtos.State;
import com.astute.discom.dtos.Subdivision;
import com.astute.discom.dtos.Zone;
import com.astute.discom.models.AddressDto;
import com.astute.discom.models.CircleDto;
import com.astute.discom.models.CompanyDto;
import com.astute.discom.models.DivisionDto;
import com.astute.discom.models.RegionDto;
import com.astute.discom.models.StateDto;
import com.astute.discom.models.SubdivisionDto;
import com.astute.discom.models.ZoneDto;

@Component
public class DiscomUtil {

	@Autowired
	private ModelMapper modelMapper;

	public CompanyDto copyRequestObjectForCompany(Company company) {
		CompanyDto companyDto = new CompanyDto();
		if (company != null) {
			if (company.getId() != null) {
				companyDto.setId(company.getId());
			}
			if (company.getName() != null && company.getName() != "")
				companyDto.setName(company.getName());

			companyDto.setInitials(company.getInitials());

			if (company.getLogo() != null)
				companyDto.setLogo(company.getLogo());

			if (company.getContact() != null)
				companyDto.setContact(company.getContact());

			if (company.getEmail() != null)
				companyDto.setEmail(company.getEmail());

			if (company.getAddress() != null) {
				AddressDto addressDto = new AddressDto();
				if (company.getAddress().getIdAddress() != null) {
					addressDto.setIdAddress(company.getAddress().getIdAddress());
				}
				if (company.getAddress().getAddress() != null)
					addressDto.setAddress(company.getAddress().getAddress());
				companyDto.setAddressDto(addressDto);
			}

			if (company.getState() != null) {
				StateDto stateDto = new StateDto();
				if (company.getState().getStateId() != null) {
					stateDto.setStateId(company.getState().getStateId());
				}
				stateDto.setStateName(company.getState().getStateName());
				companyDto.setStateDto(stateDto);
			}

		}
		return companyDto;
	}

	public Company copyResponseObjectForCompany(CompanyDto companyDto) {
		Company company = new Company();
		if (companyDto != null) {
			if (companyDto.getId() != null) {
				company.setId(companyDto.getId());
			}

			company.setName(companyDto.getName());
			company.setLogo(companyDto.getLogo());
			company.setInitials(companyDto.getInitials());
			company.setEmail(companyDto.getEmail());
			company.setContact(companyDto.getContact());

			if (companyDto.getAddressDto() != null) {
				Address address = new Address();
				if (companyDto.getAddressDto().getIdAddress() != null) {
					address.setIdAddress(companyDto.getAddressDto().getIdAddress());
				}
				address.setAddress(companyDto.getAddressDto().getAddress());
				company.setAddress(address);
			}

			if (companyDto.getRegionDto() != null && companyDto.getRegionDto().size() > 0) {
				List<RegionDto> listRegionDto = companyDto.getRegionDto();
				List<Region> listRegion = new ArrayList<Region>();
				Iterator<RegionDto> itr = listRegionDto.iterator();

				while (itr.hasNext()) {
					RegionDto regionDto = itr.next();
					Region region = copyResponseObjectForRegion(regionDto);
					listRegion.add(region);

				}
				company.setRegion(listRegion);
			}

			if (companyDto.getStateDto() != null) {
				State state = new State();
				if (companyDto.getStateDto().getStateId() != null) {
					state.setStateId(companyDto.getStateDto().getStateId());
				}

				state.setStateName(companyDto.getStateDto().getStateName());
				company.setState(state);
			}
		}
		return company;
	}

	public RegionDto copyRequestObjectForRegion(Region region) {
		RegionDto regionDto = new RegionDto();
		if (region != null) {
			if (region.getIdRegion() != null) {
				regionDto.setIdRegion(region.getIdRegion());
			}

			if (region.getIdCompany() != null) {
				regionDto.setIdCompany(region.getIdCompany());
			}
			regionDto.setName(region.getName());
			regionDto.setEmail(region.getEmail());
			regionDto.setContact(region.getContact());
			if (region.getAddress() != null) {
				AddressDto addressDto = new AddressDto();
				if (region.getAddress().getIdAddress() != null) {
					addressDto.setIdAddress(region.getAddress().getIdAddress());
				}
				addressDto.setAddress(region.getAddress().getAddress());
				regionDto.setAddressDto(addressDto);
			}
		}
		return regionDto;
	}

	public Region copyResponseObjectForRegion(RegionDto regionDto) {
		Region region = new Region();
		if (regionDto != null) {
			if (regionDto.getIdRegion() != null) {
				region.setIdRegion(regionDto.getIdRegion());
			}

			if (regionDto.getIdCompany() != null) {
				region.setIdCompany(regionDto.getIdCompany());
			}
			region.setName(regionDto.getName());
			region.setEmail(regionDto.getEmail());
			region.setContact(regionDto.getContact());

			if (regionDto.getAddressDto() != null) {
				Address address = new Address();
				if (regionDto.getAddressDto().getIdAddress() != null) {
					address.setIdAddress(regionDto.getAddressDto().getIdAddress());
				}
				address.setAddress(regionDto.getAddressDto().getAddress());
				region.setAddress(address);

			}
			if (regionDto.getCircleDto() != null && regionDto.getCircleDto().size() > 0) {
				List<CircleDto> listCircleDto = regionDto.getCircleDto();
				List<Circle> listCircle = new ArrayList<Circle>();
				Iterator<CircleDto> itr = listCircleDto.iterator();
				Circle circle = new Circle();
				while (itr.hasNext()) {
					CircleDto circleDto = itr.next();
					circle = copyResponseObjectForCircle(circleDto);
					listCircle.add(circle);

				}
				region.setCircle(listCircle);
			}

		}
		return region;
	}

	public CircleDto copyRequestObjectForCircle(Circle circle) {
		CircleDto circleDto = new CircleDto();
		if (circle != null) {
			if (circle.getIdCircle() != null) {
				circleDto.setIdCircle(circle.getIdCircle());
			}

			if (circle.getIdRegion() != null) {
				circleDto.setIdRegion(circle.getIdRegion());
			}
			circleDto.setName(circle.getName());
			circleDto.setEmail(circle.getEmail());
			circleDto.setContact(circle.getContact());

			if (circle.getAddress() != null) {
				AddressDto addressDto = new AddressDto();
				if (circle.getAddress().getIdAddress() != null) {
					addressDto.setIdAddress(circle.getAddress().getIdAddress());
				}
				addressDto.setAddress(circle.getAddress().getAddress());
				circleDto.setAddress(addressDto);
			}
		}
		return circleDto;
	}

	public Circle copyResponseObjectForCircle(CircleDto circleDto) {
//		Circle circle = new Circle();
//		if (circleDto != null) {
//			if (circleDto.getIdCircle() != null) {
//				circle.setIdCircle(circleDto.getIdCircle());
//			}
//
//			if (circleDto.getRegionId() != null) {
//				circle.setRegionId(circleDto.getRegionId());
//			}
//
//			circle.setName(circleDto.getName());
//			circle.setEmail(circleDto.getEmail());
//			circle.setContact(circleDto.getContact());
//
//			if (circleDto.getAddress() != null) {
//				Address address = new Address();
//				if (circleDto.getAddress().getIdAddress() != null) {
//					address.setIdAddress(circleDto.getAddress().getIdAddress());
//				}
//				address.setAddress(circleDto.getAddress().getAddress());
//				circle.setAddress(address);
//			}
//			if (circleDto.getDivision() != null && circleDto.getDivision().size() > 0) {
//				List<DivisionDto> listDivisionDto = circleDto.getDivision();
//				List<Division> listDivision = new ArrayList<Division>();
//				Iterator<DivisionDto> itr = listDivisionDto.iterator();
//				Division division = new Division();
//				while (itr.hasNext()) {
//					DivisionDto divisionDto = itr.next();
//					division = copyResponseObjectForDivision(divisionDto);
//					listDivision.add(division);
//
//				}
//				circle.setDivision(listDivision);
//			}
//		}
		Circle circle = modelMapper.map(circleDto, Circle.class);

		return circle;
	}

	public DivisionDto copyRequestObjectForDivision(Division division) {
		DivisionDto divisionDto = new DivisionDto();
		if (division != null) {
			if (division.getIdDivision() != null) {
				divisionDto.setIdDivision(division.getIdDivision());
			}

			if (division.getIdCircle() != null) {
				divisionDto.setIdCircle(division.getIdCircle());
			}
			divisionDto.setName(division.getName());
			divisionDto.setEmail(division.getEmail());
			divisionDto.setContact(division.getContact());

			if (division.getAddress() != null) {
				AddressDto addressDto = new AddressDto();
				if (division.getAddress().getIdAddress() != null) {
					addressDto.setIdAddress(division.getAddress().getIdAddress());
				}
				addressDto.setAddress(division.getAddress().getAddress());
				divisionDto.setAddress(addressDto);
			}
		}
		return divisionDto;
	}

	public Division copyResponseObjectForDivision(DivisionDto divisionDto) {
		Division division = new Division();
		if (divisionDto != null) {
			if (divisionDto.getIdDivision() != null) {
				division.setIdDivision(divisionDto.getIdDivision());
			}

			if (divisionDto.getIdCircle() != null) {
				division.setIdCircle(divisionDto.getIdCircle());
			}

			division.setName(divisionDto.getName());
			division.setEmail(divisionDto.getEmail());
			division.setContact(divisionDto.getContact());

			if (divisionDto.getAddress() != null) {
				Address address = new Address();
				if (divisionDto.getAddress().getIdAddress() != null) {
					address.setIdAddress(divisionDto.getAddress().getIdAddress());
				}
				address.setAddress(divisionDto.getAddress().getAddress());
				division.setAddress(address);
			}

			if (divisionDto.getSubDivision() != null && divisionDto.getSubDivision().size() > 0) {
				List<SubdivisionDto> listSubdivisionDto = divisionDto.getSubDivision();
				List<Subdivision> listSubdivision = new ArrayList<Subdivision>();
				Iterator<SubdivisionDto> itr = listSubdivisionDto.iterator();
				Subdivision subdivision = new Subdivision();
				while (itr.hasNext()) {
					SubdivisionDto subdivisionDto = itr.next();
					subdivision = copyResponseObjectForSubdivision(subdivisionDto);
					listSubdivision.add(subdivision);

				}
				division.setSubDivision(listSubdivision);
			}
		}
		return division;
	}

	public SubdivisionDto copyRequestObjectForSubdivision(Subdivision subdivision) {
		SubdivisionDto subdivisionDto = new SubdivisionDto();
		if (subdivision != null) {
			if (subdivision.getIdSubdivision() != null) {
				subdivisionDto.setIdSubdivision(subdivision.getIdSubdivision());
			}
			if (subdivision.getIdDivision() != null) {
				subdivisionDto.setIdDivision(subdivision.getIdDivision());
			}
			subdivisionDto.setName(subdivision.getName());
			subdivisionDto.setEmail(subdivision.getEmail());
			subdivisionDto.setContact(subdivision.getContact());

			if (subdivision.getAddress() != null) {
				AddressDto addressDto = new AddressDto();
				if (subdivision.getAddress().getIdAddress() != null) {
					addressDto.setIdAddress(subdivision.getAddress().getIdAddress());
				}
				addressDto.setAddress(subdivision.getAddress().getAddress());
				subdivisionDto.setAddress(addressDto);
			}
		}
		return subdivisionDto;
	}

	public Subdivision copyResponseObjectForSubdivision(SubdivisionDto subdivisionDto) {
		Subdivision subdivision = new Subdivision();
		if (subdivisionDto != null) {
			if (subdivisionDto.getIdSubdivision() != null) {
				subdivision.setIdSubdivision(subdivisionDto.getIdSubdivision());
			}

			if (subdivisionDto.getIdDivision() != null) {
				subdivision.setIdDivision(subdivisionDto.getIdDivision());
			}
			subdivision.setName(subdivisionDto.getName());
			subdivision.setEmail(subdivisionDto.getEmail());
			subdivision.setContact(subdivisionDto.getContact());

			if (subdivisionDto.getAddress() != null) {
				Address address = new Address();
				if (subdivisionDto.getAddress().getIdAddress() != null) {
					address.setIdAddress(subdivisionDto.getAddress().getIdAddress());
				}
				address.setAddress(subdivisionDto.getAddress().getAddress());
				subdivision.setAddress(address);
			}

			if (subdivisionDto.getZone() != null && subdivisionDto.getZone().size() > 0) {
				List<ZoneDto> listZoneDto = subdivisionDto.getZone();
				List<Zone> listZone = new ArrayList<Zone>();
				Iterator<ZoneDto> itr = listZoneDto.iterator();
				Zone zone = new Zone();
				while (itr.hasNext()) {
					ZoneDto zoneDto = itr.next();
					zone = copyResponseObjectForZone(zoneDto);
					listZone.add(zone);
				}
				subdivision.setZone(listZone);
			}
		}
		return subdivision;
	}

	public ZoneDto copyRequestObjectForZone(Zone zone) {
		ZoneDto zoneDto = new ZoneDto();
		if (zone != null) {
			if (zone.getIdZone() != null) {
				zoneDto.setIdZone(zone.getIdZone());
			}

			if (zone.getIdSubdivision() != null) {
				zoneDto.setIdSubdivision(zone.getIdSubdivision());
			}

			zoneDto.setName(zone.getName());
			zoneDto.setEmail(zone.getEmail());
			zoneDto.setContact(zone.getContact());

			if (zone.getAddress() != null) {
				AddressDto addressDto = new AddressDto();
				if (zone.getAddress().getIdAddress() != null) {
					addressDto.setIdAddress(zone.getAddress().getIdAddress());
				}
				addressDto.setAddress(zone.getAddress().getAddress());
				zoneDto.setAddress(addressDto);
			}
		}
		return zoneDto;
	}

	public Zone copyResponseObjectForZone(ZoneDto zoneDto) {
		Zone zone = new Zone();
		if (zoneDto != null) {
			if (zoneDto.getIdZone() != null) {
				zone.setIdZone(zoneDto.getIdZone());
			}

			if (zoneDto.getIdSubdivision() != null) {
				zone.setIdSubdivision(zoneDto.getIdSubdivision());
			}

			zone.setName(zoneDto.getName());
			zone.setEmail(zoneDto.getEmail());
			zone.setContact(zoneDto.getContact());

			if (zoneDto.getAddress() != null) {
				Address address = new Address();
				if (zoneDto.getAddress().getIdAddress() != null) {
					address.setIdAddress(zoneDto.getAddress().getIdAddress());
				}
				address.setAddress(zoneDto.getAddress().getAddress());
				zone.setAddress(address);
			}
		}
		return zone;
	}

}
