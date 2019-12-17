package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Address;
import io.swagger.model.Division;
import java.util.ArrayList;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Circle
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
public class Circle   {
  @JsonProperty("idCircle")
  private Integer idCircle = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("email")
  private String email = null;

  @JsonProperty("contact")
  private Integer contact = null;

  @JsonProperty("address")
  private Address address = null;

  @JsonProperty("division")
  @Valid
  private List<Division> division = null;

  public Circle idCircle(Integer idCircle) {
    this.idCircle = idCircle;
    return this;
  }

  /**
   * Get idCircle
   * @return idCircle
  **/
  @ApiModelProperty(example = "2003", value = "")

  public Integer getIdCircle() {
    return idCircle;
  }

  public void setIdCircle(Integer idCircle) {
    this.idCircle = idCircle;
  }

  public Circle name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Jabalupur Circle", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Circle email(String email) {
    this.email = email;
    return this;
  }

  /**
   * Get email
   * @return email
  **/
  @ApiModelProperty(example = "ankit@gmail.com", value = "")

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Circle contact(Integer contact) {
    this.contact = contact;
    return this;
  }

  /**
   * Get contact
   * @return contact
  **/
  @ApiModelProperty(example = "9893042451", value = "")

  public Integer getContact() {
    return contact;
  }

  public void setContact(Integer contact) {
    this.contact = contact;
  }

  public Circle address(Address address) {
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

  public Circle division(List<Division> division) {
    this.division = division;
    return this;
  }

  public Circle addDivisionItem(Division divisionItem) {
    if (this.division == null) {
      this.division = new ArrayList<Division>();
    }
    this.division.add(divisionItem);
    return this;
  }

  /**
   * Get division
   * @return division
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Division> getDivision() {
    return division;
  }

  public void setDivision(List<Division> division) {
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
    Circle circle = (Circle) o;
    return Objects.equals(this.idCircle, circle.idCircle) &&
        Objects.equals(this.name, circle.name) &&
        Objects.equals(this.email, circle.email) &&
        Objects.equals(this.contact, circle.contact) &&
        Objects.equals(this.address, circle.address) &&
        Objects.equals(this.division, circle.division);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idCircle, name, email, contact, address, division);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Circle {\n");
    
    sb.append("    idCircle: ").append(toIndentedString(idCircle)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    contact: ").append(toIndentedString(contact)).append("\n");
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
