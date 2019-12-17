package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Address;
import io.swagger.model.Circle;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Division
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-27T11:55:04.724Z[GMT]")
public class Division   {
  @JsonProperty("idDivision")
  private Integer idDivision = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("address")
  private Address address = null;

  @JsonProperty("circle")
  private Circle circle = null;

  public Division idDivision(Integer idDivision) {
    this.idDivision = idDivision;
    return this;
  }

  /**
   * Get idDivision
   * @return idDivision
  **/
  @ApiModelProperty(example = "2004", value = "")

  public Integer getIdDivision() {
    return idDivision;
  }

  public void setIdDivision(Integer idDivision) {
    this.idDivision = idDivision;
  }

  public Division name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Indore Division", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Division address(Address address) {
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

  public Division circle(Circle circle) {
    this.circle = circle;
    return this;
  }

  /**
   * Get circle
   * @return circle
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Circle getCircle() {
    return circle;
  }

  public void setCircle(Circle circle) {
    this.circle = circle;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Division division = (Division) o;
    return Objects.equals(this.idDivision, division.idDivision) &&
        Objects.equals(this.name, division.name) &&
        Objects.equals(this.address, division.address) &&
        Objects.equals(this.circle, division.circle);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idDivision, name, address, circle);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Division {\n");
    
    sb.append("    idDivision: ").append(toIndentedString(idDivision)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    circle: ").append(toIndentedString(circle)).append("\n");
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
