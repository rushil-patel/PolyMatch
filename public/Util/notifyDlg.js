// Declare a service that allows an error message.
app.factory("notifyDlg", ["$mdDialog", function(mdD) {
   return {
      show: function(scp, msg, hdr, btns, sz) {
         scp.controller = 'dialogController';
         scp.msg = msg;
         scp.hdr = hdr;
         btns = btns || [true, true];
         scp.buttonOk = btns[0] && ['OK'];
         scp.buttonCancel = btns[1] && ['Cancel'];
         var confirm = mdD.confirm().title(hdr).textContent(msg);
          
         if (scp.buttonOk) {
            confirm.ok('OK');
         }
         if (scp.buttonCancel) {
            confirm.cancel('Cancel');
         }
         return mdD.show(confirm);
      },
   };
}]);
