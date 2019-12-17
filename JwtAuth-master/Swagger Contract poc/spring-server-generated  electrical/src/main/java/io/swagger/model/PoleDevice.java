package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Vendor;
import org.threeten.bp.LocalDate;
import org.threeten.bp.OffsetDateTime;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * PoleDevice
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class PoleDevice   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("number")
  private Long number = null;

  @JsonProperty("instalationDate")
  private OffsetDateTime instalationDate = null;

  @JsonProperty("vendor")
  private Vendor vendor = null;

  @JsonProperty("simNumber")
  private Long simNumber = null;

  @JsonProperty("mobileNumber")
  private Long mobileNumber = null;

  @JsonProperty("telecomOperator")
  private String telecomOperator = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public PoleDevice id(Integer id) {
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

  public PoleDevice number(Long number) {
    this.number = number;
    return this;
  }

  /**
   * Get number
   * @return number
  **/
  @ApiModelProperty(example = "14648741687", value = "")

  public Long getNumber() {
    return number;
  }

  public void setNumber(Long number) {
    this.number = number;
  }

  public PoleDevice instalationDate(OffsetDateTime instalationDate) {
    this.instalationDate = instalationDate;
    return this;
  }

  /**
   * ...
   * @return instalationDate
  **/
  @ApiModelProperty(value = "...")

  @Valid
  public OffsetDateTime getInstalationDate() {
    return instalationDate;
  }

  public void setInstalationDate(OffsetDateTime instalationDate) {
    this.instalationDate = instalationDate;
  }

  public PoleDevice vendor(Vendor vendor) {
    this.vendor = vendor;
    return this;
  }

  /**
   * Get vendor
   * @return vendor
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Vendor getVendor() {
    return vendor;
  }

  public void setVendor(Vendor vendor) {
    this.vendor = vendor;
  }

  public PoleDevice simNumber(Long simNumber) {
    this.simNumber = simNumber;
    return this;
  }

  /**
   * Get simNumber
   * @return simNumber
  **/
  @ApiModelProperty(example = "1234569871564440", value = "")

  public Long getSimNumber() {
    return simNumber;
  }

  public void setSimNumber(Long simNumber) {
    this.simNumber = simNumber;
  }

  public PoleDevice mobileNumber(Long mobileNumber) {
    this.mobileNumber = mobileNumber;
    return this;
  }

  /**
   * Get mobileNumber
   * @return mobileNumber
  **/
  @ApiModelProperty(example = "9827517213", value = "")

  public Long getMobileNumber() {
    return mobileNumber;
  }

  public void setMobileNumber(Long mobileNumber) {
    this.mobileNumber = mobileNumber;
  }

  public PoleDevice telecomOperator(String telecomOperator) {
    this.telecomOperator = telecomOperator;
    return this;
  }

  /**
   * Get telecomOperator
   * @return telecomOperator
  **/
  @ApiModelProperty(example = "BSNL", value = "")

  public String getTelecomOperator() {
    return telecomOperator;
  }

  public void setTelecomOperator(String telecomOperator) {
    this.telecomOperator = telecomOperator;
  }

  public PoleDevice startDate(LocalDate startDate) {
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

  public PoleDevice endDate(LocalDate endDate) {
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

  public PoleDevice isActive(Boolean isActive) {
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
    PoleDevice poleDevice = (PoleDevice) o;
    return Objects.equals(this.id, poleDevice.id) &&
        Objects.equals(this.number, poleDevice.number) &&
        Objects.equals(this.instalationDate, poleDevice.instalationDate) &&
        Objects.equals(this.vendor, poleDevice.vendor) &&
        Objects.equals(this.simNumber, poleDevice.simNumber) &&
        Objects.equals(this.mobileNumber, poleDevice.mobileNumber) &&
        Objects.equals(this.telecomOperator, poleDevice.telecomOperator) &&
        Objects.equals(this.startDate, poleDevice.startDate) &&
        Objects.equals(this.endDate, poleDevice.endDate) &&
        Objects.equals(this.isActive, poleDevice.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, number, instalationDate, vendor, simNumber, mobileNumber, telecomOperator, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PoleDevice {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    number: ").append(toIndentedString(number)).append("\n");
    sb.append("    instalationDate: ").append(toIndentedString(instalationDate)).append("\n");
    sb.append("    vendor: ").append(toIndentedString(vendor)).append("\n");
    sb.append("    simNumber: ").append(toIndentedString(simNumber)).append("\n");
    sb.append("    mobileNumber: ").append(toIndentedString(mobileNumber)).append("\n");
    sb.append("    telecomOperator: ").append(toIndentedString(telecomOperator)).append("\n");
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
