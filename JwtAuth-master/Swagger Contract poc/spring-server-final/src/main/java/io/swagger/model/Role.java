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
 * Role
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
public class Role   {
  @JsonProperty("idRole")
  private Integer idRole = null;

  @JsonProperty("create")
  private Integer create = null;

  @JsonProperty("read")
  private Integer read = null;

  @JsonProperty("update")
  private Integer update = null;

  @JsonProperty("delete")
  private Integer delete = null;

  @JsonProperty("execute")
  private Integer execute = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("nameShort")
  private String nameShort = null;

  public Role idRole(Integer idRole) {
    this.idRole = idRole;
    return this;
  }

  /**
   * Get idRole
   * @return idRole
  **/
  @ApiModelProperty(example = "2006", value = "")

  public Integer getIdRole() {
    return idRole;
  }

  public void setIdRole(Integer idRole) {
    this.idRole = idRole;
  }

  public Role create(Integer create) {
    this.create = create;
    return this;
  }

  /**
   * Get create
   * @return create
  **/
  @ApiModelProperty(example = "3252", value = "")

  public Integer getCreate() {
    return create;
  }

  public void setCreate(Integer create) {
    this.create = create;
  }

  public Role read(Integer read) {
    this.read = read;
    return this;
  }

  /**
   * Get read
   * @return read
  **/
  @ApiModelProperty(example = "235", value = "")

  public Integer getRead() {
    return read;
  }

  public void setRead(Integer read) {
    this.read = read;
  }

  public Role update(Integer update) {
    this.update = update;
    return this;
  }

  /**
   * Get update
   * @return update
  **/
  @ApiModelProperty(example = "234", value = "")

  public Integer getUpdate() {
    return update;
  }

  public void setUpdate(Integer update) {
    this.update = update;
  }

  public Role delete(Integer delete) {
    this.delete = delete;
    return this;
  }

  /**
   * Get delete
   * @return delete
  **/
  @ApiModelProperty(example = "325", value = "")

  public Integer getDelete() {
    return delete;
  }

  public void setDelete(Integer delete) {
    this.delete = delete;
  }

  public Role execute(Integer execute) {
    this.execute = execute;
    return this;
  }

  /**
   * Get execute
   * @return execute
  **/
  @ApiModelProperty(example = "452", value = "")

  public Integer getExecute() {
    return execute;
  }

  public void setExecute(Integer execute) {
    this.execute = execute;
  }

  public Role name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(example = "Aditya", value = "")

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Role nameShort(String nameShort) {
    this.nameShort = nameShort;
    return this;
  }

  /**
   * Get nameShort
   * @return nameShort
  **/
  @ApiModelProperty(example = "adu", value = "")

  public String getNameShort() {
    return nameShort;
  }

  public void setNameShort(String nameShort) {
    this.nameShort = nameShort;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Role role = (Role) o;
    return Objects.equals(this.idRole, role.idRole) &&
        Objects.equals(this.create, role.create) &&
        Objects.equals(this.read, role.read) &&
        Objects.equals(this.update, role.update) &&
        Objects.equals(this.delete, role.delete) &&
        Objects.equals(this.execute, role.execute) &&
        Objects.equals(this.name, role.name) &&
        Objects.equals(this.nameShort, role.nameShort);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idRole, create, read, update, delete, execute, name, nameShort);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Role {\n");
    
    sb.append("    idRole: ").append(toIndentedString(idRole)).append("\n");
    sb.append("    create: ").append(toIndentedString(create)).append("\n");
    sb.append("    read: ").append(toIndentedString(read)).append("\n");
    sb.append("    update: ").append(toIndentedString(update)).append("\n");
    sb.append("    delete: ").append(toIndentedString(delete)).append("\n");
    sb.append("    execute: ").append(toIndentedString(execute)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    nameShort: ").append(toIndentedString(nameShort)).append("\n");
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
