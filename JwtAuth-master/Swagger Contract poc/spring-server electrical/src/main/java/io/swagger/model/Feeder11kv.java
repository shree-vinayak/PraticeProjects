package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Feeder11kvDtrMapping;
import io.swagger.model.Feeder11kvPtrMapping;
import io.swagger.model.SsFeeder11kvMapping;
import java.util.ArrayList;
import java.util.List;
import org.threeten.bp.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Feeder11kv
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-30T10:52:13.430Z[GMT]")
public class Feeder11kv   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("feeder11kvDtrMapping")
  @Valid
  private List<Feeder11kvDtrMapping> feeder11kvDtrMapping = null;

  @JsonProperty("feeder11kvPtrMapping")
  @Valid
  private List<Feeder11kvPtrMapping> feeder11kvPtrMapping = null;

  @JsonProperty("ssFeeder11kvMapping")
  @Valid
  private List<SsFeeder11kvMapping> ssFeeder11kvMapping = null;

  @JsonProperty("feederType")
  private String feederType = null;

  @JsonProperty("feederSupply")
  private String feederSupply = null;

  @JsonProperty("startDate")
  private LocalDate startDate = null;

  @JsonProperty("endDate")
  private LocalDate endDate = null;

  @JsonProperty("isActive")
  private Boolean isActive = true;

  public Feeder11kv id(Integer id) {
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

  public Feeder11kv name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "saket", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Feeder11kv feeder11kvDtrMapping(List<Feeder11kvDtrMapping> feeder11kvDtrMapping) {
    this.feeder11kvDtrMapping = feeder11kvDtrMapping;
    return this;
  }

  public Feeder11kv addFeeder11kvDtrMappingItem(Feeder11kvDtrMapping feeder11kvDtrMappingItem) {
    if (this.feeder11kvDtrMapping == null) {
      this.feeder11kvDtrMapping = new ArrayList<Feeder11kvDtrMapping>();
    }
    this.feeder11kvDtrMapping.add(feeder11kvDtrMappingItem);
    return this;
  }

  /**
   * Get feeder11kvDtrMapping
   * @return feeder11kvDtrMapping
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Feeder11kvDtrMapping> getFeeder11kvDtrMapping() {
    return feeder11kvDtrMapping;
  }

  public void setFeeder11kvDtrMapping(List<Feeder11kvDtrMapping> feeder11kvDtrMapping) {
    this.feeder11kvDtrMapping = feeder11kvDtrMapping;
  }

  public Feeder11kv feeder11kvPtrMapping(List<Feeder11kvPtrMapping> feeder11kvPtrMapping) {
    this.feeder11kvPtrMapping = feeder11kvPtrMapping;
    return this;
  }

  public Feeder11kv addFeeder11kvPtrMappingItem(Feeder11kvPtrMapping feeder11kvPtrMappingItem) {
    if (this.feeder11kvPtrMapping == null) {
      this.feeder11kvPtrMapping = new ArrayList<Feeder11kvPtrMapping>();
    }
    this.feeder11kvPtrMapping.add(feeder11kvPtrMappingItem);
    return this;
  }

  /**
   * Get feeder11kvPtrMapping
   * @return feeder11kvPtrMapping
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Feeder11kvPtrMapping> getFeeder11kvPtrMapping() {
    return feeder11kvPtrMapping;
  }

  public void setFeeder11kvPtrMapping(List<Feeder11kvPtrMapping> feeder11kvPtrMapping) {
    this.feeder11kvPtrMapping = feeder11kvPtrMapping;
  }

  public Feeder11kv ssFeeder11kvMapping(List<SsFeeder11kvMapping> ssFeeder11kvMapping) {
    this.ssFeeder11kvMapping = ssFeeder11kvMapping;
    return this;
  }

  public Feeder11kv addSsFeeder11kvMappingItem(SsFeeder11kvMapping ssFeeder11kvMappingItem) {
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

  public Feeder11kv feederType(String feederType) {
    this.feederType = feederType;
    return this;
  }

  /**
   * Get feederType
   * @return feederType
  **/
  @ApiModelProperty(example = "Agriculture Feeder", value = "")

  public String getFeederType() {
    return feederType;
  }

  public void setFeederType(String feederType) {
    this.feederType = feederType;
  }

  public Feeder11kv feederSupply(String feederSupply) {
    this.feederSupply = feederSupply;
    return this;
  }

  /**
   * Get feederSupply
   * @return feederSupply
  **/
  @ApiModelProperty(example = "11Kv", value = "")

  public String getFeederSupply() {
    return feederSupply;
  }

  public void setFeederSupply(String feederSupply) {
    this.feederSupply = feederSupply;
  }

  public Feeder11kv startDate(LocalDate startDate) {
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

  public Feeder11kv endDate(LocalDate endDate) {
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

  public Feeder11kv isActive(Boolean isActive) {
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
    Feeder11kv feeder11kv = (Feeder11kv) o;
    return Objects.equals(this.id, feeder11kv.id) &&
        Objects.equals(this.name, feeder11kv.name) &&
        Objects.equals(this.feeder11kvDtrMapping, feeder11kv.feeder11kvDtrMapping) &&
        Objects.equals(this.feeder11kvPtrMapping, feeder11kv.feeder11kvPtrMapping) &&
        Objects.equals(this.ssFeeder11kvMapping, feeder11kv.ssFeeder11kvMapping) &&
        Objects.equals(this.feederType, feeder11kv.feederType) &&
        Objects.equals(this.feederSupply, feeder11kv.feederSupply) &&
        Objects.equals(this.startDate, feeder11kv.startDate) &&
        Objects.equals(this.endDate, feeder11kv.endDate) &&
        Objects.equals(this.isActive, feeder11kv.isActive);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, feeder11kvDtrMapping, feeder11kvPtrMapping, ssFeeder11kvMapping, feederType, feederSupply, startDate, endDate, isActive);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Feeder11kv {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    feeder11kvDtrMapping: ").append(toIndentedString(feeder11kvDtrMapping)).append("\n");
    sb.append("    feeder11kvPtrMapping: ").append(toIndentedString(feeder11kvPtrMapping)).append("\n");
    sb.append("    ssFeeder11kvMapping: ").append(toIndentedString(ssFeeder11kvMapping)).append("\n");
    sb.append("    feederType: ").append(toIndentedString(feederType)).append("\n");
    sb.append("    feederSupply: ").append(toIndentedString(feederSupply)).append("\n");
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