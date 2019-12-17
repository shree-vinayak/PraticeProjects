package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Feeder11kv;
import io.swagger.model.Ptr;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Feeder11kvPtrMapping
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class Feeder11kvPtrMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("feeder")
  private Feeder11kv feeder = null;

  @JsonProperty("ptr")
  private Ptr ptr = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

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

  public Feeder11kvPtrMapping feeder(Feeder11kv feeder) {
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

  public Feeder11kvPtrMapping ptr(Ptr ptr) {
    this.ptr = ptr;
    return this;
  }

  /**
   * Get ptr
   * @return ptr
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Ptr getPtr() {
    return ptr;
  }

  public void setPtr(Ptr ptr) {
    this.ptr = ptr;
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
        Objects.equals(this.feeder, feeder11kvPtrMapping.feeder) &&
        Objects.equals(this.ptr, feeder11kvPtrMapping.ptr) &&
        Objects.equals(this.startDate, feeder11kvPtrMapping.startDate) &&
        Objects.equals(this.endDate, feeder11kvPtrMapping.endDate) &&
        Objects.equals(this.isActive, feeder11kvPtrMapping.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, feeder, ptr, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Feeder11kvPtrMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    feeder: ").append(toIndentedString(feeder)).append("\n");
    sb.append("    ptr: ").append(toIndentedString(ptr)).append("\n");
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
