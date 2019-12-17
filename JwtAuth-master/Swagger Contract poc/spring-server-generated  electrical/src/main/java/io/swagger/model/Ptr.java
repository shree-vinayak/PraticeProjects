package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Substation;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Ptr
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class Ptr   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("substation")
  private Substation substation = null;

  @JsonProperty("name")
  private String name = null;

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

  public Ptr substation(Substation substation) {
    this.substation = substation;
    return this;
  }

  /**
   * Get substation
   * @return substation
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Substation getSubstation() {
    return substation;
  }

  public void setSubstation(Substation substation) {
    this.substation = substation;
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
        Objects.equals(this.substation, ptr.substation) &&
        Objects.equals(this.name, ptr.name) &&
        Objects.equals(this.capacity, ptr.capacity) &&
        Objects.equals(this.make, ptr.make) &&
        Objects.equals(this.yearOfManufacturing, ptr.yearOfManufacturing) &&
        Objects.equals(this.startDate, ptr.startDate) &&
        Objects.equals(this.endDate, ptr.endDate) &&
        Objects.equals(this.isActive, ptr.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, substation, name, capacity, make, yearOfManufacturing, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Ptr {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    substation: ").append(toIndentedString(substation)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
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
