package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Address;
import io.swagger.model.Circle;
import java.util.ArrayList;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Region
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
public class Region   {
  @JsonProperty("idRegion")
  private Integer idRegion = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("email")
  private String email = null;

  @JsonProperty("contact")
  private Integer contact = null;

  @JsonProperty("address")
  private Address address = null;

  @JsonProperty("circle")
  @Valid
  private List<Circle> circle = null;

  public Region idRegion(Integer idRegion) {
    this.idRegion = idRegion;
    return this;
  }

  /**
   * Get idRegion
   * @return idRegion
  **/
  @ApiModelProperty(example = "2001", value = "")

  public Integer getIdRegion() {
    return idRegion;
  }

  public void setIdRegion(Integer idRegion) {
    this.idRegion = idRegion;
  }

  public Region name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Indore Region", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Region email(String email) {
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

  public Region contact(Integer contact) {
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

  public Region address(Address address) {
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

  public Region circle(List<Circle> circle) {
    this.circle = circle;
    return this;
  }

  public Region addCircleItem(Circle circleItem) {
    if (this.circle == null) {
      this.circle = new ArrayList<Circle>();
    }
    this.circle.add(circleItem);
    return this;
  }

  /**
   * Get circle
   * @return circle
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Circle> getCircle() {
    return circle;
  }

  public void setCircle(List<Circle> circle) {
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
    Region region = (Region) o;
    return Objects.equals(this.idRegion, region.idRegion) &&
        Objects.equals(this.name, region.name) &&
        Objects.equals(this.email, region.email) &&
        Objects.equals(this.contact, region.contact) &&
        Objects.equals(this.address, region.address) &&
        Objects.equals(this.circle, region.circle);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idRegion, name, email, contact, address, circle);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Region {\n");
    
    sb.append("    idRegion: ").append(toIndentedString(idRegion)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    contact: ").append(toIndentedString(contact)).append("\n");
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
