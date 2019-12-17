package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Feeder11kvPtrMapping;
import io.swagger.model.Line33kvPtrMapping;
import java.util.ArrayList;
import java.util.List;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Ptr
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-30T10:52:13.430Z[GMT]")
public class Ptr   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("line33kvPtrMapping")
  @Valid
  private List<Line33kvPtrMapping> line33kvPtrMapping = null;

  @JsonProperty("feeder11kvPtrMapping")
  @Valid
  private List<Feeder11kvPtrMapping> feeder11kvPtrMapping = null;

  @JsonProperty("capacity")
  private String capacity = null;

  @JsonProperty("make")
  private String make = null;

  @JsonProperty("yearOfManufacturing")
  private Integer yearOfManufacturing = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Ptr id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
  **/
  @ApiModelProperty(example = "1", value = "")

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Ptr name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Satya sai ptr", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Ptr line33kvPtrMapping(List<Line33kvPtrMapping> line33kvPtrMapping) {
    this.line33kvPtrMapping = line33kvPtrMapping;
    return this;
  }

  public Ptr addLine33kvPtrMappingItem(Line33kvPtrMapping line33kvPtrMappingItem) {
    if (this.line33kvPtrMapping == null) {
      this.line33kvPtrMapping = new ArrayList<Line33kvPtrMapping>();
    }
    this.line33kvPtrMapping.add(line33kvPtrMappingItem);
    return this;
  }

  /**
   * Get line33kvPtrMapping
   * @return line33kvPtrMapping
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Line33kvPtrMapping> getLine33kvPtrMapping() {
    return line33kvPtrMapping;
  }

  public void setLine33kvPtrMapping(List<Line33kvPtrMapping> line33kvPtrMapping) {
    this.line33kvPtrMapping = line33kvPtrMapping;
  }

  public Ptr feeder11kvPtrMapping(List<Feeder11kvPtrMapping> feeder11kvPtrMapping) {
    this.feeder11kvPtrMapping = feeder11kvPtrMapping;
    return this;
  }

  public Ptr addFeeder11kvPtrMappingItem(Feeder11kvPtrMapping feeder11kvPtrMappingItem) {
    if (this.feeder11kvPtrMapping == null) {
      this.feeder11kvPtrMapping = new ArrayList<Feeder11kvPtrMapping>();
    }
    this.feeder11kvPtrMapping.add(feeder11kvPtrMappingItem);
    return this;
  }

  /**
   * Get feeder11kvPtrMapping
   * @return feeder11kvPtrMapping
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Feeder11kvPtrMapping> getFeeder11kvPtrMapping() {
    return feeder11kvPtrMapping;
  }

  public void setFeeder11kvPtrMapping(List<Feeder11kvPtrMapping> feeder11kvPtrMapping) {
    this.feeder11kvPtrMapping = feeder11kvPtrMapping;
  }

  public Ptr capacity(String capacity) {
    this.capacity = capacity;
    return this;
  }

  /**
   * Get capacity
   * @return capacity
  **/
  @ApiModelProperty(example = "440 kv", value = "")

  public String getCapacity() {
    return capacity;
  }

  public void setCapacity(String capacity) {
    this.capacity = capacity;
  }

  public Ptr make(String make) {
    this.make = make;
    return this;
  }

  /**
   * Get make
   * @return make
  **/
  @ApiModelProperty(example = "TATA", value = "")

  public String getMake() {
    return make;
  }

  public void setMake(String make) {
    this.make = make;
  }

  public Ptr yearOfManufacturing(Integer yearOfManufacturing) {
    this.yearOfManufacturing = yearOfManufacturing;
    return this;
  }

  /**
   * Get yearOfManufacturing
   * @return yearOfManufacturing
  **/
  @ApiModelProperty(example = "2018", value = "")

  public Integer getYearOfManufacturing() {
    return yearOfManufacturing;
  }

  public void setYearOfManufacturing(Integer yearOfManufacturing) {
    this.yearOfManufacturing = yearOfManufacturing;
  }

  public Ptr startDate(LocalDate startDate) {
    this.startDate = startDate;
    return this;
  }

  /**
   * Get startDate
   * @return startDate
  **/
  @ApiModelProperty(value = "")

  @Valid
  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public Ptr endDate(LocalDate endDate) {
    this.endDate = endDate;
    return this;
  }

  /**
   * Get endDate
   * @return endDate
  **/
  @ApiModelProperty(value = "")

  @Valid
  public LocalDate getEndDate() {
    return endDate;
  }

  public void setEndDate(LocalDate endDate) {
    this.endDate = endDate;
  }

  public Ptr isActive(Boolean isActive) {
    this.isActive = isActive;
    return this;
  }

  /**
   * Get isActive
   * @return isActive
  **/
  @ApiModelProperty(example = "true", value = "")

  public Boolean isIsActive() {
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
    Ptr ptr = (Ptr) o;
    return Objects.equals(this.id, ptr.id) &&
        Objects.equals(this.name, ptr.name) &&
        Objects.equals(this.line33kvPtrMapping, ptr.line33kvPtrMapping) &&
        Objects.equals(this.feeder11kvPtrMapping, ptr.feeder11kvPtrMapping) &&
        Objects.equals(this.capacity, ptr.capacity) &&
        Objects.equals(this.make, ptr.make) &&
        Objects.equals(this.yearOfManufacturing, ptr.yearOfManufacturing) &&
        Objects.equals(this.startDate, ptr.startDate) &&
        Objects.equals(this.endDate, ptr.endDate) &&
        Objects.equals(this.isActive, ptr.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, line33kvPtrMapping, feeder11kvPtrMapping, capacity, make, yearOfManufacturing, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Ptr {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    line33kvPtrMapping: ").append(toIndentedString(line33kvPtrMapping)).append("\n");
    sb.append("    feeder11kvPtrMapping: ").append(toIndentedString(feeder11kvPtrMapping)).append("\n");
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
