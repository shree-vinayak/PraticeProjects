package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Pole;
import io.swagger.model.PoleDevice;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * PolePoleDeviceMapping
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class PolePoleDeviceMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("pole")
  private Pole pole = null;

  @JsonProperty("poleDevice")
  private PoleDevice poleDevice = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public PolePoleDeviceMapping id(Integer id) {
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

  public PolePoleDeviceMapping pole(Pole pole) {
    this.pole = pole;
    return this;
  }

  /**
   * Get pole
   * @return pole
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Pole getPole() {
    return pole;
  }

  public void setPole(Pole pole) {
    this.pole = pole;
  }

  public PolePoleDeviceMapping poleDevice(PoleDevice poleDevice) {
    this.poleDevice = poleDevice;
    return this;
  }

  /**
   * Get poleDevice
   * @return poleDevice
  **/
  @ApiModelProperty(value = "")

  @Valid
  public PoleDevice getPoleDevice() {
    return poleDevice;
  }

  public void setPoleDevice(PoleDevice poleDevice) {
    this.poleDevice = poleDevice;
  }

  public PolePoleDeviceMapping startDate(LocalDate startDate) {
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

  public PolePoleDeviceMapping endDate(LocalDate endDate) {
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

  public PolePoleDeviceMapping isActive(Boolean isActive) {
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
    PolePoleDeviceMapping polePoleDeviceMapping = (PolePoleDeviceMapping) o;
    return Objects.equals(this.id, polePoleDeviceMapping.id) &&
        Objects.equals(this.pole, polePoleDeviceMapping.pole) &&
        Objects.equals(this.poleDevice, polePoleDeviceMapping.poleDevice) &&
        Objects.equals(this.startDate, polePoleDeviceMapping.startDate) &&
        Objects.equals(this.endDate, polePoleDeviceMapping.endDate) &&
        Objects.equals(this.isActive, polePoleDeviceMapping.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, pole, poleDevice, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PolePoleDeviceMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    pole: ").append(toIndentedString(pole)).append("\n");
    sb.append("    poleDevice: ").append(toIndentedString(poleDevice)).append("\n");
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
