package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Line33kv;
import io.swagger.model.Ptr;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Line33kvPtrMapping
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class Line33kvPtrMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("ptr")
  private Ptr ptr = null;

  @JsonProperty("line33kv")
  private Line33kv line33kv = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Line33kvPtrMapping id(Integer id) {
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

  public Line33kvPtrMapping ptr(Ptr ptr) {
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

  public Line33kvPtrMapping line33kv(Line33kv line33kv) {
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

  public Line33kvPtrMapping startDate(LocalDate startDate) {
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

  public Line33kvPtrMapping endDate(LocalDate endDate) {
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

  public Line33kvPtrMapping isActive(Boolean isActive) {
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
    Line33kvPtrMapping line33kvPtrMapping = (Line33kvPtrMapping) o;
    return Objects.equals(this.id, line33kvPtrMapping.id) &&
        Objects.equals(this.ptr, line33kvPtrMapping.ptr) &&
        Objects.equals(this.line33kv, line33kvPtrMapping.line33kv) &&
        Objects.equals(this.startDate, line33kvPtrMapping.startDate) &&
        Objects.equals(this.endDate, line33kvPtrMapping.endDate) &&
        Objects.equals(this.isActive, line33kvPtrMapping.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, ptr, line33kv, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Line33kvPtrMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    ptr: ").append(toIndentedString(ptr)).append("\n");
    sb.append("    line33kv: ").append(toIndentedString(line33kv)).append("\n");
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
