package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.model.EhvSsCircleMapping;
import java.util.ArrayList;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * EhvSs
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T12:54:27.285Z[GMT]")
public class EhvSs   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("egh")
  @Valid
  private List<EhvSsCircleMapping> egh = null;

  public EhvSs id(Integer id) {
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

  public EhvSs name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Satya sai EhvSs", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public EhvSs egh(List<EhvSsCircleMapping> egh) {
    this.egh = egh;
    return this;
  }

  public EhvSs addEghItem(EhvSsCircleMapping eghItem) {
    if (this.egh == null) {
      this.egh = new ArrayList<EhvSsCircleMapping>();
    }
    this.egh.add(eghItem);
    return this;
  }

  /**
   * Get egh
   * @return egh
  **/
  @ApiModelProperty(value = "")
  @Valid
  public List<EhvSsCircleMapping> getEgh() {
    return egh;
  }

  public void setEgh(List<EhvSsCircleMapping> egh) {
    this.egh = egh;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EhvSs ehvSs = (EhvSs) o;
    return Objects.equals(this.id, ehvSs.id) &&
        Objects.equals(this.name, ehvSs.name) &&
        Objects.equals(this.egh, ehvSs.egh);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, egh);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EhvSs {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    egh: ").append(toIndentedString(egh)).append("\n");
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
