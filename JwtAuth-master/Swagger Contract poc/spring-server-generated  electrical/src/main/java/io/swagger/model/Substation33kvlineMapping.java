package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Line33kv;
import io.swagger.model.Substation;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Substation33kvlineMapping
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class Substation33kvlineMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("substation")
  private Substation substation = null;

  @JsonProperty("line33kv")
  private Line33kv line33kv = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

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
  @ApiModelProperty(example = "1", value = "")

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Substation33kvlineMapping substation(Substation substation) {
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

  public Substation33kvlineMapping line33kv(Line33kv line33kv) {
    this.line33kv = line33kv;
    return this;
  }

  /**
   * Get line33kv
   * @return line33kv
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Line33kv getLine33kv() {
    return line33kv;
  }

  public void setLine33kv(Line33kv line33kv) {
    this.line33kv = line33kv;
  }

  public Substation33kvlineMapping name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Satya sai 33Kv line", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Substation33kvlineMapping startDate(LocalDate startDate) {
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

  public Substation33kvlineMapping endDate(LocalDate endDate) {
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

  public Substation33kvlineMapping isActive(Boolean isActive) {
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
    Substation33kvlineMapping substation33kvlineMapping = (Substation33kvlineMapping) o;
    return Objects.equals(this.id, substation33kvlineMapping.id) &&
        Objects.equals(this.substation, substation33kvlineMapping.substation) &&
        Objects.equals(this.line33kv, substation33kvlineMapping.line33kv) &&
        Objects.equals(this.name, substation33kvlineMapping.name) &&
        Objects.equals(this.startDate, substation33kvlineMapping.startDate) &&
        Objects.equals(this.endDate, substation33kvlineMapping.endDate) &&
        Objects.equals(this.isActive, substation33kvlineMapping.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, substation, line33kv, name, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Substation33kvlineMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    substation: ").append(toIndentedString(substation)).append("\n");
    sb.append("    line33kv: ").append(toIndentedString(line33kv)).append("\n");
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
