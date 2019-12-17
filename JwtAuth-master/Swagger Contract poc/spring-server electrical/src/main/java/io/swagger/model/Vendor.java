package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.DtrDevice;
import io.swagger.model.PoleDevice;
import io.swagger.model.SsDevice;
import java.util.ArrayList;
import java.util.List;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Vendor
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-30T10:52:13.430Z[GMT]")
public class Vendor   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("deviceType")
  private String deviceType = null;

  @JsonProperty("ss_device")
  @Valid
  private List<SsDevice> ssDevice = null;

  @JsonProperty("pole_device")
  @Valid
  private List<PoleDevice> poleDevice = null;

  @JsonProperty("dtrDevice")
  @Valid
  private List<DtrDevice> dtrDevice = null;

  @JsonProperty("vendorName")
  private String vendorName = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Vendor id(Integer id) {
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

  public Vendor deviceType(String deviceType) {
    this.deviceType = deviceType;
    return this;
  }

  /**
   * Get deviceType
   * @return deviceType
  **/
  @ApiModelProperty(example = "Substation Device", value = "")

  public String getDeviceType() {
    return deviceType;
  }

  public void setDeviceType(String deviceType) {
    this.deviceType = deviceType;
  }

  public Vendor ssDevice(List<SsDevice> ssDevice) {
    this.ssDevice = ssDevice;
    return this;
  }

  public Vendor addSsDeviceItem(SsDevice ssDeviceItem) {
    if (this.ssDevice == null) {
      this.ssDevice = new ArrayList<SsDevice>();
    }
    this.ssDevice.add(ssDeviceItem);
    return this;
  }

  /**
   * Get ssDevice
   * @return ssDevice
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<SsDevice> getSsDevice() {
    return ssDevice;
  }

  public void setSsDevice(List<SsDevice> ssDevice) {
    this.ssDevice = ssDevice;
  }

  public Vendor poleDevice(List<PoleDevice> poleDevice) {
    this.poleDevice = poleDevice;
    return this;
  }

  public Vendor addPoleDeviceItem(PoleDevice poleDeviceItem) {
    if (this.poleDevice == null) {
      this.poleDevice = new ArrayList<PoleDevice>();
    }
    this.poleDevice.add(poleDeviceItem);
    return this;
  }

  /**
   * Get poleDevice
   * @return poleDevice
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<PoleDevice> getPoleDevice() {
    return poleDevice;
  }

  public void setPoleDevice(List<PoleDevice> poleDevice) {
    this.poleDevice = poleDevice;
  }

  public Vendor dtrDevice(List<DtrDevice> dtrDevice) {
    this.dtrDevice = dtrDevice;
    return this;
  }

  public Vendor addDtrDeviceItem(DtrDevice dtrDeviceItem) {
    if (this.dtrDevice == null) {
      this.dtrDevice = new ArrayList<DtrDevice>();
    }
    this.dtrDevice.add(dtrDeviceItem);
    return this;
  }

  /**
   * Get dtrDevice
   * @return dtrDevice
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<DtrDevice> getDtrDevice() {
    return dtrDevice;
  }

  public void setDtrDevice(List<DtrDevice> dtrDevice) {
    this.dtrDevice = dtrDevice;
  }

  public Vendor vendorName(String vendorName) {
    this.vendorName = vendorName;
    return this;
  }

  /**
   * Get vendorName
   * @return vendorName
  **/
  @ApiModelProperty(example = "Shree Vinayak Pvt.Ltd", value = "")

  public String getVendorName() {
    return vendorName;
  }

  public void setVendorName(String vendorName) {
    this.vendorName = vendorName;
  }

  public Vendor startDate(LocalDate startDate) {
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

  public Vendor endDate(LocalDate endDate) {
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

  public Vendor isActive(Boolean isActive) {
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
    Vendor vendor = (Vendor) o;
    return Objects.equals(this.id, vendor.id) &&
        Objects.equals(this.deviceType, vendor.deviceType) &&
        Objects.equals(this.ssDevice, vendor.ssDevice) &&
        Objects.equals(this.poleDevice, vendor.poleDevice) &&
        Objects.equals(this.dtrDevice, vendor.dtrDevice) &&
        Objects.equals(this.vendorName, vendor.vendorName) &&
        Objects.equals(this.startDate, vendor.startDate) &&
        Objects.equals(this.endDate, vendor.endDate) &&
        Objects.equals(this.isActive, vendor.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, deviceType, ssDevice, poleDevice, dtrDevice, vendorName, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Vendor {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    deviceType: ").append(toIndentedString(deviceType)).append("\n");
    sb.append("    ssDevice: ").append(toIndentedString(ssDevice)).append("\n");
    sb.append("    poleDevice: ").append(toIndentedString(poleDevice)).append("\n");
    sb.append("    dtrDevice: ").append(toIndentedString(dtrDevice)).append("\n");
    sb.append("    vendorName: ").append(toIndentedString(vendorName)).append("\n");
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