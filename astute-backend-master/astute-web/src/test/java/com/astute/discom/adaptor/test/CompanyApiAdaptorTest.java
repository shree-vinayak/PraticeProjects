package com.astute.discom.adaptor.test;

//import static org.assertj.core.api.Assertions.assertThat;
//import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.NONE;
//
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import com.astute.discom.adaptor.CompanyApiAdaptor;
//import com.astute.discom.dao.CompanyDao;
//import com.astute.discom.dao.RegionDao;
//import com.astute.discom.dtos.Address;
//import com.astute.discom.dtos.Company;
//import com.astute.discom.dtos.State;
//import com.astute.discom.models.AddressDto;
//import com.astute.discom.models.CompanyDto;
//import com.astute.discom.models.StateDto;
//import com.astute.util.DiscomUtil;

//@RunWith(SpringRunner.class)
////@SpringBootTest
////@AutoConfigureMockMvc(secure = false)
//@SpringBootTest(webEnvironment = NONE)
public class CompanyApiAdaptorTest {

//	@Autowired
//	private CompanyApiAdaptor companyApiAdaptor;
//
////	@Autowired
////	private TestEntityManager testEntityManager;
//
//	@MockBean
//	private CompanyDao companyDao;
//
//	@MockBean
//	private RegionDao regionDao;
//
//	@MockBean
//	private DiscomUtil util;
//
////	// For creating the state Object
////	private StateDto getState() {
////
////		StateDto state = new StateDto();
////		state.setStateName("MP");
////
////		return state;
////	}
//
//	@Test
//	public void testAddCompany() {
//
////		StateDto state = getState();
////		StateDto stateSavedInDb = testEntityManager.persist(state);
////		System.out.println("stateOject " + stateSavedInDb.toString());
////		System.out.println("---------------------------------------------------------");
//
//		Company company = getCompany();
//		System.out.println("testAddCompany " + company);
//
//		CompanyDto company1 = getCompany1();
////		Mockito.when(util.copyRequestObjectForCompany(company)).thenReturn(company1);
//		Mockito.when(companyDao.save(company1)).thenReturn(getCompany1());
////		Mockito.when(util.copyResponseObjectForCompany(getCompany2())).thenReturn()
//
////		CompanyDto companyGetFromDb = companyDao.findById(companySavedInDb.getId()).get();
//
//		company = companyApiAdaptor.addCompany(company);
//		assertThat(company.getId()).isEqualTo(getCompany().getId());
//
//	}
//
//	// For creating the company Object
//	private Company getCompany() {
//		Company company = new Company();
//		Address address = new Address();
//		address.setIdAddress(1);
//		address.setAddress("Indore");
//
//		company.setId(1);
//		company.setName("ankit");
//		company.setLogo("sdafasfasdfsadfsdafdsafa");
//		company.setAddress(address);
//		company.setContact(9827517213l);
//		company.setEmail("ankit@gmail.com");
//		company.setInitials("MPWZ");
//
//		State state = new State();
//		state.setStateId(1);
//		company.setState(state);
//		return company;
//	}
//
//	// For creating the company Object
//	private CompanyDto getCompany1() {
//		CompanyDto company = new CompanyDto();
//		AddressDto address = new AddressDto();
//		address.setAddress("Indore");
//		address.setIdAddress(1);
//		company.setId(1);
//		company.setName("ankit");
//		company.setLogo("sdafasfasdfsadfsdafdsafa");
//		company.setAddressDto(address);
//		company.setContact(9827517213l);
//		company.setEmail("ankit@gmail.com");
//		company.setInitials("MPWZ");
//		StateDto state = new StateDto();
//		state.setStateId(1);
//		company.setStateDto(state);
//
//		return company;
//	}

}
