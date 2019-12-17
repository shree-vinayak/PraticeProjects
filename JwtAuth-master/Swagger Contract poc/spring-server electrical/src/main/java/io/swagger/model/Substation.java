package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Ptr;
import io.swagger.model.SsFeeder11kvMapping;
import io.swagger.model.Substation33kvlineMapping;
import io.swagger.model.SubstationDeviceMapping;
import java.util.ArrayList;
import java.util.List;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Substation
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-30T10:52:13.430Z[GMT]")
public class Substation   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("substation33kvlineMapping")
  @Valid
  private List<Substation33kvlineMapping> substation33kvlineMapping = null;

  @JsonProperty("substationDeviceMapping")
  @Valid
  private List<SubstationDeviceMapping> substationDeviceMapping = null;

  @JsonProperty("ssFeeder11kvMapping")
  @Valid
  private List<SsFeeder11kvMapping> ssFeeder11kvMapping = null;

  @JsonProperty("ptr")
  @Valid
  private List<Ptr> ptr = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Substation id(Integer id) {
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

  public Substation name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Satya sai substation", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Substation substation33kvlineMapping(List<Substation33kvlineMapping> substation33kvlineMapping) {
    this.substation33kvlineMapping = substation33kvlineMapping;
    return this;
  }

  public Substation addSubstation33kvlineMappingItem(Substation33kvlineMapping substation33kvlineMappingItem) {
    if (this.substation33kvlineMapping == null) {
      this.substation33kvlineMapping = new ArrayList<Substation33kvlineMapping>();
    }
    this.substation33kvlineMapping.add(substation33kvlineMappingItem);
    return this;
  }

  /**
   * Get substation33kvlineMapping
   * @return substation33kvlineMapping
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Substation33kvlineMapping> getSubstation33kvlineMapping() {
    return substation33kvlineMapping;
  }

  public void setSubstation33kvlineMapping(List<Substation33kvlineMapping> substation33kvlineMapping) {
    this.substation33kvlineMapping = substation33kvlineMapping;
  }

  public Substation substationDeviceMapping(List<SubstationDeviceMapping> substationDeviceMapping) {
    this.substationDeviceMapping = substationDeviceMapping;
    return this;
  }

  public Substation addSubstationDeviceMappingItem(SubstationDeviceMapping substationDeviceMappingItem) {
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

  public Substation ssFeeder11kvMapping(List<SsFeeder11kvMapping> ssFeeder11kvMapping) {
    this.ssFeeder11kvMapping = ssFeeder11kvMapping;
    return this;
  }

  public Substation addSsFeeder11kvMappingItem(SsFeeder11kvMapping ssFeeder11kvMappingItem) {
    if (this.ssFeeder11kvMapping == null) {
      this.ssFeeder11kvMapping = new ArrayList<SsFeeder11kvMapping>();
    }
    this.ssFeeder11kvMapping.add(ssFeeder11kvMappingItem);
    return this;
  }

  /**
   * Get ssFeeder11kvMapping
   * @return ssFeeder11kvMapping
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<SsFeeder11kvMapping> getSsFeeder11kvMapping() {
    return ssFeeder11kvMapping;
  }

  public void setSsFeeder11kvMapping(List<SsFeeder11kvMapping> ssFeeder11kvMapping) {
    this.ssFeeder11kvMapping = ssFeeder11kvMapping;
  }

  public Substation ptr(List<Ptr> ptr) {
    this.ptr = ptr;
    return this;
  }

  public Substation addPtrItem(Ptr ptrItem) {
    if (this.ptr == null) {
      this.ptr = new ArrayList<Ptr>();
    }
    this.ptr.add(ptrItem);
    return this;
  }

  /**
   * Get ptr
   * @return ptr
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Ptr> getPtr() {
    return ptr;
  }

  public void setPtr(List<Ptr> ptr) {
    this.ptr = ptr;
  }

  public Substation startDate(LocalDate startDate) {
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

  public Substation endDate(LocalDate endDate) {
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

  public Substation isActive(Boolean isActive) {
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
    Substation substation = (Substation) o;
    return Objects.equals(this.id, substation.id) &&
        Objects.equals(this.name, substation.name) &&
        Objects.equals(this.substation33kvlineMapping, substation.substation33kvlineMapping) &&
        Objects.equals(this.substationDeviceMapping, substation.substationDeviceMapping) &&
        Objects.equals(this.ssFeeder11kvMapping, substation.ssFeeder11kvMapping) &&
        Objects.equals(this.ptr, substation.ptr) &&
        Objects.equals(this.startDate, substation.startDate) &&
        Objects.equals(this.endDate, substation.endDate) &&
        Objects.equals(this.isActive, substation.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, substation33kvlineMapping, substationDeviceMapping, ssFeeder11kvMapping, ptr, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Substation {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    substation33kvlineMapping: ").append(toIndentedString(substation33kvlineMapping)).append("\n");
    sb.append("    substationDeviceMapping: ").append(toIndentedString(substationDeviceMapping)).append("\n");
    sb.append("    ssFeeder11kvMapping: ").append(toIndentedString(ssFeeder11kvMapping)).append("\n");
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
