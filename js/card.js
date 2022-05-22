export async function switchOn(doc) { 
   let circleBtn = doc.getElementsByClassName("threedot-btn");
   let cardList = doc.getElementsByClassName("card-click");
   let body = doc.body;
  
  circleBtn[0].addEventListener("click", function () {
    cardList[0].classList.toggle("on");
  });
   
   body.addEventListener("click", function (e) {
    e.target.classList.remove("on");
  });

}