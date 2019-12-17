package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Line33kvPtrMapping;
import io.swagger.model.Substation33kvlineMapping;
import java.util.ArrayList;
import java.util.List;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Line33kv
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-30T10:52:13.430Z[GMT]")
public class Line33kv   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("substation33kvlineMapping")
  @Valid
  private List<Substation33kvlineMapping> substation33kvlineMapping = null;

  @JsonProperty("line33kvPtrMapping")
  @Valid
  private List<Line33kvPtrMapping> line33kvPtrMapping = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Line33kv id(Integer id) {
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

  public Line33kv name(String name) {
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

  public Line33kv substation33kvlineMapping(List<Substation33kvlineMapping> substation33kvlineMapping) {
    this.substation33kvlineMapping = substation33kvlineMapping;
    return this;
  }

  public Line33kv addSubstation33kvlineMappingItem(Substation33kvlineMapping substation33kvlineMappingItem) {
    if (this.substation33kvlineMapping == null) {
      this.substation33kvlineMapping = new ArrayList<Substation33kvlineMapping>();
    }
    this.substation33kvlineMapping.add(substation33kvlineMappingItem);
    return this;
  }

  /**
   * Get substation33kvlineMapping
   * @return substation33kvlineMapping
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Substation33kvlineMapping> getSubstation33kvlineMapping() {
    return substation33kvlineMapping;
  }

  public void setSubstation33kvlineMapping(List<Substation33kvlineMapping> substation33kvlineMapping) {
    this.substation33kvlineMapping = substation33kvlineMapping;
  }

  public Line33kv line33kvPtrMapping(List<Line33kvPtrMapping> line33kvPtrMapping) {
    this.line33kvPtrMapping = line33kvPtrMapping;
    return this;
  }

  public Line33kv addLine33kvPtrMappingItem(Line33kvPtrMapping line33kvPtrMappingItem) {
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

  public Line33kv startDate(LocalDate startDate) {
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

  public Line33kv endDate(LocalDate endDate) {
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

  public Line33kv isActive(Boolean isActive) {
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
    Line33kv line33kv = (Line33kv) o;
    return Objects.equals(this.id, line33kv.id) &&
        Objects.equals(this.name, line33kv.name) &&
        Objects.equals(this.substation33kvlineMapping, line33kv.substation33kvlineMapping) &&
        Objects.equals(this.line33kvPtrMapping, line33kv.line33kvPtrMapping) &&
        Objects.equals(this.startDate, line33kv.startDate) &&
        Objects.equals(this.endDate, line33kv.endDate) &&
        Objects.equals(this.isActive, line33kv.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, substation33kvlineMapping, line33kvPtrMapping, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Line33kv {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    substation33kvlineMapping: ").append(toIndentedString(substation33kvlineMapping)).append("\n");
    sb.append("    line33kvPtrMapping: ").append(toIndentedString(line33kvPtrMapping)).append("\n");
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
