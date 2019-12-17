package com.subscription.service.service.impl;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.subscription.service.entity.DataSourceProperties;
import com.subscription.service.model.UserInf;
import com.subscription.service.repository.DataSourcePropertiesRepository;
import com.subscription.service.result.Result;
import com.subscription.service.result.ResultWrapper;
import com.subscription.service.service.DataSourceConfigService;

@Service
public class DataSourceConfigServiceImpl implements DataSourceConfigService {

	private static final Logger LOGGER = LoggerFactory.getLogger(DataSourceConfigServiceImpl.class);

	@Value("${spring.datasource.username}")
	private String dbUsername;

	@Value("${spring.datasource.password}")
	private String dbPassword;

	@Value("${spring.datasource.url}")
	private String url;

	@Value("${aartek.mysqlPath}")
	private String mysqlPath;

	@Value("${aartek.script.package1}")
	private String package1;

	@Value("${aartek.script.package2}")
	private String package2;

	@Autowired
	private DataSourcePropertiesRepository dataSrcProRepo;

	@Autowired
	RestTemplate restTemplate;

	@Override
	public ResultWrapper<DataSourceProperties> configureDataSource(String id) {
		ResultWrapper<DataSourceProperties> result = new ResultWrapper<>();
		UserInf userInf = restTemplate.getForObject("http://zuul-server/users/" + id, UserInf.class);
		if (Objects.isNull(userInf)) {
			result.setStatus(Result.EXCEPTION);
			result.setMessage("user is not registered");
			LOGGER.warn("user is not registered");
			return result;
		}
		LOGGER.info("User made a request to activate his package : ", userInf.getName());
		String pkgname = userInf.getPkg().getPkgName();
		String adminDbName = "admin_" + id;

		DataSourceProperties existDataSrcProp = dataSrcProRepo.findByDbName(adminDbName);
		if (Objects.nonNull(existDataSrcProp)) {
			result.setStatus(Result.EXCEPTION);
			result.setMessage(existDataSrcProp.getDbName() + " database already exist");
			LOGGER.warn(existDataSrcProp.getDbName() + " database already exist");
			return result;
		}

		String cleanURI = url.substring(5);
		URI uri = URI.create(cleanURI);
		String path = uri.getPath();
		String host = uri.getHost();
		Integer port = uri.getPort();
		String superAdminDbName = path.substring(1);

		String adminUrl = url.toString();
		adminUrl = StringUtils.chop(path);
		// StringBuilder adminUrl = url.;
		try {
			String[] cmd1 = new String[] { mysqlPath, superAdminDbName, "--user=" + dbUsername,
					"--password=" + dbPassword, "-e", "create database if not exists " + adminDbName + ";" };

			LOGGER.info("command for create database : <{}>", (Object) cmd1);
			Process proc = Runtime.getRuntime().exec(cmd1);
			InputStream inputstream = proc.getInputStream();
			InputStreamReader inputstreamreader = new InputStreamReader(inputstream);
			BufferedReader bufferedreader = new BufferedReader(inputstreamreader);

			// read the output
			String line;
			while ((line = bufferedreader.readLine()) != null) {
				System.out.println(line);
			}

			// check for failure
			try {
				if (proc.waitFor() != 0) {
					System.err.println("exit value = " + proc.exitValue());
				}
			} catch (InterruptedException e) {
				LOGGER.error("Exception occured : ", e);
			}
		} catch (Exception e) {
			result.setStatus(Result.EXCEPTION);
			result.setMessage(existDataSrcProp.getDbName() + " database not created successfully ");
			LOGGER.error(existDataSrcProp.getDbName() + " database not created successfully");
			LOGGER.error("Exception occured : ", e);
			return result;
		}
//--------------			
		try {
			String[] cmd2 = null;
			if (pkgname.equals("package-1")) {
				cmd2 = new String[] { mysqlPath, adminDbName, "--user=" + dbUsername, "--password=" + dbPassword, "-e",
						"\"source " + package1 + "\"" };
			}
			if (pkgname.equals("package-2")) {
				cmd2 = new String[] { mysqlPath, adminDbName, "--user=" + dbUsername, "--password=" + dbPassword, "-e",
						"\"source " + package2 + "\"" };
			}
			LOGGER.info("The command for script :  {}", (Object) cmd2);
			Process process2 = Runtime.getRuntime().exec(cmd2);
			InputStream inputstream = process2.getInputStream();
			InputStreamReader inputstreamreader = new InputStreamReader(inputstream);
			BufferedReader bufferedreader = new BufferedReader(inputstreamreader);

			// read the output
			String line;
			while ((line = bufferedreader.readLine()) != null) {
				System.out.println(line);
			}

			// check for failure
			try {
				if (process2.waitFor() != 0) {
					System.err.println("exit value = " + process2.exitValue());
				}
			} catch (InterruptedException e) {
				LOGGER.error("Exception occured : ", e);
			}
		} catch (Exception e) {
			result.setStatus(Result.EXCEPTION);
			result.setMessage(existDataSrcProp.getDbName() + " table not created successfully ");
			LOGGER.error(existDataSrcProp.getDbName() + " table not created successfully");
			LOGGER.error("Exception occured : ", e);
			return result;
		}

		DataSourceProperties dataSrcProp = new DataSourceProperties();
		dataSrcProp.setDbUsername(dbUsername);
		dataSrcProp.setDbPassword(dbPassword);
		dataSrcProp.setDbName(adminDbName);
		dataSrcProp.setHost(host);
		dataSrcProp.setPort(port);
		dataSrcProp.setCreatedAt(new Date());
		dataSrcProp.setUserInfId(id);
		dataSrcProp = dataSrcProRepo.save(dataSrcProp);
		result.succeedCreated(dataSrcProp, dataSrcProp.getDbName());

//		String pkgType = userInf.getPkgType();
//		userInf.setPkgStartDate(LocalDateTime.now());
//		if (pkgType.equals("trial")) {
//			userInf.setPkgExpDate(LocalDateTime.now().plusDays(15));		
//		} else {
//			userInf.setPkgExpDate(LocalDateTime.now().plusMonths(1));
//		}	
//		userInf.setStatus(true);
//		UserInf userInf2 = restTemplate.postForObject("http://zuul-server/userRegistration", userInf, UserInf.class);

		return result;

	}

}
