export const STYLES = `
 .full-width {
    width: 100%;
  }
  .pdfDomDisplay {
    display : block !important;
    font-size: 15px !important;
    font-weight:600 !important;
    word-break: break-word;
  }
  .pdfImage{
    height: 16px;
    width: 16px;
    display: inline-block;
  }

  .pdfImageCancel{
    height: 12px;
    width: 12px;
    display: inline-block;
  }

  .primary-background{
    background-color: #4747474;
  }

  .student-form-jobdescription .mat-input-element:disabled {
    color: black !important;
  }
  
  .student-form-jobdescription .form-title {
    color: black !important;
  }
  .student-form-jobdescription .title-labe-jobdesc{
    color: black !important;
  }
  
  .student-form{
    .row {
      margin-right: 0px !important;
    }
  }
  
  .form-title {
    padding-bottom: 2px;
    /*border-bottom: 1px solid rgba(0, 0, 0, 0.2);*/
    margin:0px;
    font-size: 15px;
    font-weight:600;
  }
  .mat-input-wrapper{
    margin: 5px 0 !important;
  }
  
  .form-sub-title {
    margin: 10px 0 6px;
    font-size: 13px;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  .ml-10 {
    margin-left: 10px;
  }
  
  .mt-18 {
    margin-top: 48px;
    margin-left: 2%;
  }
  
  .p0{
    padding: 0!important;
  }
  
  .job-description{
    font-size: 20px;
    font-weight: 600;
    text-align:center;
    display: none;
    margin-bottom: 5px;
  }
  .border-yellow{
    border: 2px solid #000000;
  }
  .border-yellow md-card-content{
    padding-bottom: 0px !important;
    padding-top: 0px !important;
    margin-top: 4px !important;
  }
  
  
  .form-group {
    margin-bottom: 1rem;
    display: -ms-flexbox;
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }
  
  .col-form-label {
    padding-top: calc(.5rem - 1px * 2);
    padding-bottom: calc(.5rem - 1px * 2);
    margin-bottom: 0;
  }
  
  .form-control-plaintext {
    padding-top: .5rem;
    padding-bottom: .5rem;
    margin-bottom: 0;
    line-height: 1.25;
    border: solid transparent;
    border-width: 1px 0;
  }
  
  @media (min-width: 576px) {
    .col-sm-2 {
      -ms-flex: 0 0 40%;
      flex: 0 0 40%;
      max-width: 40%;
    }
  
    .col-sm-10 {
      -ms-flex: 0 0 60%;
      flex: 0 0 60%;
      max-width: 60%;
    }
  }
  
  .mat-icon {
    padding: 16px;
  }
  
  .mat-checkbox-inner-container{
    margin-right: 8px!important;
  }  
  .mat-card {
    background: #424242;
    color: black;
    display: block;
    position: relative;
 }

    .mat-card .mat-card-content {
        padding: 5px 1rem;
        margin-bottom: 0;
        position: relative;
    }
    .mat-card-content {
        font-size: 14px;
    }
    .border-yellow {
        border: 2px solid #000000;
        margin: 4px 20px 0px 20px;
    }

    .mat-input-container {
        display: inline-block;
        position: relative;
        font-family: Roboto,"Helvetica Neue",sans-serif;
        line-height: normal;
        text-align: left;
    }
    .mat-input-wrapper {
        margin: 2px 0;
        padding-bottom: 6px;
        margin-left: 9px;
    }
    .mat-input-table {
        display: inline-table;
        flex-flow: column;
        vertical-align: bottom;
        width: 100%;
    }
    .mat-input-infix {
        position: relative;
    }
    .mat-input-table>* {
        display: table-cell;
    }
    .mat-input-element {
        font: inherit;
        background: 0 0;
        color: black;
        border: none;
        outline: 0;
        padding: 0;
        width: 100%;
        vertical-align: bottom;
    }

    .mat-input-underline {
        border-color: rgba(255, 255, 255, 0.4);
    }
    .mat-input-underline {
        position: absolute;
        height: 1px;
        width: 100%;
        margin-top: 4px;
        border-top-width: 1px;
        border-top-style: solid;
    }
    .mat-input-underline .mat-input-ripple {
        position: absolute;
        height: 2px;
        z-index: 1;
        top: -1px;
        width: 100%;
        transform-origin: 50%;
        transform: scaleX(.5);
        visibility: hidden;
        transition: background-color .3s cubic-bezier(.55,0,.55,.2);
    }
    .mat-card.mat-card {
        padding: 0px 0px 0px 15px;
        background-color: #474747;
    }
    .mat-card {
        background-color: #474747;
    }
    .mat-icon{
      display: none  !important;
    }
    .mat-checkbox-inner-container{
      display: none  !important;
    }
    .mat-checkbox{
      margin-left: 2px !important;
    }
    .mat-input-placeholder-wrapper {
      display: none;
      position: absolute;
      left: 0;
      top: -1em;
      width: 100%;
      padding-top: 1em;
      overflow: hidden;
      pointer-events: none;
      transform: translate3d(0,0,0);
  }

  .mat-input-placeholder {
    color: rgba(0, 0, 0, 0.3);
    font-size: 8px !important;
  }
  .title-labe-jobdesc{
    font-weight: 700;
  }

  button{
    display: none;
  }

  .mat-select-placeholder.mat-floating-placeholder {
    top: -15px !important;
    left: 0 !important;
  }

  .job-button{
    margin: 0px 37px;
    width: 170px;
    display: initial;
    display: inline-block;
  }
  
  .icons{
    font-size: 36px;
    float: right;
    margin-right: 10px;
    display: inline-block;
  }

  .para{
    max-width: 115px;
    margin: 2px 0px 0px 0px;
    color: black;
    font-weight: 700;
    font-size: 12px;
    display: inline-block;
  }

  .jobButton{
    width: 165px;
    padding: 7px;
    border-radius: 10px;
    background-color: #ffd740;
    border-color: #353535;
    cursor: default;
    display: inline-block;
  }

  .jobDescriptionCardStatus{
    text-align:center;
    margin-top: 3px;
    display: inline-block;
    margin-left: 14px;
    margin-right: -6px;
    margin-bottom: 10px;
  }

  .pdfImageCard{
    height: 30px;
    width: 30px;
    display: inline-block;
  }
  
  .pdfImageCancelCard{
    margin-top: 3px;
    height: 24px;
    width: 24px;
    display: inline-block;
  }

  #cardOneTitle{
    padding-bottom: 0px !important;
    padding-top: 0px !important;
    margin-top: 0px;
  }

  .objectiveMissionClass{
    border: 2px solid #000000; 
    margin-bottom: 10px;
    padding: 5px;
  }
  
  #objectiveMissionClassboxMargin{
    transform: translateX(-10px);
  }

  #paddingLeftAlignment{
    padding-left: 12px;
  }
  .textAreaMat   .mat-input-placeholder {
    font-size: 14px !important;
    color: black !important;
  }

  .textAreaMat .mat-select-placeholder.mat-floating-placeholder {
    top: -15px !important;
    left: 0 !important;
    display: inline-block;
    font-size: 16px !important;
  }
  .textAreaMat .mat-input-placeholder-wrapper {
    display: inline-block;
    position: absolute;
    left: 0;
    top: -1em;
    width: 100%;
    padding-top: 1em;
    overflow: hidden;
    pointer-events: none;
    transform: translate3d(0,0,0);
}
`;

