export const STYLES = `

.pa-1 {
  padding: 1rem !important;
}
.pr-1 {
  padding-right: 1rem !important;
}
.pl-1 {
  padding-left: 1rem !important;
}
.pt-1 {
  padding-top: 1rem !important;
}
.pb-1 {
  padding-bottom: 1rem !important;
}
.px-1 {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}
.px-3 {
  padding-left: 3rem !important;
  padding-right: 3rem !important;
}
.py-1 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

.ma-1 {
  margin: 1rem !important;
}
.mr-1 {
  margin-right: 1rem !important;
}
.ml-1 {
  margin-left: 1rem !important;
}
.mt-1 {
  margin-top: 1rem !important;
}
.mb-1 {
  margin-bottom: 1rem !important;
}
.mx-1 {
  margin-left: 1rem !important;
  margin-right: 1rem !important;
}
.my-1 {
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
}

.text-center {
  text-align: center;
}

.font-weight-bold{
  font-weight: bold;
}

.document * {
  font-size: 12px;
}

.document-view{
  border-left: 2px solid #424242;;
}

.document-parent {
  -webkit-print-color-adjust: exact;
  white-space: normal;
  overflow: hidden;
  padding: 0;
}

.document {
  background-color: white;
  color: black;
  overflow: hidden;
}

.orientation-portrait {
  width: 21cm;
  height: 29.6cm;
}

.orientation-landscape {
  width: 29.7cm;
  height: 20.9cm;
}

.lineme {
  display: flex;
  margin-top: 3px;
  margin-bottom: 3px
}

.signature {
  height: 3rem;
  display: flex;
  margin-top: 7px;
  margin-bottom: 3px;
}

.lineme:after {
  margin-left: 5px;
  display: block;
  content: "";
  border-bottom: 1px dotted;
  flex: 1 1 auto;
}

.signature:after {
  margin-left: 5px;
  display: block;
  content: "";
  border: 1px solid;
  flex: 1 1 auto;
}

.doc-header .doc-header-fields {
  margin-top: 20px;
}

.doc-header .doc-header-fields .doc-header-left {
  width: 45%;
  display: inline-block;
  vertical-align: top;
}

.doc-header .doc-header-fields .doc-header-right {
  float: right;
  width: 45%;
  display: inline-block;
  vertical-align: top;
}

.doc-group-details {
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}
.doc-group-details .group-header{
  font-size: 1.1rem;
}
.doc-group-details .group-table {
  border-collapse: collapse;
  width: 60%;
  margin: auto;
}
.doc-group-details .group-table .header {
  background-color: #d6d6d6;
}
.doc-group-details .group-table th {
  font-weight: bold;
}
.doc-group-details .group-table td, th {
  resize: both;
  border: 1px solid black;
  padding: 4px 5px;
  // white-space: initial;
  word-wrap: break-word;
}

.doc-grid {
  margin-top: 30px;
}
.doc-grid .doc-table {
  border-collapse: collapse;
}
.doc-grid .doc-table .section {
  background-color: #d6d6d6;
  //text-align: center;
  padding: 12px 5px;
}
.doc-grid .doc-table td, th {
  resize: both;
 // border: 1px solid black;
  padding: 4px 5px;
  // white-space: initial;
  word-wrap: break-word;
}
.doc-grid .doc-table td.no-border {
  border: 0;
}
.doc-grid .doc-table td.head {
  background-color: #d6d6d6;
  font-weight: bold;
}
.doc-grid .list-header {
  //border: 1px solid #000;
  padding-top: 5px;
  padding-bottom: 5px;
}
.doc-grid .comment-section {
  width: 100%;
  margin-top: 1rem;
  border-bottom: 1px dotted #000;
}

.ql-editor .fix-ql-ul {
  list-style: disc;
  //position: absolute;
}

.doc-footer .doc-footer-text {
  margin-top: 30px;
}
.doc-footer .doc-footer-fields {
  margin-top: 30px;
}
.doc-footer .doc-footer-fields .doc-footer-left {
  width: 45%;
  display: inline-block;
  vertical-align: top;
}

.doc-footer .doc-footer-fields .doc-footer-right {
  float: right;
  width: 45%;
  display: inline-block;
  vertical-align: top;
}
`;

