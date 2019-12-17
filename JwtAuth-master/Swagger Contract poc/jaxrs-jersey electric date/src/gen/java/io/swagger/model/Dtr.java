/*
 * Astute Energy API Specification.
 * Rest enpoints to be used with the Angular application for Astute Energy.
 *
 * OpenAPI spec version: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.model.DtrDtrDeviceMapping;
import io.swagger.model.DtrPoleMapping;
import io.swagger.model.Feeder11kvDtrMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.*;

/**
 * Dtr
 */
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class Dtr   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("dtrDtrDeviceMapping")
  private List<DtrDtrDeviceMapping> dtrDtrDeviceMapping = null;

  @JsonProperty("dtrPoleMapping")
  private List<DtrPoleMapping> dtrPoleMapping = null;

  @JsonProperty("feeder11kvDtrMapping")
  private List<Feeder11kvDtrMapping> feeder11kvDtrMapping = null;

  @JsonProperty("capacity")
  private String capacity = null;

  @JsonProperty("make")
  private String make = null;

  @JsonProperty("yearOfManufacturing")
  private Integer yearOfManufacturing = null;

  @JsonProperty("startDate")
  private Date startDate = null;

  @JsonProperty("endDate")
  private Date endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Dtr id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
   **/
  @JsonProperty("id")
  @Schema(example = "1", description = "")
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Dtr name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
   **/
  @JsonProperty("name")
  @Schema(example = "saket", description = "")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Dtr dtrDtrDeviceMapping(List<DtrDtrDeviceMapping> dtrDtrDeviceMapping) {
    this.dtrDtrDeviceMapping = dtrDtrDeviceMapping;
    return this;
  }

  public Dtr addDtrDtrDeviceMappingItem(DtrDtrDeviceMapping dtrDtrDeviceMappingItem) {
    if (this.dtrDtrDeviceMapping == null) {
      this.dtrDtrDeviceMapping = new ArrayList<DtrDtrDeviceMapping>();
    }
    this.dtrDtrDeviceMapping.add(dtrDtrDeviceMappingItem);
    return this;
  }

  /**
   * Get dtrDtrDeviceMapping
   * @return dtrDtrDeviceMapping
   **/
  @JsonProperty("dtrDtrDeviceMapping")
  @Schema(description = "")
  public List<DtrDtrDeviceMapping> getDtrDtrDeviceMapping() {
    return dtrDtrDeviceMapping;
  }

  public void setDtrDtrDeviceMapping(List<DtrDtrDeviceMapping> dtrDtrDeviceMapping) {
    this.dtrDtrDeviceMapping = dtrDtrDeviceMapping;
  }

  public Dtr dtrPoleMapping(List<DtrPoleMapping> dtrPoleMapping) {
    this.dtrPoleMapping = dtrPoleMapping;
    return this;
  }

  public Dtr addDtrPoleMappingItem(DtrPoleMapping dtrPoleMappingItem) {
    if (this.dtrPoleMapping == null) {
      this.dtrPoleMapping = new ArrayList<DtrPoleMapping>();
    }
    this.dtrPoleMapping.add(dtrPoleMappingItem);
    return this;
  }

  /**
   * Get dtrPoleMapping
   * @return dtrPoleMapping
   **/
  @JsonProperty("dtrPoleMapping")
  @Schema(description = "")
  public List<DtrPoleMapping> getDtrPoleMapping() {
    return dtrPoleMapping;
  }

  public void setDtrPoleMapping(List<DtrPoleMapping> dtrPoleMapping) {
    this.dtrPoleMapping = dtrPoleMapping;
  }

  public Dtr feeder11kvDtrMapping(List<Feeder11kvDtrMapping> feeder11kvDtrMapping) {
    this.feeder11kvDtrMapping = feeder11kvDtrMapping;
    return this;
  }

  public Dtr addFeeder11kvDtrMappingItem(Feeder11kvDtrMapping feeder11kvDtrMappingItem) {
    if (this.feeder11kvDtrMapping == null) {
      this.feeder11kvDtrMapping = new ArrayList<Feeder11kvDtrMapping>();
    }
    this.feeder11kvDtrMapping.add(feeder11kvDtrMappingItem);
    return this;
  }

  /**
   * Get feeder11kvDtrMapping
   * @return feeder11kvDtrMapping
   **/
  @JsonProperty("feeder11kvDtrMapping")
  @Schema(description = "")
  public List<Feeder11kvDtrMapping> getFeeder11kvDtrMapping() {
    return feeder11kvDtrMapping;
  }

  public void setFeeder11kvDtrMapping(List<Feeder11kvDtrMapping> feeder11kvDtrMapping) {
    this.feeder11kvDtrMapping = feeder11kvDtrMapping;
  }

  public Dtr capacity(String capacity) {
    this.capacity = capacity;
    return this;
  }

  /**
   * Get capacity
   * @return capacity
   **/
  @JsonProperty("capacity")
  @Schema(example = "440 kv", description = "")
  public String getCapacity() {
    return capacity;
  }

  public void setCapacity(String capacity) {
    this.capacity = capacity;
  }

  public Dtr make(String make) {
    this.make = make;
    return this;
  }

  /**
   * Get make
   * @return make
   **/
  @JsonProperty("make")
  @Schema(example = "TATA", description = "")
  public String getMake() {
    return make;
  }

  public void setMake(String make) {
    this.make = make;
  }

  public Dtr yearOfManufacturing(Integer yearOfManufacturing) {
    this.yearOfManufacturing = yearOfManufacturing;
    return this;
  }

  /**
   * Get yearOfManufacturing
   * @return yearOfManufacturing
   **/
  @JsonProperty("yearOfManufacturing")
  @Schema(example = "2018", description = "")
  public Integer getYearOfManufacturing() {
    return yearOfManufacturing;
  }

  public void setYearOfManufacturing(Integer yearOfManufacturing) {
    this.yearOfManufacturing = yearOfManufacturing;
  }

  public Dtr startDate(Date startDate) {
    this.startDate = startDate;
    return this;
  }

  /**
   * Get startDate
   * @return startDate
   **/
  @JsonProperty("startDate")
  @Schema(description = "")
  public Date getStartDate() {
    return startDate;
  }

  public void setStartDate(Date startDate) {
    this.startDate = startDate;
  }

  public Dtr endDate(Date endDate) {
    this.endDate = endDate;
    return this;
  }

  /**
   * Get endDate
   * @return endDate
   **/
  @JsonProperty("endDate")
  @Schema(description = "")
  public Date getEndDate() {
    return endDate;
  }

  public void setEndDate(Date endDate) {
    this.endDate = endDate;
  }

  public Dtr isActive(Boolean isActive) {
    this.isActive = isActive;
    return this;
  }

  /**
   * Get isActive
   * @return isActive
   **/
  @JsonProperty("isActive")
  @Schema(example = "true", description = "")
  public Boolean isisIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean isActive) {
    this.isActive = isActive;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Dtr dtr = (Dtr) o;
    return Objects.equals(this.id, dtr.id) &&
        Objects.equals(this.name, dtr.name) &&
        Objects.equals(this.dtrDtrDeviceMapping, dtr.dtrDtrDeviceMapping) &&
        Objects.equals(this.dtrPoleMapping, dtr.dtrPoleMapping) &&
        Objects.equals(this.feeder11kvDtrMapping, dtr.feeder11kvDtrMapping) &&
        Objects.equals(this.capacity, dtr.capacity) &&
        Objects.equals(this.make, dtr.make) &&
        Objects.equals(this.yearOfManufacturing, dtr.yearOfManufacturing) &&
        Objects.equals(this.startDate, dtr.startDate) &&
        Objects.equals(this.endDate, dtr.endDate) &&
        Objects.equals(this.isActive, dtr.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, dtrDtrDeviceMapping, dtrPoleMapping, feeder11kvDtrMapping, capacity, make, yearOfManufacturing, startDate, endDate, isActive);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Dtr {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    dtrDtrDeviceMapping: ").append(toIndentedString(dtrDtrDeviceMapping)).append("\n");
    sb.append("    dtrPoleMapping: ").append(toIndentedString(dtrPoleMapping)).append("\n");
    sb.append("    feeder11kvDtrMapping: ").append(toIndentedString(feeder11kvDtrMapping)).append("\n");
    sb.append("    capacity: ").append(toIndentedString(capacity)).append("\n");
    sb.append("    make: ").append(toIndentedString(make)).append("\n");
    sb.append("    yearOfManufacturing: ").append(toIndentedString(yearOfManufacturing)).append("\n");
    sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
    sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
    sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}