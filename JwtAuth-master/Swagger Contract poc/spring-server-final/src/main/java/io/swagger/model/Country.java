package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.State;
import java.util.ArrayList;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Country
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
public class Country   {
  @JsonProperty("countryId")
  private Integer countryId = null;

  @JsonProperty("countryName")
  private String countryName = null;

  @JsonProperty("stateId")
  @Valid
  private List<State> stateId = null;

  public Country countryId(Integer countryId) {
    this.countryId = countryId;
    return this;
  }

  /**
   * Get countryId
   * @return countryId
  **/
  @ApiModelProperty(example = "2001", value = "")

  public Integer getCountryId() {
    return countryId;
  }

  public void setCountryId(Integer countryId) {
    this.countryId = countryId;
  }

  public Country countryName(String countryName) {
    this.countryName = countryName;
    return this;
  }

  /**
   * Get countryName
   * @return countryName
  **/
  @ApiModelProperty(example = "Madhya Pradesh Paschim Kshetra Vidyut Vitaran Company Ltd", value = "")

  public String getCountryName() {
    return countryName;
  }

  public void setCountryName(String countryName) {
    this.countryName = countryName;
  }

  public Country stateId(List<State> stateId) {
    this.stateId = stateId;
    return this;
  }

  public Country addStateIdItem(State stateIdItem) {
    if (this.stateId == null) {
      this.stateId = new ArrayList<State>();
    }
    this.stateId.add(stateIdItem);
    return this;
  }

  /**
   * Get stateId
   * @return stateId
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<State> getStateId() {
    return stateId;
  }

  public void setStateId(List<State> stateId) {
    this.stateId = stateId;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Country country = (Country) o;
    return Objects.equals(this.countryId, country.countryId) &&
        Objects.equals(this.countryName, country.countryName) &&
        Objects.equals(this.stateId, country.stateId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(countryId, countryName, stateId);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Country {\n");
    
    sb.append("    countryId: ").append(toIndentedString(countryId)).append("\n");
    sb.append("    countryName: ").append(toIndentedString(countryName)).append("\n");
    sb.append("    stateId: ").append(toIndentedString(stateId)).append("\n");
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