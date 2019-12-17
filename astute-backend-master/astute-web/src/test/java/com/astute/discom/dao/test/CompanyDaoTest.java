package com.astute.discom.dao.test;

//import static org.assertj.core.api.Assertions.assertThat;
//
//import java.util.Date;
//
//import org.junit.Ignore;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import com.astute.discom.dao.CompanyDao;
//import com.astute.discom.dao.StateDao;
//import com.astute.discom.models.AddressDto;
//import com.astute.discom.models.CompanyDto;
//import com.astute.discom.models.StateDto;

//@RunWith(SpringRunner.class)
//@DataJpaTest
////@AutoConfigureTestDatabase
////@EnableAutoConfiguration(exclude = { SecurityAutoConfiguration.class})
//@AutoConfigureMockMvc(secure = false)
////@SpringBootTest(webEnvironment = NONE)
public class CompanyDaoTest {

//	@Autowired
//	private TestEntityManager testEntityManager;
//
//	@Autowired
//	private CompanyDao companyDao;
//
//	@Autowired
//	private StateDao stateDao;
//
//	@Test
//	public void testSaveCompany() {
//
//		StateDto state = getState();
//		StateDto stateSavedInDb = stateDao.save(state);
//		System.out.println("stateOject " + stateSavedInDb.toString());
//		System.out.println("---------------------------------------------------------");
//
//		CompanyDto company = getCompany();
//		StateDto state1 = new StateDto();
//		state1.setStateId(stateSavedInDb.getStateId());
//
//		company.setStateDto(state1);
//		CompanyDto companySavedInDb = companyDao.save(company);
//
//		System.out.println("companySavedInDb" + companySavedInDb.toString());
//		System.out.println("---------------------------------------------------------");
//		CompanyDto companyGetFromDb = companyDao.findById(companySavedInDb.getId()).get();
//		System.out.println("companyGetFromDb " + companyGetFromDb.toString());
//		System.out.println("---------------------------------------------------------");
//		assertThat(companyGetFromDb).isEqualTo(companySavedInDb);
//
//	}
//
//	@Test
//	@Ignore
//	public void deleteCompany() {
//
//		CompanyDto companyGetFromdb = companyDao.findById(1).get();
//		System.out.println("deleteCompany ");
//
//	}
//
//	// For creating the company Object
//	private CompanyDto getCompany() {
//		CompanyDto company = new CompanyDto();
//
//		AddressDto address = new AddressDto();
//		address.setAddress("Indore");
//
//		company.setName("ankit");
//		company.setLogo("sdafasfasdfsadfsdafdsafa");
//		company.setAddressDto(address);
//		company.setContact(9827517213l);
//		company.setEmail("ankit@gmail.com");
//		company.setInitials("MPWZ");
//		company.setStartDate(new Date(System.currentTimeMillis()));
//		company.setEndDate(new Date(System.currentTimeMillis()));
//		company.setIsActive(true);
//
//		return company;
//	}
//
//	// For creating the state Object
//	private StateDto getState() {
//
//		StateDto state = new StateDto();
//		state.setStateName("MP");
//
//		return state;
//	}
}
