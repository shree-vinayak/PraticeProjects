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
 * FeederSupply
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
public class FeederSupply   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("supplyType")
  private String supplyType = null;

  public FeederSupply id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
  **/
  @ApiModelProperty(example = "2005", value = "")

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public FeederSupply supplyType(String supplyType) {
    this.supplyType = supplyType;
    return this;
  }

  /**
   * Get supplyType
   * @return supplyType
  **/
  @ApiModelProperty(example = "Intra DC", value = "")

  public String getSupplyType() {
    return supplyType;
  }

  public void setSupplyType(String supplyType) {
    this.supplyType = supplyType;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    FeederSupply feederSupply = (FeederSupply) o;
    return Objects.equals(this.id, feederSupply.id) &&
        Objects.equals(this.supplyType, feederSupply.supplyType);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, supplyType);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class FeederSupply {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    supplyType: ").append(toIndentedString(supplyType)).append("\n");
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
