module.exports = `
<html>

<body style="width: {{width}}px; height: {{width}}px;">
        <div style="
            background-color: black;
            width: {{stretchWidth}}px;
            height: 1px;
            margin-left: {{marginWidth}}px;
          "></div>
        <div>
          <div style="
            background-color: black;
            width: 1px;
            height: {{stretchWidth}}px;
            float: left;
            margin-top: {{topMargin}}px;
          "></div>
          <div style="
            background-color: black;
            width: 1px;
            height: {{paddingHeight}}px;
            float: right;
            margin-top: {{paddingTopMargin}}px;
          "></div>
          <div style="
            width: {{rectWidth}}px;
            height: {{rectWidth}}px;
            background-color: {{fillColor}};
            border-radius-inner: {{radius}}px;
            border: {{borderWidth}}px solid {{borderColor}};
            border-radius: {{radius}}px;
            margin-left: {{margin}}px;
            margin-right: {{margin}}px;
          "></div>
      </div>

      <div style="
          background-color: black;
          width: {{paddingWidth}}px;
          height: 1px;
          margin-left: {{paddingLeftMargin}}px;
        "></div>
</body>

</html>
`;
