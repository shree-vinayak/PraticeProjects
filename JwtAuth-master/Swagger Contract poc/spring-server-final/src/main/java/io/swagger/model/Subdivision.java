package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Address;
import io.swagger.model.Zone;
import java.util.ArrayList;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Subdivision
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
public class Subdivision   {
  @JsonProperty("idSubdivision")
  private Integer idSubdivision = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("email")
  private String email = null;

  @JsonProperty("contact")
  private Integer contact = null;

  @JsonProperty("address")
  private Address address = null;

  @JsonProperty("zone")
  @Valid
  private List<Zone> zone = null;

  public Subdivision idSubdivision(Integer idSubdivision) {
    this.idSubdivision = idSubdivision;
    return this;
  }

  /**
   * Get idSubdivision
   * @return idSubdivision
  **/
  @ApiModelProperty(example = "2005", value = "")

  public Integer getIdSubdivision() {
    return idSubdivision;
  }

  public void setIdSubdivision(Integer idSubdivision) {
    this.idSubdivision = idSubdivision;
  }

  public Subdivision name(String name) {
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

  public Subdivision email(String email) {
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

  public Subdivision contact(Integer contact) {
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

  public Subdivision address(Address address) {
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

  public Subdivision zone(List<Zone> zone) {
    this.zone = zone;
    return this;
  }

  public Subdivision addZoneItem(Zone zoneItem) {
    if (this.zone == null) {
      this.zone = new ArrayList<Zone>();
    }
    this.zone.add(zoneItem);
    return this;
  }

  /**
   * Get zone
   * @return zone
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Zone> getZone() {
    return zone;
  }

  public void setZone(List<Zone> zone) {
    this.zone = zone;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Subdivision subdivision = (Subdivision) o;
    return Objects.equals(this.idSubdivision, subdivision.idSubdivision) &&
        Objects.equals(this.name, subdivision.name) &&
        Objects.equals(this.email, subdivision.email) &&
        Objects.equals(this.contact, subdivision.contact) &&
        Objects.equals(this.address, subdivision.address) &&
        Objects.equals(this.zone, subdivision.zone);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idSubdivision, name, email, contact, address, zone);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Subdivision {\n");
    
    sb.append("    idSubdivision: ").append(toIndentedString(idSubdivision)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    contact: ").append(toIndentedString(contact)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    zone: ").append(toIndentedString(zone)).append("\n");
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
