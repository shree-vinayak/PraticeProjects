package com.eureka.zuul.serviceImpl;

import java.util.List;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eureka.zuul.model.Pkg;
import com.eureka.zuul.repository.PackageRepository;
import com.eureka.zuul.results.Result;
import com.eureka.zuul.results.ResultWrapper;
import com.eureka.zuul.service.PackageService;

@Service
public class PackageServiceImpl implements PackageService {
	private static final Logger LOGGER = LoggerFactory.getLogger(PackageServiceImpl.class);

	@Autowired
	private PackageRepository packageRepository;

	@Override
	public ResultWrapper<List<Pkg>> getAll() {
		LOGGER.info("Inside getAll packages method");
		ResultWrapper<List<Pkg>> result = new ResultWrapper<>();
		try {
			List<Pkg> pkgList = packageRepository.findAll();
			result.succeed(pkgList);
		} catch (Exception e) {
			result.setStatus(Result.EXCEPTION);
			result.setMessage(e.toString());
			LOGGER.error("Exception : ", e);
		}
		return result;
	}

	@Override
	public ResultWrapper<Pkg> createPkg(Pkg pkg) {
		LOGGER.info("Inside createPkg method");
		ResultWrapper<Pkg> result = new ResultWrapper<>();
		try {
			Pkg existPkg = packageRepository.findByPkgName(pkg.getPkgName());
			if (Objects.nonNull(existPkg)) {
				result.setStatus(Result.EXCEPTION);
				result.setMessage(existPkg.getPkgName() + " name already exist");
				LOGGER.warn(existPkg.getPkgName() + " name already exist");
				return result;
			}
			pkg = packageRepository.save(pkg);
			result.succeedCreated(pkg, pkg.getPkgName());
		} catch (Exception e) {
			result.setStatus(Result.EXCEPTION);
			result.setMessage(e.toString());
			LOGGER.error("Exception : ", e);
		}
		return result;
	}

}
