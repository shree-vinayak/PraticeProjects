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
import io.swagger.model.DtrPoleMapping;
import io.swagger.model.PolePoleDeviceMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.*;

/**
 * Pole
 */
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class Pole   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("polePoleDeviceMapping")
  private List<PolePoleDeviceMapping> polePoleDeviceMapping = null;

  @JsonProperty("dtrPoleMapping")
  private List<DtrPoleMapping> dtrPoleMapping = null;

  @JsonProperty("number")
  private Long number = null;

  @JsonProperty("startDate")
  private Date startDate = null;

  @JsonProperty("endDate")
  private Date endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Pole id(Integer id) {
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

  public Pole polePoleDeviceMapping(List<PolePoleDeviceMapping> polePoleDeviceMapping) {
    this.polePoleDeviceMapping = polePoleDeviceMapping;
    return this;
  }

  public Pole addPolePoleDeviceMappingItem(PolePoleDeviceMapping polePoleDeviceMappingItem) {
    if (this.polePoleDeviceMapping == null) {
      this.polePoleDeviceMapping = new ArrayList<PolePoleDeviceMapping>();
    }
    this.polePoleDeviceMapping.add(polePoleDeviceMappingItem);
    return this;
  }

  /**
   * Get polePoleDeviceMapping
   * @return polePoleDeviceMapping
   **/
  @JsonProperty("polePoleDeviceMapping")
  @Schema(description = "")
  public List<PolePoleDeviceMapping> getPolePoleDeviceMapping() {
    return polePoleDeviceMapping;
  }

  public void setPolePoleDeviceMapping(List<PolePoleDeviceMapping> polePoleDeviceMapping) {
    this.polePoleDeviceMapping = polePoleDeviceMapping;
  }

  public Pole dtrPoleMapping(List<DtrPoleMapping> dtrPoleMapping) {
    this.dtrPoleMapping = dtrPoleMapping;
    return this;
  }

  public Pole addDtrPoleMappingItem(DtrPoleMapping dtrPoleMappingItem) {
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

  public Pole number(Long number) {
    this.number = number;
    return this;
  }

  /**
   * Get number
   * @return number
   **/
  @JsonProperty("number")
  @Schema(example = "34655", description = "")
  public Long getNumber() {
    return number;
  }

  public void setNumber(Long number) {
    this.number = number;
  }

  public Pole startDate(Date startDate) {
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

  public Pole endDate(Date endDate) {
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

  public Pole isActive(Boolean isActive) {
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
    Pole pole = (Pole) o;
    return Objects.equals(this.id, pole.id) &&
        Objects.equals(this.polePoleDeviceMapping, pole.polePoleDeviceMapping) &&
        Objects.equals(this.dtrPoleMapping, pole.dtrPoleMapping) &&
        Objects.equals(this.number, pole.number) &&
        Objects.equals(this.startDate, pole.startDate) &&
        Objects.equals(this.endDate, pole.endDate) &&
        Objects.equals(this.isActive, pole.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, polePoleDeviceMapping, dtrPoleMapping, number, startDate, endDate, isActive);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Pole {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    polePoleDeviceMapping: ").append(toIndentedString(polePoleDeviceMapping)).append("\n");
    sb.append("    dtrPoleMapping: ").append(toIndentedString(dtrPoleMapping)).append("\n");
    sb.append("    number: ").append(toIndentedString(number)).append("\n");
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