package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Address;
import io.swagger.model.Subdivision;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Zone
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
public class Zone   {
  @JsonProperty("idDivision")
  private Integer idDivision = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("email")
  private String email = null;

  @JsonProperty("contact")
  private Integer contact = null;

  @JsonProperty("address")
  private Address address = null;

  @JsonProperty("subDivision")
  private Subdivision subDivision = null;

  public Zone idDivision(Integer idDivision) {
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

  public Zone name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Satya Sai Zone", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Zone email(String email) {
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

  public Zone contact(Integer contact) {
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

  public Zone address(Address address) {
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

  public Zone subDivision(Subdivision subDivision) {
    this.subDivision = subDivision;
    return this;
  }

  /**
   * Get subDivision
   * @return subDivision
  **/
  @ApiModelProperty(value = "")

  @Valid
  public Subdivision getSubDivision() {
    return subDivision;
  }

  public void setSubDivision(Subdivision subDivision) {
    this.subDivision = subDivision;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Zone zone = (Zone) o;
    return Objects.equals(this.idDivision, zone.idDivision) &&
        Objects.equals(this.name, zone.name) &&
        Objects.equals(this.email, zone.email) &&
        Objects.equals(this.contact, zone.contact) &&
        Objects.equals(this.address, zone.address) &&
        Objects.equals(this.subDivision, zone.subDivision);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idDivision, name, email, contact, address, subDivision);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Zone {\n");
    
    sb.append("    idDivision: ").append(toIndentedString(idDivision)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    contact: ").append(toIndentedString(contact)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    subDivision: ").append(toIndentedString(subDivision)).append("\n");
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
