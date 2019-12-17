export class evalPDFModal {
    details: any;
    translation: any;
    pointsTableArr: any = '';
    pointsTableDataArr: any = '';
    toolboxArr2: any = '';
    toolboxArr: any = '';
    getData(detailsObj, translationObj) {
        this.details = detailsObj;
        this.translation = translationObj;

    }

    pdfGen(detailsObj, translationObj) {
        this.details = detailsObj;
        this.translation = translationObj;
        const Header = `
          <div class="head">
          <span class="head-div"> 
            <h4>${this.details.testDetails.name}/ ${this.details.scholarSeason}</h4>
          </span>
          <div class="body-div">
          <div class="bdy">
         <h6> ${this.details.selectedRNCP.shortName} : ${this.details.selectedRNCP.longName}</h6>
          </div>
          </div>
          </div>`;
        const nameBlock = `
      <div class="name-block">
        <span class="top-zero bottom-zero"> ${this.translation.school}: ${this.details.school} </span>
        <br> 
        <span class="top-zero" style="margin-left: 0px;"> ${this.translation.name} : ${this.details.selectedStudent} </span>
      </div>
    `;

        let i = 0;
        for (let section of this.details.testDetails.correctionGrid.correction.sections) {

            const pointsTable = `
    <div align="center">
    <table class="head" >
    <tr> 
      <th class="dark-head top-small bottom-small"> ${section.title} </th>
      <th class="dark-head top-zero bottom-zero">${this.details.form['total' + i]}/${section.maximumRating}</th>
    </tr>`;
            var index = 0;
            for (let subsection of section.subSections) {

                const pointsTableData = `
            <tr class="tbl-body">
            <td>
            ${subsection.title}
            </td>
            <td>${this.details.form['subSection-' + i + '-' + index]}/${subsection.maximumRating}</td>
            </tr>
            `;
                this.pointsTableDataArr += pointsTableData;
                index++;
            }

            this.pointsTableArr = pointsTable + this.pointsTableDataArr + this.pointsTableArr;
            i++;
        }




        const totalBox = `</table> </div>` + `<div class="totalBox">
        <table>`
        let i1 = 0;
        for (let section of this.details.sections) {
            this.toolboxArr;

            let index = 0;
            for (let subsection of section.subSections) {

                let toolb = `<tr>
          <th class="dark-head top-small bottom-small" > Total /${this.details.testDetails ? this.details.max : 0}  </th>
          <td> ${ this.details.testDetails.type == 'Jury' || this.details.testDetails.type == 'Memoire-ORAL' ? this.details.jury : this.details.testCorrect.correctionGrid.correction.total} </td>
        </tr>

        <tr>
          <th class="dark-head top-small bottom-small" > Total /${this.details.customMax}  </th>
          <td> ${this.details.testCorrect.correctionGrid.correction.additionalTotal} </td>
        </tr>
        
        `
                this.toolboxArr = toolb;
                index++;
            }
            this.toolboxArr2 = this.toolboxArr;
            i++;
        }


        const totalBox1 = `</table>
      </div>`;

        const footer = ` 
    <div class="footer clearfix"> 
      <table>
        <tr>
        <td class="no-outline"> <span class="bold-text" >Name du tutor en enterprise </span>: 
        <br> ${this.details.form.footer0}</td>
        `
        let footrArr = '';
        for (let field of this.details.testDetails.correctionGrid.footer.fields) {
            if (field.dataType == 'signature') {
                let signature = `
        <td class="no-outline"> <span class="bold-text" style="margin-top:-3px;" >${ field.value}</span>
        <img style="margin-left:5px;" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMzAgMzMwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMzAgMzMwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCI+CjxwYXRoIGlkPSJYTUxJRF8yOV8iIGQ9Ik0zMTUsMEgxNUM2LjcxNiwwLDAsNi43MTYsMCwxNXYzMDBjMCw4LjI4NCw2LjcxNiwxNSwxNSwxNWgzMDBjOC4yODQsMCwxNS02LjcxNiwxNS0xNVYxNSAgQzMzMCw2LjcxNiwzMjMuMjg0LDAsMzE1LDB6IE0yNjUuNjA2LDEwNy43OTZsLTEzNS42MiwxMzUuNjIxYy0yLjgxMywyLjgxMy02LjYyOSw0LjM5My0xMC42MDYsNC4zOTMgIGMtMy45NzksMC03Ljc5NC0xLjU4MS0xMC42MDctNC4zOTNsLTQ0LjM4MS00NC4zODFjLTUuODU3LTUuODU4LTUuODU3LTE1LjM1NSwwLjAwMS0yMS4yMTNjNS44NTgtNS44NTcsMTUuMzU0LTUuODU3LDIxLjIxNCwwICBsMzMuNzcyLDMzLjc3NEwyNDQuMzk0LDg2LjU4M2M1Ljg1Ny01Ljg1OCwxNS4zNTUtNS44NTgsMjEuMjEzLDBDMjcxLjQ2NSw5Mi40NCwyNzEuNDY1LDEwMS45MzgsMjY1LjYwNiwxMDcuNzk2eiIgZmlsbD0iIzAwMDAwMCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />
        </td>`
                footrArr += signature;
            }

        }
        const footer1 = `
        </tr>
      </table>
    </div>
   

  </div>
    `;
        return Header + nameBlock + this.pointsTableArr + totalBox + this.toolboxArr2 + totalBox1 + footer + footrArr + footer1;
    }
    CSSGenr() {
        return `<style>
         h6{
             font-size: 15px !important;
             margin-top:5px !important;
             padding-top:5px !important;
             font-weight:300;
         }

    .head h4, h6{
      text-align:center;
      margin: 2em 1em 1em 15px;
    }
    p{
        margin-top:-1px;
        margin-bottom:-1px;
        font-size:14px;
    }
    .head-div{
      background-color: #000;
      min-height:5px;
    }
    .head-div h4{
      padding-left:1em;
      margin-top:2em;
      margin-bottom:0px;
      padding-bottom:0px;
    }
    .body-div .bdy p{
      margin-top: 5px;
      padding-top: 0px;
      padding-left: 1em;   
    }
    .dark-head{
      background: #bfbdbd !important;
         -webkit-print-color-adjust: exact;
      padding:10px;
      font-size:14px;
    }
    .top-zero{
      margin-top: 0px;
      padding-top: 0px;
    }
    .top-small{
      margin-top: 4px !important;
      padding-top: 0px !important;
    }
    .bottom-zero{
      padding-bottom: 0px;
      margin-bottom: 0px;
    }
    .bottom-small{
      padding-bottom: -1px !important;
      margin-bottom: 3px !important;
    }
    table th, td{
      border: 1px solid #000;
    }
    .name-block span{
      padding-left:15px; 
      font-size:14px;
    }
    table {
      width: 48em;
      margin-left: 15px !important;
      margin-right: 15px;
    }
    .tbl-body td{
      padding:15px;
    }
    .r{
      float: right;
    }
    .l{
      float: left;
    }
    .footer{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      margin-bottom: 85px; 

    }
    .clearfix::after {
    content: "";
    clear: both;
    display: table;
    }
    .clearfix h4{
      margin-top:0px;
      padding: 0 15px 0 15px; 
    }
  .span-text {
     padding-left:15px
  }
  .tut{
    float: right;
    margin-top:-60px;
    padding-right:15px;
  }
  .head{
    margin-top:2em;
  }
  
  .bold-text{
    font-weight: 600;
    font-size:15px;
  }
  .totalBox table{
    width:50%;
    float:right;
    margin-top: 2em;
  }
  .totalBox table td{
    width: 200px;
    text-align:center;
  }
  .no-outline{
      text-align:left !important;
    border: 1px solid #fff;
  }
    </style>`
    }


}

