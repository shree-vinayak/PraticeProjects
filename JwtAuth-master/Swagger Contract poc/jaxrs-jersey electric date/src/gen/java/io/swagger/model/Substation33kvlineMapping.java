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
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Date;
import javax.validation.constraints.*;

/**
 * Substation33kvlineMapping
 */
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class Substation33kvlineMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("startDate")
  private Date startDate = null;

  @JsonProperty("endDate")
  private Date endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Substation33kvlineMapping id(Integer id) {
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

  public Substation33kvlineMapping name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
   **/
  @JsonProperty("name")
  @Schema(example = "Satya sai 33Kv line", description = "")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Substation33kvlineMapping startDate(Date startDate) {
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

  public Substation33kvlineMapping endDate(Date endDate) {
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

  public Substation33kvlineMapping isActive(Boolean isActive) {
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
    Substation33kvlineMapping substation33kvlineMapping = (Substation33kvlineMapping) o;
    return Objects.equals(this.id, substation33kvlineMapping.id) &&
        Objects.equals(this.name, substation33kvlineMapping.name) &&
        Objects.equals(this.startDate, substation33kvlineMapping.startDate) &&
        Objects.equals(this.endDate, substation33kvlineMapping.endDate) &&
        Objects.equals(this.isActive, substation33kvlineMapping.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, startDate, endDate, isActive);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Substation33kvlineMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
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
