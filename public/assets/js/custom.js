function sameHeight(element1, element2){
  var idElement1 = document.getElementById(element1);
  var idElement2 = document.getElementById(element2);
  idElement1.style.height = idElement2.offsetHeight+'px';
}

$(document).ready(function(){
  sameHeight('pricePlan1', 'pricePlan2');
});

