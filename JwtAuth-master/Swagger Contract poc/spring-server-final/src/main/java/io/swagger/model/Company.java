package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.Address;
import io.swagger.model.Region;
import java.util.ArrayList;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Company
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
public class Company   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("logo")
  private String logo = null;

  @JsonProperty("initials")
  private String initials = null;

  @JsonProperty("email")
  private String email = null;

  @JsonProperty("contact")
  private Integer contact = null;

  @JsonProperty("address")
  private Address address = null;

  @JsonProperty("region")
  @Valid
  private List<Region> region = null;

  public Company id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
  **/
  @ApiModelProperty(example = "2001", value = "")

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Company name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Madhya Pradesh Paschim Kshetra Vidyut Vitaran Company Ltd", required = true, value = "")
  @NotNull

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Company logo(String logo) {
    this.logo = logo;
    return this;
  }

  /**
   * Get logo
   * @return logo
  **/
  @ApiModelProperty(example = "dfjkldsfkhsdjfhldksjhhfslkjdhfjklsdhflkhdsjkfhsdbflbxcvkjlhsljfhdsklflsbfldfkjldshfjkhvljkfhksjdfhjksdbfklbfkjldshfkldsbvlkafhklsdjhflvblakjslahfklsfkjlasdlfkbsdflashflkjsdhflksdhflkshadfklhsdlfkhsalkjfsfhlsadkj", value = "")

  public String getLogo() {
    return logo;
  }

  public void setLogo(String logo) {
    this.logo = logo;
  }

  public Company initials(String initials) {
    this.initials = initials;
    return this;
  }

  /**
   * Get initials
   * @return initials
  **/
  @ApiModelProperty(example = "MPWZ", value = "")

  public String getInitials() {
    return initials;
  }

  public void setInitials(String initials) {
    this.initials = initials;
  }

  public Company email(String email) {
    this.email = email;
    return this;
  }

  /**
   * Get email
   * @return email
  **/
  @ApiModelProperty(example = "ankit@gmail.com", required = true, value = "")
  @NotNull

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Company contact(Integer contact) {
    this.contact = contact;
    return this;
  }

  /**
   * Get contact
   * @return contact
  **/
  @ApiModelProperty(example = "9893042451", required = true, value = "")
  @NotNull

  public Integer getContact() {
    return contact;
  }

  public void setContact(Integer contact) {
    this.contact = contact;
  }

  public Company address(Address address) {
    this.address = address;
    return this;
  }

  /**
   * Get address
   * @return address
  **/
  @ApiModelProperty(required = true, value = "")
  @NotNull

  @Valid
  public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }

  public Company region(List<Region> region) {
    this.region = region;
    return this;
  }

  public Company addRegionItem(Region regionItem) {
    if (this.region == null) {
      this.region = new ArrayList<Region>();
    }
    this.region.add(regionItem);
    return this;
  }

  /**
   * Get region
   * @return region
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<Region> getRegion() {
    return region;
  }

  public void setRegion(List<Region> region) {
    this.region = region;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Company company = (Company) o;
    return Objects.equals(this.id, company.id) &&
        Objects.equals(this.name, company.name) &&
        Objects.equals(this.logo, company.logo) &&
        Objects.equals(this.initials, company.initials) &&
        Objects.equals(this.email, company.email) &&
        Objects.equals(this.contact, company.contact) &&
        Objects.equals(this.address, company.address) &&
        Objects.equals(this.region, company.region);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, logo, initials, email, contact, address, region);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Company {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    logo: ").append(toIndentedString(logo)).append("\n");
    sb.append("    initials: ").append(toIndentedString(initials)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    contact: ").append(toIndentedString(contact)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    region: ").append(toIndentedString(region)).append("\n");
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
