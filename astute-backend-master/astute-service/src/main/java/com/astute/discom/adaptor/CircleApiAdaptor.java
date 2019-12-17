package com.astute.discom.adaptor;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.transaction.Transactional;
import javax.validation.constraints.Min;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.astute.discom.dtos.Circle;
import com.astute.discom.models.CircleDto;
import com.astute.discom.repository.CircleDao;
import com.astute.discom.repository.DivisionDao;
import com.astute.util.DiscomUtil;

@Component
@Transactional
public class CircleApiAdaptor {

	@Autowired
	private CircleDao circleDao;

	@Autowired
	private DivisionDao divisionDao;

	@Autowired
	private DiscomUtil util;

	@Autowired
	private DivisionApiAdaptor divisionApiAdaptor;

	public Circle addCircle(Circle circle) {
		try {
			CircleDto circleDto = util.copyRequestObjectForCircle(circle);
			circleDto.setStartDate(new Date(System.currentTimeMillis()));
			circleDto.setEndDate(new Date(System.currentTimeMillis()));
			circleDto.setIsActive(true);
			circleDto = circleDao.save(circleDto);
			return util.copyResponseObjectForCircle(circleDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Circle deleteCircle(Integer id) {
		try {
			Integer count = divisionDao.getCount(id);
			if (count <= 0) {
				CircleDto circleDto = circleDao.findCircle(id);
				circleDto.setIsActive(false);
				circleDto.setEndDate(new Date(System.currentTimeMillis()));
				circleDto = circleDao.save(circleDto);
				return util.copyResponseObjectForCircle(circleDto);
			}
			return null;
		} catch (Exception e) {
			return null;
		}

	}

	public List<Circle> getAllCircle(Integer idRegion) {
		try {
			List<CircleDto> listCircleDto = circleDao.findAllActiveRegion(idRegion);
			List<Circle> listCircle = new ArrayList<Circle>();
			Iterator<CircleDto> itr = listCircleDto.iterator();
			while (itr.hasNext()) {
				CircleDto circleDto = itr.next();
				Circle circle = util.copyResponseObjectForCircle(circleDto);
				listCircle.add(circle);
			}
			return listCircle;
		} catch (Exception e) {
			return null;
		}
	}

	public Circle getCircle(@Min(0) Integer id) {
		try {
			CircleDto circleDto = circleDao.findCircle(id);
			return util.copyResponseObjectForCircle(circleDto);
		} catch (Exception e) {
			return null;
		}
	}

	public Integer getCirclesCount(Integer idRegion) {
		try {
			Integer count = circleDao.getCount(idRegion);
			if (count > 0) {
				return count;
			}
			return 0;
		} catch (Exception e) {
			return null;
		}
	}

	public Circle updateCircle(Circle circle) {
		try {
			CircleDto circleDto = util.copyRequestObjectForCircle(circle);
			CircleDto circleDto1 = circleDao.findCircle(circleDto.getIdCircle());
			circleDto.setStartDate(circleDto1.getStartDate());
			circleDto.setEndDate(circleDto1.getEndDate());
			circleDto.setIsActive(circleDto1.getIsActive());
			circleDto = circleDao.save(circleDto);
			return util.copyResponseObjectForCircle(circleDto);
		} catch (Exception e) {
			return null;
		}
	}

	public List<Circle> getCircle(String name) {
		try {
			List<CircleDto> listCircleDto = circleDao.findByName(name);
			List<Circle> listcircle = new ArrayList<Circle>();
			Iterator<CircleDto> itr = listCircleDto.iterator();
			while (itr.hasNext()) {
				CircleDto circleDto = itr.next();
				Circle circle = util.copyResponseObjectForCircle(circleDto);
				listcircle.add(circle);
			}
			return listcircle;
		} catch (Exception e) {
			return null;
		}
	}

}
