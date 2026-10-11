// Closing a dialog by clicking its backdrop, without closing for clicks
// on content or for drags that start inside. Escape remains native.
export function outsideDialog(rect,x,y) {
  return x<rect.left || x>rect.right || y<rect.top || y>rect.bottom;
}
export function enableBackdropDismiss(dialog, pointerMedia) {
  let downOutside=false;
  const fine=()=>pointerMedia.matches;
  dialog.addEventListener("pointerdown",e=>{
    downOutside=fine() && e.pointerType==="mouse" && e.target===dialog &&
      outsideDialog(dialog.getBoundingClientRect(),e.clientX,e.clientY);
  });
  dialog.addEventListener("pointerup",e=>{
    const upOutside=e.target===dialog&&outsideDialog(dialog.getBoundingClientRect(),e.clientX,e.clientY);
    if(downOutside && fine() && e.pointerType==="mouse" && upOutside && dialog.open)dialog.close();
    downOutside=false;
  });
  dialog.addEventListener("pointercancel",()=>downOutside=false);
  dialog.addEventListener("close",()=>downOutside=false);
}
