package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Feeder11kvPtrMapping;
import java.util.ArrayList;
import java.util.List;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Feeder11kvPtrMapping
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-30T10:52:13.430Z[GMT]")
public class Feeder11kvPtrMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  @JsonProperty("feeder11kvPtrMapping")
  @Valid
  private List<Feeder11kvPtrMapping> feeder11kvPtrMapping = null;

  public Feeder11kvPtrMapping id(Integer id) {
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

  public Feeder11kvPtrMapping startDate(LocalDate startDate) {
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

  public Feeder11kvPtrMapping endDate(LocalDate endDate) {
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

  public Feeder11kvPtrMapping isActive(Boolean isActive) {
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

  public Feeder11kvPtrMapping feeder11kvPtrMapping(List<Feeder11kvPtrMapping> feeder11kvPtrMapping) {
    this.feeder11kvPtrMapping = feeder11kvPtrMapping;
    return this;
  }

  public Feeder11kvPtrMapping addFeeder11kvPtrMappingItem(Feeder11kvPtrMapping feeder11kvPtrMappingItem) {
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


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Feeder11kvPtrMapping feeder11kvPtrMapping = (Feeder11kvPtrMapping) o;
    return Objects.equals(this.id, feeder11kvPtrMapping.id) &&
        Objects.equals(this.startDate, feeder11kvPtrMapping.startDate) &&
        Objects.equals(this.endDate, feeder11kvPtrMapping.endDate) &&
        Objects.equals(this.isActive, feeder11kvPtrMapping.isActive) &&
        Objects.equals(this.feeder11kvPtrMapping, feeder11kvPtrMapping.feeder11kvPtrMapping);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, startDate, endDate, isActive, feeder11kvPtrMapping);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Feeder11kvPtrMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
    sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
    sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
    sb.append("    feeder11kvPtrMapping: ").append(toIndentedString(feeder11kvPtrMapping)).append("\n");
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
