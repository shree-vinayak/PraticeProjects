package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Dtr;
import io.swagger.model.DtrDevice;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * DtrDtrDeviceMapping
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class DtrDtrDeviceMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("Dtr")
  private Dtr dtr = null;

  @JsonProperty("DtrDevice")
  private DtrDevice dtrDevice = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public DtrDtrDeviceMapping id(Integer id) {
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

  public DtrDtrDeviceMapping dtr(Dtr dtr) {
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

  public DtrDtrDeviceMapping dtrDevice(DtrDevice dtrDevice) {
    this.dtrDevice = dtrDevice;
    return this;
  }

  /**
   * Get dtrDevice
   * @return dtrDevice
  **/
  @ApiModelProperty(value = "")

  @Valid
  public DtrDevice getDtrDevice() {
    return dtrDevice;
  }

  public void setDtrDevice(DtrDevice dtrDevice) {
    this.dtrDevice = dtrDevice;
  }

  public DtrDtrDeviceMapping startDate(LocalDate startDate) {
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

  public DtrDtrDeviceMapping endDate(LocalDate endDate) {
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

  public DtrDtrDeviceMapping isActive(Boolean isActive) {
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
    DtrDtrDeviceMapping dtrDtrDeviceMapping = (DtrDtrDeviceMapping) o;
    return Objects.equals(this.id, dtrDtrDeviceMapping.id) &&
        Objects.equals(this.dtr, dtrDtrDeviceMapping.dtr) &&
        Objects.equals(this.dtrDevice, dtrDtrDeviceMapping.dtrDevice) &&
        Objects.equals(this.startDate, dtrDtrDeviceMapping.startDate) &&
        Objects.equals(this.endDate, dtrDtrDeviceMapping.endDate) &&
        Objects.equals(this.isActive, dtrDtrDeviceMapping.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, dtr, dtrDevice, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class DtrDtrDeviceMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    dtr: ").append(toIndentedString(dtr)).append("\n");
    sb.append("    dtrDevice: ").append(toIndentedString(dtrDevice)).append("\n");
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
