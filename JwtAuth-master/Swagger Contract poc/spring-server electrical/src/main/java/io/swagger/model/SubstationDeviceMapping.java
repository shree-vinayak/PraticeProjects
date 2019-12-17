package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.SsDevice;
import io.swagger.model.Substation;
import io.swagger.model.SubstationDeviceMapping;
import java.util.ArrayList;
import java.util.List;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * SubstationDeviceMapping
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-30T10:52:13.430Z[GMT]")
public class SubstationDeviceMapping   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("substation")
  private Substation substation = null;

  @JsonProperty("ssDevice")
  private SsDevice ssDevice = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  @JsonProperty("substationDeviceMapping")
  @Valid
  private List<SubstationDeviceMapping> substationDeviceMapping = null;

  public SubstationDeviceMapping id(Integer id) {
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

  public SubstationDeviceMapping substation(Substation substation) {
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

  public SubstationDeviceMapping ssDevice(SsDevice ssDevice) {
    this.ssDevice = ssDevice;
    return this;
  }

  /**
   * Get ssDevice
   * @return ssDevice
  **/
  @ApiModelProperty(value = "")

  @Valid
  public SsDevice getSsDevice() {
    return ssDevice;
  }

  public void setSsDevice(SsDevice ssDevice) {
    this.ssDevice = ssDevice;
  }

  public SubstationDeviceMapping startDate(LocalDate startDate) {
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

  public SubstationDeviceMapping endDate(LocalDate endDate) {
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

  public SubstationDeviceMapping isActive(Boolean isActive) {
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

  public SubstationDeviceMapping substationDeviceMapping(List<SubstationDeviceMapping> substationDeviceMapping) {
    this.substationDeviceMapping = substationDeviceMapping;
    return this;
  }

  public SubstationDeviceMapping addSubstationDeviceMappingItem(SubstationDeviceMapping substationDeviceMappingItem) {
    if (this.substationDeviceMapping == null) {
      this.substationDeviceMapping = new ArrayList<SubstationDeviceMapping>();
    }
    this.substationDeviceMapping.add(substationDeviceMappingItem);
    return this;
  }

  /**
   * Get substationDeviceMapping
   * @return substationDeviceMapping
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<SubstationDeviceMapping> getSubstationDeviceMapping() {
    return substationDeviceMapping;
  }

  public void setSubstationDeviceMapping(List<SubstationDeviceMapping> substationDeviceMapping) {
    this.substationDeviceMapping = substationDeviceMapping;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    SubstationDeviceMapping substationDeviceMapping = (SubstationDeviceMapping) o;
    return Objects.equals(this.id, substationDeviceMapping.id) &&
        Objects.equals(this.substation, substationDeviceMapping.substation) &&
        Objects.equals(this.ssDevice, substationDeviceMapping.ssDevice) &&
        Objects.equals(this.startDate, substationDeviceMapping.startDate) &&
        Objects.equals(this.endDate, substationDeviceMapping.endDate) &&
        Objects.equals(this.isActive, substationDeviceMapping.isActive) &&
        Objects.equals(this.substationDeviceMapping, substationDeviceMapping.substationDeviceMapping);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, substation, ssDevice, startDate, endDate, isActive, substationDeviceMapping);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class SubstationDeviceMapping {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    substation: ").append(toIndentedString(substation)).append("\n");
    sb.append("    ssDevice: ").append(toIndentedString(ssDevice)).append("\n");
    sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
    sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
    sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
    sb.append("    substationDeviceMapping: ").append(toIndentedString(substationDeviceMapping)).append("\n");
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
