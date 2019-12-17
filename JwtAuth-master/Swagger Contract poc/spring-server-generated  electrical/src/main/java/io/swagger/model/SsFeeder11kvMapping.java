package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Feeder11kv;
import io.swagger.model.Substation;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * SsFeeder11kvMapping
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class SsFeeder11kvMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("feeder")
  private Feeder11kv feeder = null;

  @JsonProperty("substation")
  private Substation substation = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public SsFeeder11kvMapping id(Integer id) {
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

  public SsFeeder11kvMapping feeder(Feeder11kv feeder) {
    this.feeder = feeder;
    return this;
  }

  /**
   * Get feeder
   * @return feeder
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Feeder11kv getFeeder() {
    return feeder;
  }

  public void setFeeder(Feeder11kv feeder) {
    this.feeder = feeder;
  }

  public SsFeeder11kvMapping substation(Substation substation) {
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

  public SsFeeder11kvMapping startDate(LocalDate startDate) {
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

  public SsFeeder11kvMapping endDate(LocalDate endDate) {
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

  public SsFeeder11kvMapping isActive(Boolean isActive) {
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
    SsFeeder11kvMapping ssFeeder11kvMapping = (SsFeeder11kvMapping) o;
    return Objects.equals(this.id, ssFeeder11kvMapping.id) &&
        Objects.equals(this.feeder, ssFeeder11kvMapping.feeder) &&
        Objects.equals(this.substation, ssFeeder11kvMapping.substation) &&
        Objects.equals(this.startDate, ssFeeder11kvMapping.startDate) &&
        Objects.equals(this.endDate, ssFeeder11kvMapping.endDate) &&
        Objects.equals(this.isActive, ssFeeder11kvMapping.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, feeder, substation, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class SsFeeder11kvMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    feeder: ").append(toIndentedString(feeder)).append("\n");
    sb.append("    substation: ").append(toIndentedString(substation)).append("\n");
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