const QLEDITORSTYLES = `
.ql-editor {
  box-sizing: border-box;
  cursor: text;
  line-height: 1.42;
  height: 100%;
  outline: none;
  overflow-y: auto;
  padding: 12px 15px;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.ql-editor p,
.ql-editor ol,
.ql-editor ul,
.ql-editor pre,
.ql-editor blockquote,
.ql-editor h1,
.ql-editor h2,
.ql-editor h3,
.ql-editor h4,
.ql-editor h5,
.ql-editor h6 {
  margin: 0;
  padding: 0;
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol,
.ql-editor ul {
  padding-left: 1.5em;
}
.ql-editor ol > li,
.ql-editor ul > li {
  list-style-type: none;
}
.ql-editor ul > li::before {
  content: '\\2022';
}
.ql-editor ul[data-checked=true],
.ql-editor ul[data-checked=false] {
  pointer-events: none;
}
.ql-editor ul[data-checked=true] > li *,
.ql-editor ul[data-checked=false] > li * {
  pointer-events: all;
}
.ql-editor ul[data-checked=true] > li::before,
.ql-editor ul[data-checked=false] > li::before {
  color: #777;
  cursor: pointer;
  pointer-events: all;
}
.ql-editor ul[data-checked=true] > li::before {
  content: '\\2611';
}
.ql-editor ul[data-checked=false] > li::before {
  content: '\\2610';
}
.ql-editor li::before {
  display: inline-block;
  margin-right: 0.3em;
  text-align: right;
  white-space: nowrap;
  width: 1.2em;
}
.ql-editor li:not(.ql-direction-rtl)::before {
  margin-left: -1.5em;
}
.ql-editor ol li,
.ql-editor ul li {
  padding-left: 1.5em;
}
.ql-editor ol li {
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  counter-increment: list-num;
}
.ql-editor ol li:before {
  content: counter(list-num, decimal) '. ';
}
.ql-editor ol li.ql-indent-1 {
  counter-increment: list-1;
}
.ql-editor ol li.ql-indent-1:before {
  content: counter(list-1, lower-alpha) '. ';
}
.ql-editor ol li.ql-indent-1 {
  counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-2 {
  counter-increment: list-2;
}
.ql-editor ol li.ql-indent-2:before {
  content: counter(list-2, lower-roman) '. ';
}
.ql-editor ol li.ql-indent-2 {
  counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-3 {
  counter-increment: list-3;
}
.ql-editor ol li.ql-indent-3:before {
  content: counter(list-3, decimal) '. ';
}
.ql-editor ol li.ql-indent-3 {
  counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-4 {
  counter-increment: list-4;
}
.ql-editor ol li.ql-indent-4:before {
  content: counter(list-4, lower-alpha) '. ';
}
.ql-editor ol li.ql-indent-4 {
  counter-reset: list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-5 {
  counter-increment: list-5;
}
.ql-editor ol li.ql-indent-5:before {
  content: counter(list-5, lower-roman) '. ';
}
.ql-editor ol li.ql-indent-5 {
  counter-reset: list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-6 {
  counter-increment: list-6;
}
.ql-editor ol li.ql-indent-6:before {
  content: counter(list-6, decimal) '. ';
}
.ql-editor ol li.ql-indent-6 {
  counter-reset: list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-7 {
  counter-increment: list-7;
}
.ql-editor ol li.ql-indent-7:before {
  content: counter(list-7, lower-alpha) '. ';
}
.ql-editor ol li.ql-indent-7 {
  counter-reset: list-8 list-9;
}
.ql-editor ol li.ql-indent-8 {
  counter-increment: list-8;
}
.ql-editor ol li.ql-indent-8:before {
  content: counter(list-8, lower-roman) '. ';
}
.ql-editor ol li.ql-indent-8 {
  counter-reset: list-9;
}
.ql-editor ol li.ql-indent-9 {
  counter-increment: list-9;
}
.ql-editor ol li.ql-indent-9:before {
  content: counter(list-9, decimal) '. ';
}
.ql-editor .ql-indent-1:not(.ql-direction-rtl) {
  padding-left: 3em;
}
.ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
  padding-left: 4.5em;
}
.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
  padding-right: 3em;
}
.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
  padding-right: 4.5em;
}
.ql-editor .ql-indent-2:not(.ql-direction-rtl) {
  padding-left: 6em;
}
.ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
  padding-left: 7.5em;
}
.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
  padding-right: 6em;
}
.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
  padding-right: 7.5em;
}
.ql-editor .ql-indent-3:not(.ql-direction-rtl) {
  padding-left: 9em;
}
.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
  padding-left: 10.5em;
}
.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
  padding-right: 9em;
}
.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
  padding-right: 10.5em;
}
.ql-editor .ql-indent-4:not(.ql-direction-rtl) {
  padding-left: 12em;
}
.ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
  padding-left: 13.5em;
}
.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
  padding-right: 12em;
}
.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
  padding-right: 13.5em;
}
.ql-editor .ql-indent-5:not(.ql-direction-rtl) {
  padding-left: 15em;
}
.ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
  padding-left: 16.5em;
}
.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
  padding-right: 15em;
}
.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
  padding-right: 16.5em;
}
.ql-editor .ql-indent-6:not(.ql-direction-rtl) {
  padding-left: 18em;
}
.ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
  padding-left: 19.5em;
}
.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
  padding-right: 18em;
}
.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
  padding-right: 19.5em;
}
.ql-editor .ql-indent-7:not(.ql-direction-rtl) {
  padding-left: 21em;
}
.ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
  padding-left: 22.5em;
}
.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
  padding-right: 21em;
}
.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
  padding-right: 22.5em;
}
.ql-editor .ql-indent-8:not(.ql-direction-rtl) {
  padding-left: 24em;
}
.ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
  padding-left: 25.5em;
}
.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
  padding-right: 24em;
}
.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
  padding-right: 25.5em;
}
.ql-editor .ql-indent-9:not(.ql-direction-rtl) {
  padding-left: 27em;
}
.ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
  padding-left: 28.5em;
}
.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
  padding-right: 27em;
}
.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
  padding-right: 28.5em;
}
.ql-editor .ql-video {
  display: block;
  max-width: 100%;
}
.ql-editor .ql-video.ql-align-center {
  margin: 0 auto;
}
.ql-editor .ql-video.ql-align-right {
  margin: 0 0 0 auto;
}
.ql-editor .ql-bg-black {
  background-color: #000;
}
.ql-editor .ql-bg-red {
  background-color: #e60000;
}
.ql-editor .ql-bg-orange {
  background-color: #f90;
}
.ql-editor .ql-bg-yellow {
  background-color: #ff0;
}
.ql-editor .ql-bg-green {
  background-color: #008a00;
}
.ql-editor .ql-bg-blue {
  background-color: #06c;
}
.ql-editor .ql-bg-purple {
  background-color: #93f;
}
.ql-editor .ql-color-white {
  color: #fff;
}
.ql-editor .ql-color-red {
  color: #e60000;
}
.ql-editor .ql-color-orange {
  color: #f90;
}
.ql-editor .ql-color-yellow {
  color: #ff0;
}
.ql-editor .ql-color-green {
  color: #008a00;
}
.ql-editor .ql-color-blue {
  color: #06c;
}
.ql-editor .ql-color-purple {
  color: #93f;
}
.ql-editor .ql-font-serif {
  font-family: Georgia, Times New Roman, serif;
}
.ql-editor .ql-font-monospace {
  font-family: Monaco, Courier New, monospace;
}
.ql-editor .ql-size-small {
  font-size: 0.75em;
}
.ql-editor .ql-size-large {
  font-size: 1.5em;
}
.ql-editor .ql-size-huge {
  font-size: 2.5em;
}
.ql-editor .ql-direction-rtl {
  direction: rtl;
  text-align: inherit;
}
.ql-editor .ql-align-center {
  text-align: center;
}
.ql-editor .ql-align-justify {
  text-align: justify;
}
.ql-editor .ql-align-right {
  text-align: right;
}
.ql-editor.ql-blank::before {
  color: rgba(0,0,0,0.6);
  content: attr(data-placeholder);
  font-style: italic;
  pointer-events: none;
  position: absolute;
}
.doc-rncp-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
`;

export const PRINTSTYLES = `
<style>
` + QLEDITORSTYLES + STYLES + `
</style>
`;
