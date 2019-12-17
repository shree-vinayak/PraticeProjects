package com.astute.discom.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.astute.discom.dtos.Company;
import com.astute.discom.models.CompanyDto;
import com.astute.discom.repository.CompanyDao;
import com.astute.discom.repository.RegionDao;
import com.astute.util.DiscomUtil;

@Component
public class CompanyApiAdaptor {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private RegionDao regionDao;

	@Autowired
	private DiscomUtil util;

	@Transactional
	public Company addCompany(Company company) {
		try {
			CompanyDto companyDto = util.copyRequestObjectForCompany(company);
			companyDto.setStartDate(new Date(System.currentTimeMillis()));
			companyDto.setEndDate(new Date(System.currentTimeMillis()));
			companyDto.setIsActive(true);
			return util.copyResponseObjectForCompany(companyDao.save(companyDto));
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Company deleteCompany(Integer id) {
		try {
			Integer count = regionDao.getCount(id);
			if (count <= 0) {
				CompanyDto companyDto = companyDao.findCompany(id);
				companyDto.setIsActive(false);
				companyDto.setEndDate(new Date(System.currentTimeMillis()));
				companyDto = companyDao.save(companyDto);
				return util.copyResponseObjectForCompany(companyDto);
			}
			return null;
		} catch (Exception e) {
			return null;
		}

	}

	@Transactional
	public List<Company> getAllCompany(Integer id) {
		try {
			List<CompanyDto> listCompanyDto = companyDao.findAllActiveCompanies(id);
			List<Company> listCompany = new ArrayList<Company>();
			Iterator<CompanyDto> itr = listCompanyDto.iterator();
			while (itr.hasNext()) {
				CompanyDto companyDto = itr.next();
				Company company = util.copyResponseObjectForCompany(companyDto);
				listCompany.add(company);
			}
			return listCompany;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public List<Company> getAllCompany() {
		try {
			List<CompanyDto> listCompanyDto = companyDao.findAllActiveCompanies();
			List<Company> listCompany = new ArrayList<Company>();
			Iterator<CompanyDto> itr = listCompanyDto.iterator();
			while (itr.hasNext()) {
				CompanyDto companyDto = itr.next();
				Company company = util.copyResponseObjectForCompany(companyDto);
				listCompany.add(company);
			}
			return listCompany;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Integer getCompaniesCount() {
		try {
			Integer count = companyDao.getCount();
			if (count > 0) {
				return count;
			}
			return 0;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Company getCompany(Integer id) {
		try {
			CompanyDto companyDto = companyDao.findCompany(id);
			return util.copyResponseObjectForCompany(companyDto);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public Company updateCompany(Company company) {
		try {
			CompanyDto companyDto = util.copyRequestObjectForCompany(company);
			CompanyDto companyDto1 = companyDao.findCompany(companyDto.getId());
			companyDto.setStartDate(companyDto1.getStartDate());
			companyDto.setEndDate(companyDto1.getEndDate());
			companyDto.setIsActive(companyDto1.getIsActive());
			companyDto = companyDao.save(companyDto);
			return util.copyResponseObjectForCompany(companyDto);
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	public List<Company> getCompany(String name) {
		try {
			List<CompanyDto> listCompanyDto = companyDao.findByName(name);
			List<Company> listCompany = new ArrayList<Company>();
			Iterator<CompanyDto> itr = listCompanyDto.iterator();
			while (itr.hasNext()) {
				CompanyDto companyDto = itr.next();
				Company company = util.copyResponseObjectForCompany(companyDto);
				listCompany.add(company);
			}
			return listCompany;
		} catch (Exception e) {
			return null;
		}
	}

}
