package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Address;
import io.swagger.model.Division;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * SubDivision
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-27T11:55:04.724Z[GMT]")
public class SubDivision   {
  @JsonProperty("idDivision")
  private Integer idDivision = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("address")
  private Address address = null;

  @JsonProperty("division")
  private Division division = null;

  public SubDivision idDivision(Integer idDivision) {
    this.idDivision = idDivision;
    return this;
  }

  /**
   * Get idDivision
   * @return idDivision
  **/
  @ApiModelProperty(example = "2005", value = "")

  public Integer getIdDivision() {
    return idDivision;
  }

  public void setIdDivision(Integer idDivision) {
    this.idDivision = idDivision;
  }

  public SubDivision name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Indore Sub Division", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public SubDivision address(Address address) {
    this.address = address;
    return this;
  }

  /**
   * Get address
   * @return address
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }

  public SubDivision division(Division division) {
    this.division = division;
    return this;
  }

  /**
   * Get division
   * @return division
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Division getDivision() {
    return division;
  }

  public void setDivision(Division division) {
    this.division = division;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    SubDivision subDivision = (SubDivision) o;
    return Objects.equals(this.idDivision, subDivision.idDivision) &&
        Objects.equals(this.name, subDivision.name) &&
        Objects.equals(this.address, subDivision.address) &&
        Objects.equals(this.division, subDivision.division);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idDivision, name, address, division);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class SubDivision {\n");
    
    sb.append("    idDivision: ").append(toIndentedString(idDivision)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    division: ").append(toIndentedString(division)).append("\n");
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
