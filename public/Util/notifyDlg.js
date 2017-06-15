// Declare a service that allows an error message.
app.factory("notifyDlg", ["$mdDialog", function(mdD) {
   return {
      show: function(scp, msg, hdr, btns, sz) {
         //scp.controller = 'dialogController';
         scp.msg = msg;
         scp.hdr = hdr;
         btns = btns || [true, true];
         scp.buttonOk = btns[0] && ['OK'];
         scp.buttonCancel = btns[1] && ['Cancel'];
         var dialogBox; 
          
         if (!scp.buttonCancel) {
            dialogBox = mdD.alert().title(hdr).textContent(msg)
             .ok('OK');
         }
         else if (scp.buttonOk && scp.buttonCancel) {
            dialogBox = mdD.confirm().title(hdr).textContent(msg)
             .ok('OK').cancel('Cancel');
         }
         return mdD.show(dialogBox);
      },
   };
}]);