const QLEDITORSTYLES = `
/* $cards
 ------------------------------------------*/
$mat-card-header-size: 40px !default;
body {
  .mat-card {
    padding: 0;
    margin: ($gutter/3);
    border-radius: $border-radius-base;
    @include mat-elevation(1);
    .mat-card-header {
      height: auto;
    }
    > :first-child {
      border-radius: $border-radius-base $border-radius-base 0 0;
    }
    > :last-child {
      border-radius: 0 0 $border-radius-base $border-radius-base;
    }
    [md-card-avatar] {
      height: $mat-card-header-size;
      width: $mat-card-header-size;
      border-radius: 50%;
    }
    [md-card-avatar] {
      font-size: 40px;
      line-height: 40px;
      margin: $gutter 0 0 $gutter;
    }
    /*********/
    .mat-card-image {
      width: 100%;
      margin: 0;
    }
    .mat-card-image:first-child {
      margin-top: 0;
      border-radius: $border-radius-base $border-radius-base 0 0;
    }
    .mat-card-title {
      padding-top: $gutter;
      padding-left: $gutter;
      padding-right: $gutter;
      line-height: 1;
      font-size: 16px;
      font-weight: 400;
    }
    .mat-card-subtitle {
      padding-left: $gutter;
      padding-right: $gutter;
      line-height: 1;
      font-size: 13px;
    }
    .mat-card-subtitle:first-child {
      padding-top: $gutter;
    }
    .mat-card-title:nth-child(2) {
      margin-top: -24px;
    }
    .mat-card-content {
      padding: $gutter;
      margin-bottom: 0;
      position: relative;
    }
    [md-fab-card-float] {
      top: -36px;
      position: absolute;
      right: 8px;
    }
    .mat-card-actions,
    .mat-card-actions:last-child {
      padding: $gutter / 2;
      margin: 0;
    }
    &.mat-card {
      padding: 0;
    }
    [md-card-float-icon] {
      position: absolute;
      right: 15px;
      top: 50%;
      margin-top: -20px;
      width: 40px;
      height: 40px;
      .material-icons {
        font-size: 40px;
        opacity: .2;
        transform: rotate(-5deg);
      }
    }
    [md-card-widget] {
      height: auto;
      display: flex;
      flex-direction: row;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-grid-row-align: center;
      align-items: center;
      -webkit-align-content: center;
      align-content: center;
      max-width: 100%;
      padding: $gutter;
      [md-card-widget-title], p {
        margin: 0;
        padding: 0;
      }
    }
    .card-image-header {
      position: relative;
      background-size: cover;
      background-position: center bottom;
      background-repeat: no-repat;
      width: 100%;
      img {
        border-radius: $border-radius-base $border-radius-base 0 0;
        display: block;
        max-width: 100%;
      }
    }
    &.card-widget {
      .card-widget-content {
        display: flex;
        flex-direction: row;
        height: 40px;
        margin: -($gutter/2) 0 $gutter 0;
      }
    }
  }
}

body [dir="rtl"] {
  .mat-card {
    [md-card-avatar] {
      margin: $gutter $gutter 0 0;
    }
    [md-fab-card-float] {
      right: auto;
      left: 8px;
    }
    [md-card-float-icon] {
      right: auto;
      left: 15px;
    }
  }
}
`;

export const PRINTSTYLES = `
<style>
` + QLEDITORSTYLES + STYLES + `
</style>
`;
