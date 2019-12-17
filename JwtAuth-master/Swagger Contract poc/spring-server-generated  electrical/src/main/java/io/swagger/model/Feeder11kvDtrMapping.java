package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Dtr;
import io.swagger.model.Feeder11kv;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Feeder11kvDtrMapping
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class Feeder11kvDtrMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("feeder")
  private Feeder11kv feeder = null;

  @JsonProperty("dtr")
  private Dtr dtr = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Feeder11kvDtrMapping id(Integer id) {
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

  public Feeder11kvDtrMapping feeder(Feeder11kv feeder) {
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

  public Feeder11kvDtrMapping dtr(Dtr dtr) {
    this.dtr = dtr;
    return this;
  }

  /**
   * Get dtr
   * @return dtr
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Dtr getDtr() {
    return dtr;
  }

  public void setDtr(Dtr dtr) {
    this.dtr = dtr;
  }

  public Feeder11kvDtrMapping startDate(LocalDate startDate) {
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

  public Feeder11kvDtrMapping endDate(LocalDate endDate) {
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

  public Feeder11kvDtrMapping isActive(Boolean isActive) {
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
    Feeder11kvDtrMapping feeder11kvDtrMapping = (Feeder11kvDtrMapping) o;
    return Objects.equals(this.id, feeder11kvDtrMapping.id) &&
        Objects.equals(this.feeder, feeder11kvDtrMapping.feeder) &&
        Objects.equals(this.dtr, feeder11kvDtrMapping.dtr) &&
        Objects.equals(this.startDate, feeder11kvDtrMapping.startDate) &&
        Objects.equals(this.endDate, feeder11kvDtrMapping.endDate) &&
        Objects.equals(this.isActive, feeder11kvDtrMapping.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, feeder, dtr, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Feeder11kvDtrMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    feeder: ").append(toIndentedString(feeder)).append("\n");
    sb.append("    dtr: ").append(toIndentedString(dtr)).append("\n");
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
