package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * Address
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
public class Address   {
  @JsonProperty("idAddress")
  private Integer idAddress = null;

  @JsonProperty("address")
  private String address = null;

  public Address idAddress(Integer idAddress) {
    this.idAddress = idAddress;
    return this;
  }

  /**
   * Get idAddress
   * @return idAddress
  **/
  @ApiModelProperty(example = "2005", value = "")

  public Integer getIdAddress() {
    return idAddress;
  }

  public void setIdAddress(Integer idAddress) {
    this.idAddress = idAddress;
  }

  public Address address(String address) {
    this.address = address;
    return this;
  }

  /**
   * Get address
   * @return address
  **/
  @ApiModelProperty(example = "full address.", value = "")

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Address address = (Address) o;
    return Objects.equals(this.idAddress, address.idAddress) &&
        Objects.equals(this.address, address.address);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idAddress, address);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Address {\n");
    
    sb.append("    idAddress: ").append(toIndentedString(idAddress)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
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
