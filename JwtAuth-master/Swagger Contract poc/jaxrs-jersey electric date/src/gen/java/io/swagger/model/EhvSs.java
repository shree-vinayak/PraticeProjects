/*
 * Astute Energy API Specification.
 * Rest enpoints to be used with the Angular application for Astute Energy.
 *
 * OpenAPI spec version: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.model.EhvSsCircleMapping;
import io.swagger.model.Line33kv;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.*;

/**
 * EhvSs
 */
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class EhvSs   {
  @JsonProperty("id")
  private Integer id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("ehvSsCircleMapping")
  private List<EhvSsCircleMapping> ehvSsCircleMapping = null;

  @JsonProperty("line33kv")
  private List<Line33kv> line33kv = null;

  public EhvSs id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
   **/
  @JsonProperty("id")
  @Schema(example = "2005", description = "")
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
  @JsonProperty("name")
  @Schema(example = "Satya sai EhvSs", description = "")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public EhvSs ehvSsCircleMapping(List<EhvSsCircleMapping> ehvSsCircleMapping) {
    this.ehvSsCircleMapping = ehvSsCircleMapping;
    return this;
  }

  public EhvSs addEhvSsCircleMappingItem(EhvSsCircleMapping ehvSsCircleMappingItem) {
    if (this.ehvSsCircleMapping == null) {
      this.ehvSsCircleMapping = new ArrayList<EhvSsCircleMapping>();
    }
    this.ehvSsCircleMapping.add(ehvSsCircleMappingItem);
    return this;
  }

  /**
   * Get ehvSsCircleMapping
   * @return ehvSsCircleMapping
   **/
  @JsonProperty("ehvSsCircleMapping")
  @Schema(description = "")
  public List<EhvSsCircleMapping> getEhvSsCircleMapping() {
    return ehvSsCircleMapping;
  }

  public void setEhvSsCircleMapping(List<EhvSsCircleMapping> ehvSsCircleMapping) {
    this.ehvSsCircleMapping = ehvSsCircleMapping;
  }

  public EhvSs line33kv(List<Line33kv> line33kv) {
    this.line33kv = line33kv;
    return this;
  }

  public EhvSs addLine33kvItem(Line33kv line33kvItem) {
    if (this.line33kv == null) {
      this.line33kv = new ArrayList<Line33kv>();
    }
    this.line33kv.add(line33kvItem);
    return this;
  }

  /**
   * Get line33kv
   * @return line33kv
   **/
  @JsonProperty("line33kv")
  @Schema(description = "")
  public List<Line33kv> getLine33kv() {
    return line33kv;
  }

  public void setLine33kv(List<Line33kv> line33kv) {
    this.line33kv = line33kv;
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
        Objects.equals(this.ehvSsCircleMapping, ehvSs.ehvSsCircleMapping) &&
        Objects.equals(this.line33kv, ehvSs.line33kv);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, ehvSsCircleMapping, line33kv);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EhvSs {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    ehvSsCircleMapping: ").append(toIndentedString(ehvSsCircleMapping)).append("\n");
    sb.append("    line33kv: ").append(toIndentedString(line33kv)).append("\n");
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
